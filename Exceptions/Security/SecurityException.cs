using Microsoft.Extensions.Logging;
using System.Net;


namespace Toptal.BikeRentals.Exceptions.Security
{
    /// <summary>
    /// Root class for all Security exceptions
    /// </summary>
    public abstract class SecurityException : AppException
    {
        public SecurityException(HttpStatusCode status, string statusText, LogLevel logLevel)
            : base(status, statusText, logLevel)
        {
        }
    }
}

