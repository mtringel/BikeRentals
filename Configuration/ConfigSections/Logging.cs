using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Toptal.BikeRentals.Configuration.ConfigSections
{
    /// <summary>
    /// All config parameters must be properties.
    /// </summary>
    public sealed class Logging : Helpers.ConfigSection
    {
        private const string SectionName = "Logging";

        internal Logging(IConfiguration configuration)
            : base(configuration, configuration.GetSection(SectionName))
        {
        }

        public LogLevel LogLevel { get; set; }

        /// <summary>
        /// When unit testing, the "UnitTesting" section is used!
        /// </summary>
        public bool LogMetrics { get; set; }

        /// <summary>
        /// When unit testing, the "UnitTesting" section is used!
        /// </summary>
        public bool LogTrace { get; set; }

        /// <summary>
        /// When unit testing, the "UnitTesting" section is used!
        /// </summary>
        public bool LogEvents { get; set; }
    }
}