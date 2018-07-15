using Toptal.BikeRentals.Exceptions.Configuration;
using Microsoft.Extensions.Configuration;

namespace Toptal.BikeRentals.Configuration.ConfigSections
{
    /// <summary>
    /// All config parameters must be properties.
    /// </summary>
    public sealed class ConnectionStrings : Helpers.ConfigSection
    {
        private const string SectionName = "ConnectionStrings";

        internal ConnectionStrings(IConfiguration configuration)
            : base(configuration, configuration.GetSection(SectionName)) 
        {
            if (string.IsNullOrEmpty(AppDb))
                throw new ApplicationSettingNotFoundException($"{SectionName}.AppDb");
        }

        public string AppDb { get; set; }
    }
}
