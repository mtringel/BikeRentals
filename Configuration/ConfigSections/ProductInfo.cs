using Microsoft.Extensions.Configuration;

namespace Toptal.BikeRentals.Configuration.ConfigSections
{
    /// <summary>
    /// All config parameters must be properties.
    /// </summary>
    public sealed class ProductInfo : Helpers.ConfigSection
    {
        private const string SectionName = "ProductInfo";

        internal ProductInfo(IConfiguration configuration)
            : base(configuration, configuration.GetSection(SectionName))
        {
        }

        public string Title { get; set; }

        public string TitleShort { get; set; }

        public string Product { get; set; }

        public string Copyright { get; set; }

        public string Company { get; set; }

        public string Version { get; set; }
    }
}
