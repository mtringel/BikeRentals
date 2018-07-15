using Microsoft.Extensions.Logging;
using System.Net;


namespace Toptal.BikeRentals.Exceptions.DataAccess
{
    /// <summary>
    /// Root class for all data access exceptions
    /// </summary>
    public abstract class DataAccessException : AppException
    {
        public DataAccessException(HttpStatusCode status, string statusText, LogLevel logLevel)
            : base(status, statusText, logLevel)
        {
        }
    }
}

