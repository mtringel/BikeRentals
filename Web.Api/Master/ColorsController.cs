using Microsoft.AspNetCore.Mvc;
using System;
using Toptal.BikeRentals.Web.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Service.Api.Master;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Web.Api.Master
{
    [RequireHttps]
    [ResponseCache(NoStore = true, Duration = 0)]
    [Route("Api/[controller]")]
    public sealed class ColorsController : ApiControllerBase
    {
        private ColorService ColorService;

        public ColorsController(
            ICallContext callContext,
            AppConfig appConfig,
            ITelemetryLogger logger,
            ColorService colorService
            )
            : base(callContext, appConfig, logger)
        {
            this.ColorService = colorService;
        }

        [HttpGet]
        public WebApiResult Get()
        {
            try
            {
                return Helper.OK(ColorService.GetList);
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }
    }
}