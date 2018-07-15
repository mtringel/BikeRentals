using Microsoft.Extensions.DependencyInjection;

namespace Toptal.BikeRentals.DataAccess
{
    /// <summary>
    /// Register provided services here (services are almost always transient)
    /// </summary>
    public static class Startup
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            // DbContexts
            services.AddDbContext<AppDbContext>(ServiceLifetime.Scoped);

            // Bikes
            services.AddTransient(typeof(Bikes.BikeDataProvider));
            services.AddTransient(typeof(Bikes.BikeModelDataProvider));

            // Rents
            services.AddTransient(typeof(Rents.BikeRentDataProvider));

            // Master
            services.AddTransient(typeof(Master.ColorDataProvider));

            // Users
            services.AddTransient(typeof(Users.UserDataProvider));

            // TransactionManager (return the same AppDbContext instance, don't create new)
            services.AddScoped(typeof(Helpers.ITransactionManager), t => t.GetService(typeof(AppDbContext)));
        }
    }
}
