using System.Collections.Generic;
using System.Linq;
using Toptal.BikeRentals.Security.Principals;
using Toptal.BikeRentals.Exceptions.Entities;
using Toptal.BikeRentals.BusinessLogic.Helpers;
using Toptal.BikeRentals.Security.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Users;
using Toptal.BikeRentals.BusinessEntities.Users;
using Microsoft.Extensions.Logging;

namespace Toptal.BikeRentals.BusinessLogic.Users
{
    /// <summary>
    /// Lifetime: n/a (transient or current request, undetermined, don't rely on internal state)
    /// </summary>
    public class UserProvider : BusinessLogicManagerBase, IUserProvider
    {
        #region Services

        /// <summary>
        /// BusinessLogicManagers should not call each others DataProvider, but can call each other.
        /// </summary>
        private UserDataProvider UserDataProvider;

        #endregion

        public UserProvider(
            ICallContext callContext,
            AppConfig appConfig,
            UserDataProvider userDataProvider
            )
            : base(callContext, appConfig)
        {
            this.UserDataProvider = userDataProvider;
        }
        
        /// <summary>
        /// Read from the BikeRentals.V_User view (selecting from the ASP NET Identity database)
        /// </summary>
        public IEnumerable<User> GetList()
        {
            return GetList(null, null, null);
        }

        /// <summary>
        /// Read from the BikeRentals.V_User view (selecting from the ASP NET Identity database)
        /// </summary>
        public IEnumerable<User> GetList(string userListFilter, string autoCompleteFilter, int? maxRows)
        {
            // keep lazy loaded, don't fetch until needed
            return UserDataProvider.GetList(userListFilter, autoCompleteFilter, maxRows);
        }

        /// <summary>
        /// Read from the BikeRentals.V_User view (selecting from the ASP NET Identity database)
        /// </summary>
        public User GetById(string id)
        {
            var res = UserDataProvider.Get(id, true);

            if (res == null)
                throw new EntityNotFoundException(CallContext.ResourceUri, typeof(User), new[] { id }, LogLevel.Error);

            return res;
        }


        /// <summary>
        /// Case sensitive, accent sensitive to use UserNameIndex
        /// </summary>
        public User GetByUserName(string userName) {
            return GetByUserName(userName, true);
        }

        /// <summary>
        /// Case sensitive, accent sensitive to use UserNameIndex
        /// </summary>
        protected User GetByUserName(string userName, bool? isActive)
        {
            return UserDataProvider.GetByUserName(userName, isActive);
        }

        /// <summary>
        /// We need this to find users very fast in the database by using UserNameIndex (which ASP Net Identity does not do, performs full table scan)
        /// </summary>
        AppUser IUserProvider.FindByUserName(string userName)
        {
            var user = GetByUserName(userName);

            if (user == null)
                return null;
            else
                return new AppUser(
                    user.UserId,
                    user.FirstName,
                    user.LastName,
                    user.UserName,
                    user.Email,
                    user.Role
                    );
        }
    }
}
