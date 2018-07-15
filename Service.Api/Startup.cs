using Microsoft.Extensions.DependencyInjection;

namespace Toptal.BikeRentals.Service.Api
{
    /// <summary>
    /// Register provided services here (services are almost always transient)
    /// </summary>
    public static class Startup
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            // Account
            services.AddTransient(typeof(Account.RegistrationService));

            // Bikes
            services.AddTransient(typeof(Bikes.BikeModelService));
            services.AddTransient(typeof(Bikes.BikeService));

            // Master
            services.AddTransient(typeof(Master.ColorService));

            // Rents
            services.AddTransient(typeof(Rents.BikeRentService));

            // Content
            services.AddTransient(typeof(Contents.ContentService));

            // Security
            services.AddTransient(typeof(Security.AuthService));
            services.AddTransient(typeof(Security.RoleService));

            // Users
            services.AddTransient(typeof(Users.UserService));
        }
    }
}
