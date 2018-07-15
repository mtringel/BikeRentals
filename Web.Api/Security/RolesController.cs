using Microsoft.AspNetCore.Mvc;
using System;
using Toptal.BikeRentals.Web.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Service.Api.Master;
using Toptal.BikeRentals.Service.Api.Security;
using Microsoft.AspNetCore.Authorization;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Web.Api.Security
{
    [RequireHttps]
    [ResponseCache(NoStore = true, Duration = 0)]
    [Route("Api/[controller]")]
    [AllowAnonymous] // we do the authorization
    public sealed class RolesController : ApiControllerBase
    {
        private RoleService RoleService;

        public RolesController(
            ICallContext callContext,
            AppConfig appConfig,
            ITelemetryLogger logger,
            RoleService roleService
            )
            : base(callContext, appConfig, logger)
        {
            this.RoleService = roleService;
        }

        [HttpGet]
        public WebApiResult Get()
        {
            try
            {
                return Helper.OK(RoleService.Get);
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }
    }
}