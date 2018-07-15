using Microsoft.Extensions.DependencyInjection;

namespace Toptal.BikeRentals.Logging
{
    /// <summary>
    /// Register provided services here (services are almost always transient)
    /// 
    /// Using Application Insights with ILoggerFactory
    /// https://stackoverflow.com/questions/45022693/using-application-insights-with-iloggerfactory?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    /// </summary>
    public static class Startup
    {
        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        public static void ConfigureServices(IServiceCollection services)
        {
            // see AzureHelper.Telemetry.TelemetryClient
            services.AddScoped(typeof(ILogger), typeof(MicrosoftExtensions.Logger));
        }
    }
}
