using Microsoft.Extensions.Configuration;

namespace Toptal.BikeRentals.Configuration.ConfigSections
{
    /// <summary>
    /// All config parameters must be properties.
    /// </summary>
    public sealed class ApplicationInsights : Helpers.ConfigSection
    {
        private const string SectionName = "ApplicationInsights";

        internal ApplicationInsights(IConfiguration configuration)
            : base(configuration, configuration.GetSection(SectionName))
        {
        }

        public string InstrumentationKey { get; set; }

        /// <summary>
        /// We need this for Startup (when AppConfig is not available)
        /// </summary>
        public static string GetInstrumentationKey(IConfiguration configuration)
        {
            return configuration.GetSection(SectionName)["InstrumentationKey"];
        }

    }
}