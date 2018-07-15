using Microsoft.Extensions.Logging;
using System;


namespace Toptal.BikeRentals.Logging.MicrosoftExtensions
{
    /// <summary>
    /// Using Application Insights with ILoggerFactory
    /// https://stackoverflow.com/questions/45022693/using-application-insights-with-iloggerfactory?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    /// 
    /// See AzureHelper.Telemetry.TelemetryClient for final implementation
    /// </summary>
    public class Logger : ILogger
    {
        public Logger(ILogger<object> logger)
        {
            this.LoggerService = logger;
        }

        #region Services

        private ILogger<object> LoggerService;

        #endregion

        //public void LogTrace(object state, LogLevel level, string message)
        //{
        //    if (LoggingConfiguration.LogTrace)
        //    {
        //        LoggerService.Log(
        //            level,
        //            new Microsoft.Extensions.Logging.EventId(), // not used
        //            state,
        //            null,
        //            (tstate, texception) => message
        //            );
        //    }
        //}

        /// <summary>
        /// Generic logger
        /// Call it manually, if Exception is swallowed
        /// </summary>
        public virtual void LogError(object state, LogLevel level, Exception ex)
        {
            if (level != LogLevel.None) // do not log validation exceptions
            {
                LoggerService.Log(
                    level,
                    new Microsoft.Extensions.Logging.EventId(), // not used
                    state,
                    ex,
                    (tstate, texception) => ex.Message // no need for texception.ToString(), CallStack will be logged automatically
                    );
            }
        }
    }
}
