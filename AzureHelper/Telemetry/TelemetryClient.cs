using System;
using System.Linq;
using System.Collections.Generic;
using Toptal.BikeRentals.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.ApplicationInsights.DataContracts;
using System.Reflection;
using System.Runtime.InteropServices;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration.Helpers;
using System.Globalization;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Logging.Telemetry;

namespace Toptal.BikeRentals.AzureHelper.Telemetry
{
    /// <summary>
    /// Diagnose exceptions in your web apps with Application Insights
    /// https://docs.microsoft.com/en-us/azure/application-insights/app-insights-asp-net-exceptions
    /// 
    /// Application Insights API for custom events and metrics
    /// https://docs.microsoft.com/en-us/azure/application-insights/app-insights-api-custom-events-metrics
    /// </summary>
    public sealed class TelemetryClient : Logging.MicrosoftExtensions.Logger, ITelemetryLogger
    {
        public TelemetryClient(ILogger<object> logger, ICallContext callContext, AppConfig appConfig, IAuthProvider authProvider)
            : base(logger)
        {
            this.AppConfig = appConfig ?? throw new ArgumentNullException(nameof(appConfig));
            this.AuthProvider = authProvider;
            this.CallContext = callContext;
        }

        static TelemetryClient()
        {
            LogLevelToSeverityLevel = new SeverityLevel[(Enum.GetValues(typeof(LogLevel)) as LogLevel[]).Max(t => (int)t) + 1];

            LogLevelToSeverityLevel[(int)LogLevel.Critical] = SeverityLevel.Critical;
            LogLevelToSeverityLevel[(int)LogLevel.Debug] = SeverityLevel.Verbose;
            LogLevelToSeverityLevel[(int)LogLevel.Error] = SeverityLevel.Error;
            LogLevelToSeverityLevel[(int)LogLevel.Information] = SeverityLevel.Information;
            LogLevelToSeverityLevel[(int)LogLevel.None] = SeverityLevel.Verbose;
            LogLevelToSeverityLevel[(int)LogLevel.Trace] = SeverityLevel.Information;
            LogLevelToSeverityLevel[(int)LogLevel.Warning] = SeverityLevel.Warning;
        }

        #region Services

        private AppConfig AppConfig;

        private IAuthProvider AuthProvider;

        private ICallContext CallContext;

        private Microsoft.ApplicationInsights.TelemetryClient _Client;

        private bool TriedCreatingClient;

        private Microsoft.ApplicationInsights.TelemetryClient Client
        {
            get
            {
                if (_Client == null)
                    _Client = CreateClient();

                return _Client;
            }
        }

        private Microsoft.ApplicationInsights.TelemetryClient CreateClient()
        {
            // error occured during creation, don't try to create again (endless loop when logging the error)
            if (TriedCreatingClient) return null;

            TriedCreatingClient = true;

            var client = new Microsoft.ApplicationInsights.TelemetryClient(
                // for Unit tests we need to specify the Id
                new Microsoft.ApplicationInsights.Extensibility.TelemetryConfiguration(AppConfig.ApplicationInsights.InstrumentationKey)
                );

            try
            {
                client.Context.Component.Version = typeof(RuntimeEnvironment).GetTypeInfo().Assembly.GetCustomAttribute<AssemblyFileVersionAttribute>().Version;

                var userId = $"{AuthProvider.CurrentUser?.UserId}";

                client.Context.User.AuthenticatedUserId = userId;
                client.Context.User.Id = userId;
                client.Context.User.AccountId = userId;

                client.Context.Properties.Add("User id", userId);
                client.Context.Properties.Add("User name", AuthProvider.CurrentUser?.UserName);
                client.Context.Properties.Add("User full name", AuthProvider.CurrentUser?.FullName);
                //client.Context.Properties.Add("User tenant id", $"{AuthProvider.CurrentUser?.TenantId}");
                client.Context.Properties.Add("User email", AuthProvider.CurrentUser?.Email);

                client.Context.Properties.Add("Request URL host", AppConfig.WebApplication.BaseUrl);
                client.Context.Properties.Add("Request URL path", CallContext.ResourceUri);
                client.Context.Properties.Add("AspNetCoreEnvironment", AppConfig.WebApplication.HostingEnvironment.ToString());
                client.Context.Properties.Add("DeveloperMode", AppConfig.WebApplication.HostingEnvironment.IsDevelopment().ToString());
                client.Context.Properties.Add("View page name", CallContext.ActiveController?.Name);
            }
            catch
            {
                // additional meta-data should not block execution
                throw;
            }

            return client;
        }

        #endregion

        #region Obsolete Code (see Logging.ILogger)

        ///// <summary>
        ///// Not used
        ///// Errors are logged using Microsoft.Extensions.ILogger into Application Insights, see Toptal.BikeRentals.Logging
        ///// </summary>
        //public void TrackException(Exception exception)
        //{
        //    if (exception != null)
        //    {
        //        if (exception.InnerException != null)
        //            TrackException(exception.InnerException);

        //        if (exception is AppException appException)
        //        {
        //            Client.TrackException(exception, new Dictionary<string, string>
        //            {
        //                { "StatusCode", appException.Status.ToString() },
        //                { "StatusText", appException.StatusText.ToString() },
        //                { "LogLevel", appException.LogLevel.ToString() },
        //                { "DetailerErrorMessage ", appException.DetailerErrorMessage }
        //            });
        //        }
        //        else
        //            Client.TrackException(exception);
        //    }
        //}



        #endregion

        #region Helpers

        /// <summary>
        /// If addDateTime is sppecified Year, Month, Day properties are added. If time portion is not 00:00:00.000 then also Hour is added.
        /// </summary>
        public static Dictionary<string, string> GetProperties(LogType logType, ITelemetryPropertyProvider properties, DateTime? addDateTime, TelemetryEvent? eventName)
        {
            var dict = new Dictionary<string, string>();

            if (eventName.HasValue)
                dict.Add("Event name", eventName.Value.Title());

            if (addDateTime.HasValue)
            {
                dict.Add("Year", addDateTime.Value.ToString("yyyy"));
                dict.Add("Quarter", $"Q{(addDateTime.Value.Month + 2) / 3}");
                dict.Add("Month", addDateTime.Value.ToString("MM"));
                dict.Add("Month name", addDateTime.Value.ToString("MM-MMMM", CultureInfo.InvariantCulture));
                dict.Add("Day", addDateTime.Value.ToString("dd"));
                dict.Add("Event date", addDateTime.Value.Date.ToString("d", CultureInfo.InvariantCulture));
                dict.Add("Event time", addDateTime.Value.ToString("g", CultureInfo.InvariantCulture));

                if (addDateTime.Value.Hour != 0 || addDateTime.Value.Minute != 0 || addDateTime.Value.Second != 0 || addDateTime.Value.Millisecond != 0)
                    dict.Add("Hour", addDateTime.Value.ToString("hh"));
            }

            properties?.GetTelemetryProperties(logType, string.Empty, dict);

            return dict
                .Where(t => !string.IsNullOrEmpty(t.Value))
                .ToDictionary(
                t =>
                {
                    var val = t.Key.Trim();
                    return string.IsNullOrEmpty(val) ? val : $"{Char.ToUpper(val[0])}{val.Substring(1).ToLower()}";
                },
                t => t.Value.Trim()
                );
        }

        public static SeverityLevel[] LogLevelToSeverityLevel { get; private set; }

        #endregion

        #region LogMetric

        /// <summary>
        /// If addDateTime is sppecified Year, Month, Day properties are added. If time portion is not 00:00:00.000 then also Hour is added.
        /// </summary>
        public void LogMetric(TelemetryMetric metric, double value, ITelemetryPropertyProvider properties, DateTime? addDateTime)
        {
            LogMetrics(new[] { metric }, value, properties, addDateTime);
        }

        /// <summary>
        /// If addDateTime is sppecified Year, Month, Day properties are added. If time portion is not 00:00:00.000 then also Hour is added.
        /// </summary>
        public void LogMetrics(TelemetryMetric[] metrics, double value, ITelemetryPropertyProvider properties, DateTime? addDateTime)
        {
            if (AppConfig.Logging.LogMetrics)
                LogMetrics(metrics, value, GetProperties(LogType.Metrics, properties, addDateTime, null));
        }

        /// <summary>
        /// If addDateTime is sppecified Year, Month, Day properties are added. If time portion is not 00:00:00.000 then also Hour is added.
        /// </summary>
        public void LogMetrics(TelemetryMetric[] metrics, double value, IDictionary<string, string> properties)
        {
            if (AppConfig.Logging.LogMetrics)
            {
                foreach (var metric in metrics) {
                    var mt = new MetricTelemetry(metric.Title(), value);

                    foreach (var entry in properties)
                        mt.Properties.Add(entry);

                    mt.Sequence = metric.Sequence();

                    Client.TrackMetric(mt);
                }
#if DEBUG
                Client.Flush();
#endif
            }
        }

        #endregion

        #region LogEvent

        /// <summary>
        /// If addDateTime is sppecified Year, Month, Day properties are added. If time portion is not 00:00:00.000 then also Hour is added.
        /// </summary>
        public void LogEvent(TelemetryEvent eventName, ITelemetryPropertyProvider properties, DateTime? addDateTime)
        {
            if (AppConfig.Logging.LogEvents)
                LogEvent(eventName, GetProperties(LogType.Event, properties, addDateTime, null)); // don't duplicate EventName property
        }

        /// <summary>
        /// If addDateTime is sppecified Year, Month, Day properties are added. If time portion is not 00:00:00.000 then also Hour is added.
        /// </summary>
        private void LogEvent(TelemetryEvent eventName, IDictionary<string, string> properties)
        {
            if (AppConfig.Logging.LogEvents)
            {
                var et = new EventTelemetry(eventName.Title());

                foreach (var entry in properties)
                    et.Properties.Add(entry.Key, entry.Value);

                et.Sequence = eventName.Sequence();

                Client.TrackEvent(et);
#if DEBUG
                Client.Flush();
#endif
            }
        }

        #endregion

        #region LogEventWithMetrics

        /// <summary>
        /// If addDateTime is sppecified Year, Month, Day properties are added. If time portion is not 00:00:00.000 then also Hour is added.
        /// </summary>
        public void LogEventWithMetrics(TelemetryEvent eventName, TelemetryMetric[] metrics, double value, ITelemetryPropertyProvider properties, DateTime? addDateTime)
        {
            LogEvent(eventName, GetProperties(LogType.Event, properties, addDateTime, null)); // don't duplicate EventName property
            LogMetrics(metrics, value, GetProperties(LogType.Metrics, properties, addDateTime, eventName));
        }

        #endregion

        #region LogTrace

        /// <summary>
        /// If addDateTime is sppecified Year, Month, Day properties are added. If time portion is not 00:00:00.000 then also Hour is added.
        /// </summary>
        public void LogTrace(string message, LogLevel logLevel, ITelemetryPropertyProvider properties, DateTime? addDateTime)
        {
            if (logLevel != LogLevel.None && AppConfig.Logging.LogTrace)
            {
                Client.TrackTrace(message, LogLevelToSeverityLevel[(int)logLevel], GetProperties(LogType.Trace, properties, addDateTime, null));
#if DEBUG
                Client.Flush();
#endif
            }
        }

        #endregion

        #region LogError

        /// <summary>
        /// Call it manually, if Exception is swallowed
        /// </summary>
        public override void LogError(object state, LogLevel level, Exception ex)
        {
            if (level != LogLevel.None)
                base.LogError(state, level, ex);
#if DEBUG
            Client.Flush();
#endif
        }

        #endregion       
    }
}