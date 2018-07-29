using Toptal.BikeRentals.Service.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Helpers;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Security.Principals;
using System.Linq;
using Toptal.BikeRentals.Service.Models.Shared;
using Toptal.BikeRentals.BusinessLogic.Users;
using Toptal.BikeRentals.Security.Managers;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Service.Api.Shared
{
    public sealed class AutoCompleteService : ServiceBase
    {
        #region Services

        private BusinessLogic.Users.UserManager UserManager;

        #endregion

        public AutoCompleteService(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            ITelemetryLogger logger,
            ITransactionManager transactionManager,
            BusinessLogic.Users.UserManager userManager
            )
            : base(callContext, authProvider, appConfig, logger, transactionManager)
        {
            this.UserManager = userManager;
        }

        #region Get (collection)

        /// <summary>
        /// Get entity collection
        /// freeTextSearch - looks for in any text field
        /// </summary>
        public AutoCompleteListData GetList(AutoCompleteType type, string filter)
        {
            using (var scope = Scope("Get"))
            {
                switch (type)
                {
                    case AutoCompleteType.User:
                        {
                            // authorize
                            AuthProvider.Authorize(Permission.AutoComplete_GetUsers);

                            // process
                            var maxRows = AppConfig.WebApplication.AutoCompleteMaxRows;
                            var list = UserManager.GetList(null, filter, maxRows + 1).ToArray();
                            Helper.ValidateResult(list);

                            return scope.Complete(
                                () => new AutoCompleteListData()
                                {
                                    List = list.Take(maxRows).Select(t => new AutoCompleteItem(t.UserId, t.FullName)).OrderBy(t => t.Value).ToArray(),
                                    TooMuchData = list.Count() > maxRows
                                },
                                t => $"AutoComplete User list loaded {t.List.Length} items."
                                );
                        }

                    default:
                        return scope.Complete(
                            () => new AutoCompleteListData() { List = new AutoCompleteItem[] { } },
                            t => $"Invalid AutoComplete type, returning empty list: {type}."
                            );
                }
            }
        }

        #endregion 
    }
}