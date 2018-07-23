using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Security.Principals;

namespace Toptal.BikeRentals.DatabaseInitializers.InitialData
{
    public sealed class AspNetRoles : Helpers.DatabaseInitializerBase
    {
        private IAuthProvider AuthProvider;

        internal AspNetRoles(
            ICallContext callContext, 
            AppDbContext appDbContext, 
            AppConfig appConfig,
            IAuthProvider authProvider
            ) 
            : base(callContext, appDbContext, appConfig)
        {
            this.AuthProvider = authProvider;
        }

        public override void AfterDatabaseInitialized()
        {
            base.AfterDatabaseInitialized();

            foreach (var role in RoleTypeHelper.AllRoles)
                AuthProvider.CreateRole(role);
        }
    }
}
