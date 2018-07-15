using Microsoft.Extensions.Configuration;

namespace Toptal.BikeRentals.Configuration.ConfigSections
{
    /// <summary>
    /// Prevent Cross-Site Request Forgery (XSRF/CSRF) attacks in ASP.NET Core
    /// https://docs.microsoft.com/en-us/aspnet/core/security/anti-request-forgery
    /// </summary>
    public sealed class ServiceApi : Helpers.ConfigSection
    {
        private const string SectionName = "ServiceApi";

        internal ServiceApi(IConfiguration configuration)
            : base(configuration, configuration.GetSection(SectionName))
        {
        }

        public int AntiforgeryCookieExpirationMinutes { get; set; }

        public int MaximumReturnedRows { get; set; }

        public string AntiforgeryTokenHeaderName { get; set; }

        public string AntiforgeryTokenFieldName { get; set; }

        public bool ShowDetailedError { get; set; }
    }
}