using Toptal.BikeRentals.Service.Models.Account;
using Microsoft.AspNetCore.Mvc;
using System;
using Toptal.BikeRentals.Service.Api.Account;
using Toptal.BikeRentals.Web.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Logging.Telemetry;
using Microsoft.AspNetCore.Authorization;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Web.Api.Account
{
    [RequireHttps]
    [ResponseCache(NoStore = true, Duration = 0)]
    [Route("Api/[controller]")]
    public sealed class RegistrationController : ApiControllerBase
    {
        private RegistrationService RegisterService;

        public RegistrationController(
            ICallContext callContext,
            AppConfig appConfig,
            ITelemetryLogger logger,
            RegistrationService registerService
            )
            : base(callContext, appConfig, logger)
        {
            this.RegisterService = registerService;
        }

        /// <summary>
        /// Since our Login page is an Angular template we are in an AJAX/REST call
        /// Instead of ActionResult (Redirect/View) we will return WebApiSimpleResult and process on client side
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public WebApiResult Post([FromBody]RegisterData model)
        {
            try
            {
                return Helper.OK(() => RegisterService.Post(model));
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }      
    }
}