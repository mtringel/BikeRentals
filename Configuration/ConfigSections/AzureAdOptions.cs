using Toptal.BikeRentals.Configuration.Helpers;
using Microsoft.Extensions.Configuration;
using System;

namespace Toptal.BikeRentals.Configuration.ConfigSections
{
    /// <summary>
    /// All config parameters must be properties.
    /// </summary>
    public sealed class AzureAdOptions : ConfigSection
    {
        private const string SectionName = "AzureAd";

        internal AzureAdOptions(IConfiguration configuration)
            : base(configuration, configuration.GetSection(SectionName))
        {
            if (!CallbackPath.StartsWith('/'))
                CallbackPath = '/' + CallbackPath;

            Instance = Instance.TrimEnd('/');
        }

        /// <summary>
        /// Application ID from App Registration.
        /// </summary>
        public Guid ClientId { get; set; }

        /// <summary>
        /// Any of the keys generated for App Registration (ClientSecret) 
        /// </summary>
        public string ClientSecret { get; set; }

        public string Instance { get; set; }

        public string Authority(Guid tenantId)
        {
            return $"{Instance}/{tenantId}";
        }

        public Guid TenantId { get; set; }

        /// <summary>
        /// Starts with '/'
        /// </summary>
        public string CallbackPath { get; set; }

    }
}