using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Security.Principals;

namespace Toptal.BikeRentals.DatabaseInitializers.InitialData
{
    public sealed class AspNetUsers : Helpers.DatabaseInitializerBase
    {
        private IAuthProvider AuthProvider;

        internal AspNetUsers(
            ICallContext callContext,
            AppDbContext appDbContext,
            AppConfig appConfig,
            IAuthProvider authProvider
            ) : base(callContext, appDbContext, appConfig)
        {
            this.AuthProvider = authProvider;
        }

        public override void AfterDatabaseInitialized()
        {
            base.AfterDatabaseInitialized();

            var dbc = AppConfig.DatabaseCreation;

            if (!string.IsNullOrEmpty(dbc.AdminUserFirstName) && !string.IsNullOrEmpty(dbc.AdminUserLastName) && !string.IsNullOrEmpty(dbc.AdminUserEmail) && !string.IsNullOrEmpty(dbc.AdminUserPassword))
                AuthProvider.AddUser(dbc.AdminUserFirstName, dbc.AdminUserLastName, dbc.AdminUserEmail, dbc.AdminUserEmail, dbc.AdminUserPassword, RoleType.Admin);

            if (!string.IsNullOrEmpty(dbc.AdminUserFirstName) && !string.IsNullOrEmpty(dbc.AdminUserLastName) && !string.IsNullOrEmpty(dbc.AdminUserEmail) && !string.IsNullOrEmpty(dbc.AdminUserPassword))
                AuthProvider.AddUser(dbc.AdminUserFirstName2, dbc.AdminUserLastName2, dbc.AdminUserEmail2, dbc.AdminUserEmail2, dbc.AdminUserPassword2, RoleType.Admin);

            for (int i = 0; i < dbc.TestUsersCount; i++)
                AuthProvider.AddUser("Test", $"User {i}", $"testuser{i}@gmail.com", $"testuser{i}@gmail.com", dbc.TestUsersPassword, RoleType.User);

            for (int i = 0; i < dbc.TestManagersCount; i++)
                AuthProvider.AddUser("Test", $"Manager {i}", $"testmanager{i}@gmail.com", $"testmanager{i}@gmail.com", dbc.TestUsersPassword, RoleType.Manager);
        }
    }
}