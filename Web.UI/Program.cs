using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Toptal.BikeRentals.Web.UI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
            .UseApplicationInsights()
            .ConfigureAppConfiguration((builderContext, config) =>
            {
                config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)

                // Local configuration settings (appsettings.json) must be overriden in Application Settings when deployed to Azure in the format: SectionnName.Key (otherwise error is thrown)
                // Connection strings must be added to Connection Strings in Azure in the format: Key
                // Azure Application Settings are accessible through environment variables. We add those to configuration for easier processing in ConfigSection.ctor()
                .AddEnvironmentVariables();
            })
            .UseStartup<Startup>()
            .Build();
        }
    }
}
