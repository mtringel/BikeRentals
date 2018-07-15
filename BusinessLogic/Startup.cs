using Microsoft.Extensions.DependencyInjection;

namespace Toptal.BikeRentals.BusinessLogic 
{
    /// <summary>
    /// Register provided services here (services are almost always transient)
    /// </summary>
    public static class Startup
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            // Bikess
            services.AddTransient(typeof(Bikes.BikeManager));
            services.AddTransient(typeof(Bikes.BikeModelManager));

            // Master
            services.AddTransient(typeof(Master.ColorManager));

            // Rents
            services.AddTransient(typeof(Rents.BikeRentManager));

            // Content
            services.AddTransient(typeof(Contents.ContentManager));

            // Users
            services.AddTransient(typeof(Users.UserManager));
            services.AddTransient(typeof(Users.UserProvider));
            services.AddTransient(typeof(Security.Helpers.IUserProvider), typeof(Users.UserProvider));
        }
    }
}
