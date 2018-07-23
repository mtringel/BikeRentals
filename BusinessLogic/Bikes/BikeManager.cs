using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Bikes;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.BusinessLogic.Helpers;
using System.Collections.Generic;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessEntities.Master;

namespace Toptal.BikeRentals.BusinessLogic.Bikes
{
    /// <summary>
    /// Lifetime: n/a (transient or current request, undetermined, don't rely on internal state)
    /// </summary>
    public sealed class BikeManager : BusinessLogicManagerBase
    {
        #region Services

        private BikeDataProvider BikeDataProvider;

        #endregion

        public BikeManager(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            BikeDataProvider bikeDataProvider
            )
            : base(callContext, appConfig)
        {
            this.BikeDataProvider = bikeDataProvider;
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
    }
}