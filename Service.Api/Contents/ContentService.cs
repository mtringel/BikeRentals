using System;
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

        public async Task<Content<byte[]>> Get(ContentType contentType, string key, int seq)
        {
            using (var scope = Scope("Get"))
            {
                IContent content = null;

                switch (contentType)
                {
                    case ContentType.BikeImage:
                    case ContentType.BikeImageThumb:
                        {
                            AuthProvider.Authorize(Permission.Bike_ViewAll, Permission.Bike_Management);

                            // TODO put down images using BikeId, so the Bike entity won't be needed here (hack: we use model name for the moment)
                            var bike = BikeManager.GetById(int.Parse(key));                            

                            // uploaded image to bike
                            if (bike.ImageFormat.HasValue && bike.ImageSeq.HasValue)
                                content = await ContentManager.GetContent(BikeManager.GetImageContentRef(bike, contentType == ContentType.BikeImageThumb), false);

                            if (content == null)
                                // fall back to model image
                                content = await ContentManager.GetContent(new ContentRef(contentType, $"{bike.BikeModel.BikeModelName}.jpg"), true);
                        }
                        break;

                    default:
                        throw new NotSupportedException($"Content type is not supported: {contentType}.");
                }

                return scope.Complete(
                    () => ContentManager.Serialize(content),
                    t => $"Bike image loaded successfully (type: {contentType}, uri: {t.ContentRef.Uri})."
                    );
            }
        }
    }
}
