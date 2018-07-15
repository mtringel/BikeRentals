using System.Net;
using Microsoft.Extensions.Logging;

namespace Toptal.BikeRentals.Exceptions.Configuration
{
    public sealed class ApplicationSettingNotFoundException : ConfigurationException
    {
        public ApplicationSettingNotFoundException(string key)
            : base(HttpStatusCode.InternalServerError,  string.Format(Resources.Resources.Configuration_AppSettingNotFound, key), LogLevel.Critical)
        {
        }
    }
}

