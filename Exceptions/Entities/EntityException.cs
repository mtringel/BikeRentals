using Microsoft.Extensions.Logging;
using System.Net;

namespace Toptal.BikeRentals.Exceptions.Entities
{
    /// <summary>
    /// Root class for all Entity related exceptions
    /// </summary>
    public abstract class EntityException : AppException
    {
        public EntityException(HttpStatusCode status, string statusText, LogLevel logLevel)
            : base(status, statusText, logLevel)
        {
        }
    }
}

