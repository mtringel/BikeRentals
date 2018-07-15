using Microsoft.Extensions.Logging;
using System.Net;


namespace Toptal.BikeRentals.Exceptions.Configuration
{
    /// <summary>
    /// Root class for all configuration exceptions
    /// </summary>
    public abstract class ConfigurationException : AppException
    {
        public ConfigurationException(HttpStatusCode status, string statusText, LogLevel logLevel)
            : base(status, statusText, logLevel)
        {
        }
    }
}

