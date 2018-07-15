using Toptal.BikeRentals.Service.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Helpers;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.BusinessLogic.Bikes;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.Security.Principals;
using System.Linq;
using Toptal.BikeRentals.Service.Models.Bikes;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Service.Api.Bikes
{
    public sealed class BikeModelService : ServiceBase
    {
        #region Services

        private BikeModelManager BikeModelManager;

        #endregion

        public BikeModelService(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            ITelemetryLogger logger,
            ITransactionManager transactionManager,
            BikeModelManager bikeModelManager
            )
            : base(callContext, authProvider, appConfig, logger, transactionManager)
        {
            this.BikeModelManager = bikeModelManager;
        }

        #region Get (collection)

        /// <summary>
        /// Get entity collection
        /// </summary>
        public BikeModelListData Get()
        {
            using (var scope = Scope("Get"))
            {
                // authorize
                AuthProvider.Authorize(Permission.Bike_ViewAll);

                // process
                var result = BikeModelManager.GetList().ToArray();
                Helper.ValidateResult(result);

                return scope.Complete(
                    () => new BikeModelListData() { List = result },
                    t => $"BikeModel list loaded {t.List.Length} items."
                    );
            }
        }

        #endregion
   }
}