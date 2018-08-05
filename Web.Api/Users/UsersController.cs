using Microsoft.AspNetCore.Mvc;
using System;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Service.Api.Users;
using Toptal.BikeRentals.Service.Models.Users;
using Toptal.BikeRentals.Web.Api.Helpers;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Web.Api.Users
{
    /// <summary>
    /// TODO: Add Antiforgery
    /// var tokens = this.CallContext.AntiforgeryTokenGenerate();
    /// result.RequestToken = tokens.RequestToken;
    /// </summary>
    [RequireHttps]
    [ResponseCache(NoStore = true, Duration = 0)]
    [Route("Api/[controller]")]
    public sealed class UsersController : ApiControllerBase
    {
        private UserService UserService;

        public UsersController(
            ICallContext callContext,
            AppConfig appConfig,
            ITelemetryLogger logger,
            UserService userService
            )
            : base(callContext, appConfig, logger)
        {
            UserService = userService;
        }

        #region Get (collection)

        /// <summary>
        /// Get entity collection
        /// freeTextSearch - looks for in any text field
        /// ?filter=true&freeTextSearch=...
        /// </summary>
        [HttpGet]
        public WebApiResult GetList([FromQuery]string filter)
        {
            try
            {
                return Helper.OK(Helper.AddAntiforgeryToken(() => UserService.GetList(filter)));
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
        /// /userId or /new or /profile (own)
        /// </summary>
        [HttpGet("{id}")]
        public WebApiResult GetById([FromRoute]string id)
        {
            try
            {
                return Helper.OK(Helper.AddAntiforgeryToken(() => UserService.GetById(id)));
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
        public WebApiResult Post([FromBody]User user)
        {
            try
            {
                CallContext.AntiforgeryTokenValidate(true);
                return Helper.OK(() => UserService.Post(user));
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
        public WebApiResult Put([FromRoute]string id, [FromBody]User user)
        {
            try
            {
                Helper.Expect(user, id, t => t.UserId);
                CallContext.AntiforgeryTokenValidate(true);
                return Helper.OK(() => UserService.Put(user));
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
        public WebApiResult Delete([FromRoute]string id)
        {
            try
            {
                CallContext.AntiforgeryTokenValidate(true);
                return Helper.OK(() => UserService.Delete(id));
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }

        #endregion
    }
}