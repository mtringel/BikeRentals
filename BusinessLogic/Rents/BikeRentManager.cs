using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Rents;
using Toptal.BikeRentals.BusinessEntities.Rents;
using Toptal.BikeRentals.BusinessLogic.Helpers;
using System.Collections.Generic;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessEntities.Master;

namespace Toptal.BikeRentals.BusinessLogic.Rents
{
    /// <summary>
    /// Lifetime: n/a (transient or current request, undetermined, don't rely on internal state)
    /// </summary>
    public sealed class BikeRentManager : BusinessLogicManagerBase
    {
        #region Services

        private BikeRentDataProvider BikeRentDataProvider;

        #endregion

        public BikeRentManager(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            BikeRentDataProvider bikeRentDataProvider
            )
            : base(callContext, appConfig)
        {
            this.BikeRentDataProvider = bikeRentDataProvider;
        }

        public IEnumerable<BikeRent> GetList(BikeRentListFilter filter, PagingInfo paging, out int totalRowCount)
        {
            return this.BikeRentDataProvider.GetList(filter, paging, out totalRowCount);
        }

        public BikeRent Get(string bikeRentId)
        {
            return this.BikeRentDataProvider.Get(bikeRentId);
        }

        public void Add(BikeRent bike)
        {
            this.BikeRentDataProvider.Add(bike);
        }

        public void Delete(string bikeRentId)
        {
            this.BikeRentDataProvider.Delete(bikeRentId);
        }

        public void Update(BikeRent bike)
        {
            this.BikeRentDataProvider.Update(bike);
        }
    }
}