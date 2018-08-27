using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Bikes;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.BusinessLogic.Helpers;
using System.Collections.Generic;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessEntities.Master;
using System.IO;
using Toptal.BikeRentals.BusinessLogic.Contents;
using Toptal.BikeRentals.BusinessEntities.Contents;
using Toptal.BikeRentals.Exceptions.Validation;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace Toptal.BikeRentals.BusinessLogic.Bikes
{
    /// <summary>
    /// Lifetime: n/a (transient or current request, undetermined, don't rely on internal state)
    /// </summary>
    public sealed class BikeManager : BusinessLogicManagerBase
    {
        #region Services

        private BikeDataProvider BikeDataProvider;

        private ContentManager ContentManager;

        #endregion

        public BikeManager(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            BikeDataProvider bikeDataProvider,
            ContentManager contentManager
            )
            : base(callContext, appConfig)
        {
            this.BikeDataProvider = bikeDataProvider;
            this.ContentManager = contentManager;
        }

        public IEnumerable<Bike> GetList(BikeListFilter filter, PagingInfo paging, Location? currentLocation, out int totalRowCount)
        {
            return this.BikeDataProvider.GetList(filter, paging, currentLocation, out totalRowCount);
        }

        public Bike GetById(int bikeId)
        {
            return this.BikeDataProvider.GetById(bikeId, true);
        }

        public void Add(Bike bike)
        {
            this.BikeDataProvider.Add(bike);
        }

        public void Delete(int bikeId)
        {
            this.BikeDataProvider.Delete(bikeId);
        }

        public void Update(Bike bike)
        {
            this.BikeDataProvider.Update(bike);
        }

        public ContentRef GetImageContentRef(Bike bike, bool thumbnail)
        {
            return new ContentRef(
                thumbnail ? ContentType.BikeImageThumb : ContentType.BikeImage,
                string.Format("BikeImage_{0}_{1}{2}.{3}",
                    bike.BikeId,
                    bike.ImageSeq,
                    thumbnail ? "_thumb" : string.Empty,
                    bike.ImageFormat
                ));
        }

        public void SaveImage(Bike bike, Image<Rgba32> image)
        {
            var cref = GetImageContentRef(bike, false);

            ContentManager.SaveContent(
                new Content<Image<Rgba32>>(cref, ContentManager.GetHtmlContentType(cref), image),
                true);
        }

        public void DeleteImage(Bike bike)
        {
            ContentManager.DeleteContent(GetImageContentRef(bike, false), true);
        }
    }
}