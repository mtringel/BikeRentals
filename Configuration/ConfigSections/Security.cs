using Microsoft.Extensions.Configuration;

namespace Toptal.BikeRentals.Configuration.ConfigSections
{
    /// <summary>
    /// All config parameters must be properties.
    /// </summary>
    public sealed class Security : Helpers.ConfigSection
    {
        const string SectionName = "Security";

        public Security(IConfiguration configuration)
            : base(configuration, configuration.GetSection(SectionName))
        {
        }

        #region Auto login (for development)

        /// <summary>
        /// Auto login never works in Release mode. 
        /// See _Layout.cshtml and authService.js/autoLogin().
        /// </summary>
        public bool AutoLoginIfDebugging { get; set; }

        /// <summary>
        /// Rendered into Javascript variable in Debug mode, if enabled. Never rendered in Release mode.
        /// See _Layout.cshtml and authService.js/autoLogin().
        /// </summary>
        public string AutoLoginEmail { get; set; }

        /// <summary>
        /// Rendered into Javascript variable in Debug mode, if enabled. Never rendered in Release mode.
        /// See _Layout.cshtml and authService.js/autoLogin().
        /// </summary>
        public string AutoLoginPassword { get; set; }

        #endregion

        #region ASP Net Identity

        public int AspNetIdentityCookieExpirationMinutes { get; set; }

        #endregion
    }
}