using Microsoft.AspNetCore.Mvc;
using System;
using Toptal.BikeRentals.Web.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Service.Api.Bikes;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Web.Api.Bikes
{
    [RequireHttps]
    [ResponseCache(NoStore = true, Duration = 0)]
    [Route("Api/[controller]")]
    public sealed class BikeModelsController : ApiControllerBase
    {
        private BikeModelService BikeModelService;

        public BikeModelsController(
            ICallContext callContext,
            AppConfig appConfig,
            ITelemetryLogger logger,
            BikeModelService bikeModelService
            )
            : base(callContext, appConfig, logger)
        {
            this.BikeModelService = bikeModelService;
        }

        [HttpGet]
        public WebApiResult Get()
        {
            try
            {
                return Helper.OK(BikeModelService.GetList);
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }
    }
}