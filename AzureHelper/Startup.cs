using Microsoft.Extensions.DependencyInjection;

namespace Toptal.BikeRentals.AzureHelper
{
    /// <summary>
    /// Register provided services here (services are almost always transient)
    /// </summary>
    public static class Startup
    {
        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped(typeof(Toptal.BikeRentals.Logging.Telemetry.ITelemetryLogger), typeof(Telemetry.TelemetryClient));
        }
    }
}
