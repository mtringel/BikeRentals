using Microsoft.Extensions.DependencyInjection;

namespace Toptal.BikeRentals.Web.Api
{
    /// <summary>
    /// Register provided services here (services are almost always transient)
    /// </summary>
    public static class Startup
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            // Account
            services.AddTransient(typeof(Account.RegistrationController));

            // Bikes
            services.AddTransient(typeof(Bikes.BikeModelsController));
            services.AddTransient(typeof(Bikes.BikesController));

            // Master
            services.AddTransient(typeof(Master.ColorsController));

            // Shared
            services.AddTransient(typeof(Shared.AutoCompleteController));

            // Rents
            services.AddTransient(typeof(Rents.BikeRentsController));

            // Content
            services.AddTransient(typeof(Contents.ContentController));

            // Security
            services.AddTransient(typeof(Security.AuthServiceController));

            // Users
            services.AddTransient(typeof(Users.UsersController));
        }
    }
}
