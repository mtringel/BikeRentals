using System;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Security.Principals;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Security.DataAccess;
using Toptal.BikeRentals.DatabaseInitializers.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.DataAccess;

namespace Toptal.BikeRentals.DatabaseInitializers.AspNetIdentity
{
    public sealed class AspNetIdentityDbInitializer : DatabaseInitializerBase
    {
        #region Services

        private IAuthProvider AuthProvider;

        private AspNetIdentityDbContext AspNetIdentityDbContext;

        #endregion

        internal AspNetIdentityDbInitializer(
            ICallContext callContext,
            AppDbContext appDbContext,
            AppConfig appConfig,
            IAuthProvider authProvider,
            AspNetIdentityDbContext aspNetIdentityDbContext
            )
            : base(callContext, appDbContext, appConfig)
        {
            this.AuthProvider = authProvider;
            this.AspNetIdentityDbContext = aspNetIdentityDbContext;
        }

        public override void InitializeDatabase()
        {
            try
            {
                var config = AppConfig.DatabaseCreation;

                // Initialize default identity roles
                foreach (var role in RoleTypeHelper.AllRoles)
                    AuthProvider.CreateRole(role);

                // Initialize default user

                // Admin
                if (!string.IsNullOrEmpty(config.AdminUserFirstName))
                    AuthProvider.AddUser(config.AdminUserFirstName, config.AdminUserLastName, config.AdminUserEmail, config.AdminUserEmail, config.AdminUserPassword, RoleType.Admin);

                if (!string.IsNullOrEmpty(config.AdminUserFirstName2))
                    AuthProvider.AddUser(config.AdminUserFirstName2, config.AdminUserLastName2, config.AdminUserEmail2, config.AdminUserEmail2, config.AdminUserPassword2, RoleType.Admin);

                // User manager
                for (int i = 1; i <= config.TestManagersCount; i++)
                    AuthProvider.AddUser("Manager", i.ToString(), $"manager{i}@gmail.com", $"manager{i}@gmail.com", config.TestUsersPassword, RoleType.Manager);

                // User
                for (int i = 1; i <= config.TestUsersCount; i++)
                    AuthProvider.AddUser("User", i.ToString(), $"user{i}@gmail.com", $"user{i}@gmail.com", config.TestUsersPassword, RoleType.User);
            }
#if DEBUG
            catch (Exception ex)
            {
                throw ex;
            }
#else
            catch 
            {
                throw;
            }
#endif
        }
    }
}
