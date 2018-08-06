using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Exceptions;
using Toptal.BikeRentals.Exceptions.Validation;
using Toptal.BikeRentals.Logging.Telemetry;

namespace Toptal.BikeRentals.Web.Api.Helpers
{
    public sealed class WebApiHelper
    {
        internal WebApiHelper(
            ICallContext callContext,
            AppConfig appConfig,
            ITelemetryLogger logger
            )
        {
            this.AppConfig = appConfig;
            this.Logger = logger;
            this.CallContext = callContext;
        }

        #region Services

        private AppConfig AppConfig;

        private ICallContext CallContext;

        private ITelemetryLogger Logger;

        #endregion

        #region Exception Handling

        /// <summary>
        /// Logs error, if necessary.
        /// Does not throw exception. Throw manually, if needed.
        /// </summary>
        public WebApiResult HandleException(Exception ex)
        {
            // order is important
            CallContext.LastError = ex;

            // validation exceptions for example are not logged
            // call it manually, if Exception is swallowed
            if (ex is Exceptions.Validation.ValidationException exVal)
            {
                return this.ValidationError(exVal);
            }
            else if (ex is AppException exApp)
            {
                if (exApp.LogLevel != Microsoft.Extensions.Logging.LogLevel.None) // do not log validation exceptions
                    Logger.LogError(this, exApp.LogLevel, ex);

                return this.Error(exApp.Message, AppConfig.WebApplication.ShowDetailedError ? exApp.DetailedErrorMessage : null);
            }
            else
            {
                // non AppException is always Critical
                // call it manually, if Exception is swallowed
                Logger.LogError(this, Microsoft.Extensions.Logging.LogLevel.Critical, ex);

                return this.Error(ex.Message, AppConfig.WebApplication.ShowDetailedError ? ex.ToString() : null);
            }
        }

        #endregion

        #region Antiforgery Token

        internal Func<object> AddAntiforgeryToken(Func<object> func)
        {
            return () =>
            {
                var data = func();

                var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.SerializeObject(data));
                //var obj = JsonConvert.SerializeObject(dict, Formatting.Indented); -- no need

                dict.Add(AppConfig.ServiceApi.AntiforgeryTokenFieldName, CallContext.AntiforgeryTokenGenerate().RequestToken);
                return dict;
            };
        }

        internal Func<object> AddAntiforgeryToken(Action action)
        {
            return AddAntiforgeryToken(() => { action(); return null; });
        }

        #endregion

        #region OK

        internal WebApiResult OK(Func<object> func)
        {
            return new WebApiResult(HttpStatusCode.OK, func != null ? func() : null);
        }

        internal WebApiResult OK(Action action)
        {
            return OK(() => { action?.Invoke(); return null; });
        }

        internal WebApiResult OK()
        {
            return new WebApiResult(HttpStatusCode.OK, null);
        }

        #endregion

        #region ValidationError

        internal WebApiResult ValidationError(string statusText, bool addPleaseCorrectTheFollowingErrorsPrefix)
        {
            return new WebApiResult(
                HttpStatusCode.BadRequest,
                new ErrorDetails(ValidationException.FormatMessage(statusText, addPleaseCorrectTheFollowingErrorsPrefix))
                );
        }

        internal WebApiResult ValidationError(ValidationException ex)
        {
            return ValidationError(ex.Message, false); // already formatted
        }

        /// <summary>
        /// Used for validation errors
        /// </summary>
        internal WebApiResult ValidationError(Microsoft.AspNetCore.Mvc.ModelBinding.ModelStateDictionary model, bool addPleaseCorrectTheFollowingErrorsPrefix, bool basicHtmlFormatting)
        {
            return ValidationError(ValidationException.FormatMessage(model, addPleaseCorrectTheFollowingErrorsPrefix, basicHtmlFormatting), false);
        }

        /// <summary>
        /// Used for validation errors
        /// </summary>
        internal WebApiResult ValidationError(IEnumerable<string> errors, bool addPleaseCorrectTheFollowingErrorsPrefix)
        {
            return ValidationError(ValidationException.FormatMessage(errors, addPleaseCorrectTheFollowingErrorsPrefix), false);
        }

        #endregion

        #region ServerError

        internal WebApiResult Error(string statusText, string detailedErrorMessage)
        {
            return new WebApiResult(HttpStatusCode.InternalServerError, new ErrorDetails(statusText, detailedErrorMessage));
        }

        #endregion

        #region Input Validation

        public void Expect<T>(T entity, Func<T, object> getKey, object id) where T : BusinessEntities.Helpers.IDataObject
        {
            if (entity == null)
                throw new Exceptions.Validation.InputDataMissingException(CallContext.ResourceUri, typeof(T));

            if (id == null || (id is string && string.IsNullOrEmpty((string)id)))
                throw new Exceptions.Entities.InvalidEntityKeyException(CallContext.ResourceUri, typeof(T), new[] { id }, Microsoft.Extensions.Logging.LogLevel.Warning);

            var key = getKey(entity);

            if (key == null || (key is string && string.IsNullOrEmpty((string)key)) ||
                (id is string && String.Compare((string)id, key.ToString(), true) != 0) ||
                (!(id is string) && !Object.Equals(id, key))
                )
                throw new Exceptions.Entities.InvalidEntityKeyException(CallContext.ResourceUri, typeof(T), new[] { key }, Microsoft.Extensions.Logging.LogLevel.Warning);
        }

        #endregion
    }
}