using Toptal.BikeRentals.BusinessLogic.Master;
using Toptal.BikeRentals.Service.Models.Account;
using Toptal.BikeRentals.Service.Api.Helpers;
using Toptal.BikeRentals.Service.Models.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Helpers;
using Toptal.BikeRentals.Logging.Telemetry;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Service.Api.Account
{
    public sealed class RegistrationService : ServiceBase
    {
        public RegistrationService(
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
        /// Since our Login page is an Angular template we are in an AJAX/REST call
        /// Instead of ActionResult (Redirect/View) we will return WebApiSimpleResult and process on client side
        /// </summary>
        public void Post(RegisterData model)
        {
            // but we don't need transaction scope here, since we have an atomic operation only (CreateAsync)
            using (var scope = Scope("Post"))
            {
                // prepare
                Helper.Expect(model);

                // validate
                Helper.ValidateModel(model, true);

                // process
                var user = new BusinessEntities.Users.User()
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Email = model.Email,
                    UserName = model.Email,
                    Password = model.Password
                };

                UserManager.Add(user);

                //await SignInManager.Value.SignInAsync(user, isPersistent: false, rememberBrowser: false); - do not login
                scope.Complete(() => $"User created with Id={user.UserId}.");
            }
        }


      
    }
}