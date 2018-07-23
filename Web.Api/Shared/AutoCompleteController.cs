using Microsoft.AspNetCore.Mvc;
using System;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Service.Api.Shared;
using Toptal.BikeRentals.Service.Models.Shared;
using Toptal.BikeRentals.Web.Api.Helpers;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Web.Api.Shared
{
    /// <summary>
    /// TODO: Add Antiforgery
    /// var tokens = this.CallContext.AntiforgeryTokenGenerate();
    /// result.RequestToken = tokens.RequestToken;
    /// </summary>
    [RequireHttps]
    [ResponseCache(NoStore = true, Duration = 0)]
    [Route("Api/[controller]")]
    public sealed class AutoCompleteController : ApiControllerBase
    {
        private AutoCompleteService AutoCompleteService;

        public AutoCompleteController(
            ICallContext callContext,
            AppConfig appConfig,
            ITelemetryLogger logger,
            AutoCompleteService autoCompleteService
            )
            : base(callContext, appConfig, logger)
        {
            AutoCompleteService = autoCompleteService;
        }

        #region Get (collection)

        /// <summary>
        /// Get entity collection
        /// freeTextSearch - looks for in any text field
        /// ?filter=true&freeTextSearch=...
        /// </summary>
        [HttpGet]
        public WebApiResult GetList([FromQuery]AutoCompleteType type, [FromQuery]string filter)
        {
            try
            {
                return Helper.OK(() => AutoCompleteService.GetList(type, filter));
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }

        #endregion
    }
}