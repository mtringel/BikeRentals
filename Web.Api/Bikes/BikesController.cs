using Microsoft.AspNetCore.Mvc;
using System;
using Toptal.BikeRentals.Web.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Service.Api.Bikes;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Newtonsoft.Json;
using Toptal.BikeRentals.BusinessEntities.Master;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Web.Api.Bikes
{
    [RequireHttps]
    [ResponseCache(NoStore = true, Duration = 0)]
    [Route("Api/[controller]")]
    public sealed class BikesController : ApiControllerBase
    {
        private BikeService BikeService;

        public BikesController(
            ICallContext callContext,
            AppConfig appConfig,
            ITelemetryLogger logger,
            BikeService bikeService
            )
            : base(callContext, appConfig, logger)
        {
            this.BikeService = bikeService;
        }

        [HttpGet]
        public WebApiResult GetList([FromQuery]string filter, [FromQuery]string paging, [FromQuery]string currentLocation)
        {
            try
            {
                return Helper.OK(Helper.AddAntiforgeryToken(() => BikeService.GetList(
                    JsonConvert.DeserializeObject<BikeListFilter>(filter),
                    JsonConvert.DeserializeObject<PagingInfo>(paging),
                    string.IsNullOrEmpty(currentLocation) ? null : JsonConvert.DeserializeObject<Location?>(currentLocation)
                    )));
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }
    }
}