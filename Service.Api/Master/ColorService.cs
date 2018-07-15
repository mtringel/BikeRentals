using Toptal.BikeRentals.Service.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Helpers;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Security.Principals;
using System.Linq;
using Toptal.BikeRentals.BusinessLogic.Master;
using Toptal.BikeRentals.Service.Models.Master;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Service.Api.Master
{
    public sealed class ColorService : ServiceBase
    {
        #region Services

        private ColorManager ColorManager;

        #endregion

        public ColorService(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            ITelemetryLogger logger,
            ITransactionManager transactionManager,
            ColorManager colorManager
            )
            : base(callContext, authProvider, appConfig, logger, transactionManager)
        {
            this.ColorManager = colorManager;
        }

        #region Get (collection)

        /// <summary>
        /// Get entity collection
        /// </summary>
        public ColorListData Get()
        {
            using (var scope = Scope("Get"))
            {
                // authorize
                AuthProvider.Authorize(Permission.Bike_ViewAll);

                // process
                var result = ColorManager.GetList().ToArray();
                Helper.ValidateResult(result);

                return scope.Complete(
                    () => new ColorListData() { List = result }, 
                    t => $"Color list loaded {t.List.Length} items."
                    );
            }
        }

        #endregion
   }
}