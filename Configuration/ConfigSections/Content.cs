using Microsoft.Extensions.Configuration;

namespace Toptal.BikeRentals.Configuration.ConfigSections
{
    /// <summary>
    /// All config parameters must be properties.
    /// </summary>
    public sealed class Content : Helpers.ConfigSection
    {
        private const string SectionName = "Content";

        internal Content(IConfiguration configuration)
            : base(configuration, configuration.GetSection(SectionName))
        {
        }

        public int ImageMaxWidth { get; set; }

        public int ImageMaxHeight { get; set; }

        public int ThumbnailMaxWidth { get; set; }

        public int ThumbnailMaxHeight { get; set; }
    }
}