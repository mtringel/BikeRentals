using Microsoft.AspNetCore.Mvc;
using System;
using Toptal.BikeRentals.Web.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Service.Api.Bikes;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Newtonsoft.Json;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.Service.Models.Bikes;
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

        #region Get (collection)

        [HttpGet]
        public WebApiResult GetList([FromQuery]string filter, [FromQuery]string paging, [FromQuery]string currentLocation)
        {
            try
            {
                return Helper.OK(Helper.AddAntiforgeryToken(() => BikeService.GetList(
                    JsonConvert.DeserializeObject<BusinessEntities.Bikes.BikeListFilter>(filter),
                    JsonConvert.DeserializeObject<PagingInfo>(paging),
                    string.IsNullOrEmpty(currentLocation) ? null : JsonConvert.DeserializeObject<Location?>(currentLocation)
                    )));
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }

        #endregion

        #region Get (single entity)

        /// <summary>
        /// Get single entity
        /// /bikeId or 0 (new)
        /// </summary>
        [HttpGet("{id}")]
        public WebApiResult GetById([FromRoute]int id, [FromQuery]string currentLocation)
        {
            try
            {
                return Helper.OK(Helper.AddAntiforgeryToken(() => BikeService.GetById(
                    id,
                    string.IsNullOrEmpty(currentLocation) ? null : JsonConvert.DeserializeObject<Location?>(currentLocation)
                    )));
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }

        #endregion

        #region Post (create single)

        /// <summary>
        /// Create new entity
        /// </summary>
        [HttpPost]
        public WebApiResult Post([FromBody]Bike bike, [FromQuery]string currentLocation)
        {
            try
            {
                CallContext.AntiforgeryTokenValidate(true);
                return Helper.OK(() => BikeService.Post(bike, string.IsNullOrEmpty(currentLocation) ? null : JsonConvert.DeserializeObject<Location?>(currentLocation)));
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }

        #endregion

        #region Put (update single entity)

        /// <summary>
        /// Update single entity
        /// </summary>
        [HttpPut("{id}")]
        public WebApiResult Put([FromRoute]int? id, [FromBody]Bike bike)
        {
            try
            {
                Helper.Expect(bike, t => t.BikeId, id);
                CallContext.AntiforgeryTokenValidate(true);
                return Helper.OK(() => BikeService.Put(bike));
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }

        #endregion

        #region Delete (single entity)

        /// <summary>
        /// Delete single entity
        /// </summary>
        [HttpDelete("{id}")]
        public WebApiResult Delete([FromRoute]int id)
        {
            try
            {
                CallContext.AntiforgeryTokenValidate(true);
                return Helper.OK(() => BikeService.Delete(id));
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }

        #endregion
    }
}