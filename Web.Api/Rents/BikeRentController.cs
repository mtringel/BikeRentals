using Microsoft.AspNetCore.Mvc;
using System;
using Toptal.BikeRentals.Web.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Newtonsoft.Json;
using Toptal.BikeRentals.Service.Api.Rents;
using Toptal.BikeRentals.BusinessEntities.Rents;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Web.Api.Rents
{
    [RequireHttps]
    [ResponseCache(NoStore = true, Duration = 0)]
    [Route("Api/[controller]")]
    public sealed class BikesRentController : ApiControllerBase
    {
        private BikeRentService BikeRentService;

        public BikesRentController(
            ICallContext callContext,
            AppConfig appConfig,
            ITelemetryLogger logger,
            BikeRentService bikeRentService
            )
            : base(callContext, appConfig, logger)
        {
            this.BikeRentService = bikeRentService;
        }

        [HttpGet]
        public WebApiResult GetList([FromQuery]string filter, [FromQuery]string paging)
        {
            try
            {
                return Helper.OK(Helper.AddAntiforgeryToken(() => BikeRentService.GetList(
                    JsonConvert.DeserializeObject<BikeRentListFilter>(filter),
                    JsonConvert.DeserializeObject<PagingInfo>(paging)
                    )));
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }
    }
}