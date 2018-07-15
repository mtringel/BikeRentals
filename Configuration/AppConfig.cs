using Toptal.BikeRentals.Configuration.ConfigSections;
using Microsoft.Extensions.Configuration;

namespace Toptal.BikeRentals.Configuration
{
    public class AppConfig
    {
        public AppConfig(IConfiguration configuration)
        {
            ConnectionStrings = new ConnectionStrings(configuration);
            WebApplication = new WebApplication(configuration);
            ProductInfo = new ProductInfo(configuration);
            Security = new Security(configuration);
            DatabaseCreation = new DatabaseCreation(configuration);
            ServiceApi = new ServiceApi (configuration);
            Logging = new Logging(configuration);
            AzureAdOptions = new AzureAdOptions(configuration);
            ApplicationInsights = new ApplicationInsights(configuration);
        }

        public ConnectionStrings ConnectionStrings { get; private set; }

        public ProductInfo ProductInfo { get; private set; }

        public Security Security { get; private set; }

        public DatabaseCreation DatabaseCreation { get; private set; }

        public ServiceApi ServiceApi { get; private set; }

        public WebApplication WebApplication { get; private set; }

        public Logging Logging { get; private set; }

        public AzureAdOptions AzureAdOptions{ get; private set; }

        public ApplicationInsights ApplicationInsights { get; private set; }
    }


}
