using System;
using Toptal.BikeRentals.Service.Models.Account;
using Toptal.BikeRentals.Service.Models.Security;
using Toptal.BikeRentals.BusinessLogic.Master;
using Toptal.BikeRentals.Service.Api.Helpers;
using Toptal.BikeRentals.Service.Models.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Helpers;
using Toptal.BikeRentals.Logging.Telemetry;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Service.Api.Security
{
    public sealed class AuthService : ServiceBase
    {
        public AuthService(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            ITelemetryLogger logger,
            ITransactionManager transactionManager,
            BusinessLogic.Users.UserManager userManager
            )
            : base(callContext, authProvider, appConfig, logger, transactionManager)
        {
            UserManager = userManager;
        }

        #region Services

        private BusinessLogic.Users.UserManager UserManager;

        #endregion

        /// <summary>
        /// Returns current user, if logged in.
        /// Can be requested to log off the current user.
        /// Others initialization parameters can be returned by inheriting from AntiForgeryTokenResult.
        /// </summary>
        public AppUser Get()
        {
            using (var scope = Scope("Get"))
            {
                return scope.Complete(
                    () => AuthProvider.IsAuthenticated ? new AppUser(AuthProvider.CurrentUser) : null,
                    t => $"Authenticated user, if any: {(t == null ? "Not authenticated" : t.UserName)}."
                    );
            }
        }


        /// <summary>
        /// Login
        /// </summary>
        public AppUser Post(LoginData model)
        {
            // we don't need transaction scope here, since we have an atomic operation only (PasswordSignInAsync)
            using (var scope = Scope("Post"))
            {
                // prepare
                Helper.Expect(model);

                // validate
                Helper.ValidateModel(model, true);

                // process
                UserManager.Login(model.Email, model.Password, model.RememberMe);

                return scope.Complete(() => new AppUser(AuthProvider.CurrentUser), t => $"User logged in: {t.UserName}.");
            }
        }


        /// <summary>
        /// Log off
        /// </summary>
        public void Delete()
        {
            using (var scope = Scope("Delete"))
            {
                if (AuthProvider.IsAuthenticated)
                {
                    var identity = AuthProvider.IdentityName;
                    AuthProvider.LogOut();

                    scope.Complete(() => $"User logged out: {identity}.");
                }
                else
                    scope.Complete(() => $"User was not logged in.");
            }
        }
    }
}