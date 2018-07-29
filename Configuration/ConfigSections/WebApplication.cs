using Toptal.BikeRentals.Exceptions.Configuration;
using Microsoft.Extensions.Configuration;
using Toptal.BikeRentals.Configuration.Helpers;

namespace Toptal.BikeRentals.Configuration.ConfigSections
{
    /// <summary>
    /// All config parameters must be properties.
    /// </summary>
    public sealed class WebApplication : Helpers.ConfigSection
    {
        private const string SectionName = "WebApplication";

        internal WebApplication(IConfiguration configuration)
            : base(configuration, configuration.GetSection(SectionName))
        {
            if (string.IsNullOrEmpty(BaseUrl))
                throw new ApplicationSettingNotFoundException($"{SectionName}.BaseUrl");

            BaseUrl = BaseUrl.TrimEnd('/');
            BasePath = BasePath.TrimEnd('/');

#if DEBUG
            HostingEnvironment = HostingEnvironment.Development;
#endif
        }

        public bool CookieConsent { get; set; }

        /// <summary>
        /// Does not end with '/'
        /// </summary>
        public string BasePath { get; set; }

        /// <summary>
        /// Does not end with '/'
        /// When unit testing, the "UnitTesting" section is used!
        /// </summary>
        public string BaseUrl { get; set; }

        public string ContentBaseFilePath { get; set; }

        public int GridPageSize { get; set; }

        public int GridMaxRows { get; set; }

        public int AutoCompleteMaxRows { get; set; }

        /// <summary>
        /// Set programatically, cannot be configured
        /// </summary>
        public HostingEnvironment HostingEnvironment { get; set; }

        public bool ShowDetailedError { get { return HostingEnvironment.IsDevelopment(); } }

        public int ClientCacheDurationInMinutes { get; set; }

#if !DEBUG
        public bool ShowDeveloperConsoleInReleaseMode { get; set; }
#endif
    }
}