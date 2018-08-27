using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Toptal.BikeRentals.BusinessEntities.Contents;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Service.Api.Contents;
using Toptal.BikeRentals.Web.Api.Helpers;

namespace Toptal.BikeRentals.Web.Api.Contents
{
    [RequireHttps]
    [ResponseCache(Duration = 60)]
    [Route("Api/[controller]")]
    public sealed class ContentController : ApiControllerBase
    {
        private ContentService ContentService;

        public ContentController(
            ICallContext callContext, 
            AppConfig appConfig, 
            ITelemetryLogger logger,
            ContentService contentService
            ) 
            : base(callContext, appConfig, logger)
        {
            this.ContentService = contentService;
        }

        [HttpGet]
        public async Task<ActionResult> Get(ContentType contentType, string key, int seq)
        {
            try
            {
                var content = await ContentService.Get(contentType, key, seq);
                return File(content.Data, content.HttpContentType);
            }
            catch (Exception ex)
            {
                return Helper.HandleException(ex);
            }
        }
    }
}
