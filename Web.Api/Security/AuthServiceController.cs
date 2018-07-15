using Toptal.BikeRentals.Service.Models.Account;
using Toptal.BikeRentals.Service.Api.Security;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using Toptal.BikeRentals.Web.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Logging.Telemetry;
using Microsoft.AspNetCore.Authorization;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Web.Api.Security
{
    [RequireHttps]
    [ResponseCache(NoStore = true, Duration = 0)]
    [Route("Api/AuthService")]
    public sealed class AuthServiceController : ApiControllerBase
    {
        private AuthService AuthService;

        public AuthServiceController(
           ICallContext callContext,
           AppConfig appConfig,
           ITelemetryLogger logger,
           AuthService authService
           )
           : base(callContext, appConfig, logger)
        {
            this.AuthService = authService;
        }

        /// <summary>
        /// Returns current user, if logged in.
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public WebApiResult Get()
        {
            try
            {
                return Helper.OK(AuthService.Get);
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }


        /// <summary>
        /// Since our Login page is an Angular template we are in an AJAX/REST call
        /// Instead of ActionResult (Redirect/View) we will return WebApiSimpleResult and process on client side
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public WebApiResult Post([FromBody]LoginData model)
        {
            try
            {
                return Helper.OK(() => AuthService.Post(model));
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }


        /// <summary>
        /// Log off
        /// </summary>
        [HttpDelete]
        public WebApiResult Delete()
        {
            try
            {
                return Helper.OK(() => AuthService.Delete());
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }


    }
}