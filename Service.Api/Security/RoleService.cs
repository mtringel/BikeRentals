using Toptal.BikeRentals.Service.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Helpers;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Security.Principals;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Toptal.BikeRentals.Service.Models.Security;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Service.Api.Security
{
    public sealed class RoleService : ServiceBase
    {
        public RoleService(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            ITelemetryLogger logger,
            ITransactionManager transactionManager
            )
            : base(callContext, authProvider, appConfig, logger, transactionManager)
        {
        }

        #region Get (collection)

        /// <summary>
        /// Get entity collection
        /// </summary>
        public RoleListData Get()
        {
            using (var scope = Scope("Get"))
            {
                // authorize
                //AuthProvider.Authorize(Permission.Bike_ViewAll);

                // process
                var result = RoleTypeHelper.AllRoles.Select(t => new KeyValuePair<RoleType, string>(t, t.Title())).ToArray();
                Helper.ValidateResult(result);

                return scope.Complete(
                    () => new RoleListData() { List = result }, 
                    t => $"Role list loaded {t.List.Length} items."
                    );
            }
        }

        #endregion
   }
}