using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.BusinessLogic.Helpers;
using System.Collections.Generic;
using Toptal.BikeRentals.DataAccess.Bikes;
using Toptal.BikeRentals.BusinessEntities.Bikes;

namespace Toptal.BikeRentals.BusinessLogic.Bikes
{
    /// <summary>
    /// Lifetime: n/a (transient or current request, undetermined, don't rely on internal state)
    /// </summary>
    public sealed class BikeModelManager : BusinessLogicManagerBase
    {
        #region Services

        private BikeModelDataProvider BikeModelDataProvider;

        #endregion

        public BikeModelManager(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            BikeModelDataProvider bikeModelDataProvider
            )
            : base(callContext, appConfig)
        {
            this.BikeModelDataProvider = bikeModelDataProvider;
        }

        public IEnumerable<BikeModel> GetList()
        {
            return this.BikeModelDataProvider.GetList();
        }    
    }
}