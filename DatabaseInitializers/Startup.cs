using Microsoft.Extensions.DependencyInjection;
using System;

namespace Toptal.BikeRentals.DatabaseInitializers
{
    /// <summary>
    /// Register provided services here (services are almost always transient)
    /// </summary>
    public static class Startup
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient(typeof(Helpers.IDatabaseInitializer), typeof(DatabaseInitializer));
        }

        public static void CreateDatabaseIfNotExists(IServiceProvider services)
        {
             var initializer = (Toptal.BikeRentals.DatabaseInitializers.DatabaseInitializer)services.GetService(typeof(Toptal.BikeRentals.DatabaseInitializers.DatabaseInitializer));

            initializer.InitializeDatabase();
            initializer.AfterDatabaseInitialized();
        }
    }
}
