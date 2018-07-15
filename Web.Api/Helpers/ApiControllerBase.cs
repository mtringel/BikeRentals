using Microsoft.AspNetCore.Mvc;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Service.Api.Helpers;
using Toptal.BikeRentals.Service.Models.Helpers;

namespace Toptal.BikeRentals.Web.Api.Helpers
{
    /// <summary>
    /// Do not add public instance methods here.
    /// </summary>
    public abstract class ApiControllerBase : ControllerBase
    {
        public ApiControllerBase(
            ICallContext callContext,
            AppConfig appConfig,
            ITelemetryLogger logger
            )
        {
            this.CallContext = callContext;
            this.AppConfig = appConfig;
            this.Helper = new WebApiHelper(callContext, appConfig, logger);
        }

        #region Services

        protected WebApiHelper Helper { get; private set; }

        protected AppConfig AppConfig { get; private set; }

        protected ICallContext CallContext { get; private set; }

        protected ITelemetryLogger Logger { get; private set; }

        #endregion
    }
}