using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Toptal.BikeRentals.BusinessEntities.Contents;
using Toptal.BikeRentals.BusinessLogic.Bikes;
using Toptal.BikeRentals.BusinessLogic.Contents;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Helpers;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Security.Principals;
using Toptal.BikeRentals.Service.Api.Helpers;

namespace Toptal.BikeRentals.Service.Api.Contents
{
    public sealed class ContentService : ServiceBase
    {
        private ContentManager ContentManager;

        private BikeManager BikeManager;

        public ContentService(
            ICallContext callContext, 
            IAuthProvider authProvider, 
            AppConfig appConfig, 
            ITelemetryLogger logger, 
            ITransactionManager transactionManager,
            ContentManager contentManager,
            BikeManager bikeManager
            ) 
            : base(callContext, authProvider, appConfig, logger, transactionManager)
        {
            this.ContentManager = contentManager;
            this.BikeManager = bikeManager;
        }

        public async Task<Content> Get(ContentType contentType, string key)
        {
            using (var scope = Scope("Get"))
            {
                switch (contentType)
                {
                    case ContentType.BikeImage:
                    case ContentType.BikeImageThumb:
                        {
                            AuthProvider.Authorize(Permission.Bike_ViewAll, Permission.Bike_Management);

                            // TODO put down images using BikeId, so the Bike entity won't be needed here (hack: we use model name for the moment)
                            var bike = BikeManager.Get(int.Parse(key));
                            var uri = $"{bike.BikeModel.BikeModelName}.jpg";

                            return await scope.Complete(
                                () => ContentManager.GetContent(new ContentRef(contentType, uri)),
                                t => $"Bike image loaded successfully (type: {contentType}, uri: {uri})."
                                );
                        }

                    default:
                        throw new NotSupportedException($"Content type is not supported: {contentType}.");
                }
            }
        }
    }
}
