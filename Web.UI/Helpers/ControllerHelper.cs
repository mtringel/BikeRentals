using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Exceptions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Toptal.BikeRentals.Logging.Telemetry;

namespace Toptal.BikeRentals.Web.UI.Helpers
{
    /// <summary>
    /// This is for MVC, not for Web API.
    /// </summary>
    public sealed class ControllerHelper
    {
        internal ControllerHelper(
            ICallContext callContext,
            AppConfig appConfig,
            ITelemetryLogger logger
            )
        {
            this.CallContext = callContext;
            this.AppConfig = appConfig;
            this.Logger = logger;
        }

        #region Services

        private ICallContext CallContext;

        private AppConfig AppConfig;

        private ITelemetryLogger Logger;

        #endregion

        #region Parsing / Formatting

        public static T TryParseEnum<T>(string value, T? defaultValue) where T : struct
        {
            if (!string.IsNullOrEmpty(value) && System.Enum.TryParse<T>(value, out T result))
                return result;
            else if (defaultValue.HasValue)
                return defaultValue.Value;
            else
                throw new ArgumentException($"Invalid {typeof(T).Name} value: {value}.");
        }

        public string FormatShortDate(DateTime? dateTime)
        {
            return dateTime.HasValue ? dateTime.Value.ToString("d", CallContext.UICulture) : string.Empty;
        }

        public string FormatShortDateTime(DateTime? dateTime)
        {
            return dateTime.HasValue ? dateTime.Value.ToString("g", CallContext.UICulture) : string.Empty;
        }

        #endregion

        #region Globals

        /// <summary>
        /// Does not end with '/'
        /// </summary>
        public string ApplicationPath { get { return AppConfig.WebApplication.BasePath; } }

        /// <summary>
        /// Does not end with '/'
        /// </summary>
        public string RootPath { get { return AppConfig.WebApplication.BaseUrl; } }

#if DEBUG
        public readonly bool IsDebugging = true;
#else
        public readonly bool IsDebugging = false;
#endif

        #endregion

        #region Exception Handling

        /// <summary>
        /// This is for MVC, not for Web API.
        /// Logs error, if necessary.
        /// Does not throw exception. Throw manually, if needed.
        /// </summary>
        public void HandleException(Exception ex, ModelStateDictionary modelState)
        {
            // order is important
            CallContext.LastError = ex;

            // validation exceptions for example are not logged
            // call it manually, if Exception is swallowed
            if (ex is Exceptions.Validation.ValidationException exVal)
            {
                modelState.AddModelError(string.Empty, exVal.Message);
            }
            else if (ex is AppException exApp)
            {
                if (exApp.LogLevel != Microsoft.Extensions.Logging.LogLevel.None) // do not log validation exceptions
                    Logger.LogError(this, exApp.LogLevel, ex);

                modelState.AddModelError(string.Empty, AppConfig.WebApplication.ShowDetailedError ? ex.ToString() : exApp.Message);
            }
            else
            {
                // non AppException is always Critical
                // call it manually, if Exception is swallowed
                Logger.LogError(this, Microsoft.Extensions.Logging.LogLevel.Critical, ex);

                modelState.AddModelError(string.Empty, AppConfig.WebApplication.ShowDetailedError ?
                    ex.ToString() : // give all details
                    string.Format(Resources.Resources.Error_GenericServerError, ex.GetType().Name) // don't give details to users
                    );
            }
        }

        #endregion

        #region Validation 

        /// <summary>
        /// This is for MVC, not for Web API.
        /// Returns true, if there are no errors.
        /// Controller.TryValidateModel does not work in Unit tests
        /// https://github.com/aspnet/Mvc/issues/3586
        /// </summary>
        public bool ValidateModel(object model, ModelStateDictionary modelState)
        {
            var validationContext = new ValidationContext(model, null, null);
            var validationResults = new List<ValidationResult>();

            Validator.TryValidateObject(model, validationContext, validationResults, true);

            foreach (var validationResult in validationResults)
                modelState.AddModelError(validationResult.MemberNames.FirstOrDefault() ?? string.Empty, validationResult.ErrorMessage);

            return modelState.ErrorCount == 0;
        }

        #endregion
    }
}
