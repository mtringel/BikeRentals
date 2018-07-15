using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Users;
using Toptal.BikeRentals.BusinessEntities.Users;

namespace Toptal.BikeRentals.BusinessLogic.Users
{
    /// <summary>
    /// Lifetime: n/a (transient or current request, undetermined, don't rely on internal state)
    /// </summary>
    public sealed class UserManager : UserProvider
    {
        #region Services

        private IAuthProvider AuthProvider;

        #endregion

        public UserManager(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            UserDataProvider userDataProvider
            )
            : base(callContext, appConfig, userDataProvider)
        {
            this.AuthProvider = authProvider;
        }

        /// <summary>
        /// Saves modified user data into the ASP Net Identity database
        /// </summary>
        public void Add(User user)
        {
            AuthProvider.AddUser(user.FirstName, user.LastName, user.UserName, user.Email, user.Password, user.Role);
            user.UserId = GetByUserName(user.UserName).UserId; // this is dnoe by EF, but we have to do it manually here
        }

        /// <summary>
        /// Saves modified user data into the ASP Net Identity database
        /// </summary>
        public void Update(User user)
        {
            AuthProvider.UpdateUser(user.UserId, user.FirstName, user.LastName, user.UserName, user.Email, user.Password, user.Role);
        }

        public void Delete(string userId)
        {
            AuthProvider.DeleteUser(userId);

            // TODO
            // delete related entities
        }

        public void Login(string userName, string password, bool rememberMe)
        {
            AuthProvider.Login(userName, password, rememberMe);
        }

        public void LogOut()
        {
            AuthProvider.LogOut();
        }
    }
}