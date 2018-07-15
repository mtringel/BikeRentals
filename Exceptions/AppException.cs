using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Net.Http;

namespace Toptal.BikeRentals.Exceptions
{
    /// <summary>
    /// Root class for all application exceptions
    /// </summary>
    public abstract class AppException : ApplicationException
    {
        public HttpStatusCode Status { get; private set; }

        public LogLevel LogLevel { get; private set; }

        public string DetailedErrorMessage { get; set; }

        public AppException(HttpStatusCode status, string statusText, LogLevel logLevel, Exception innerException)
            : base(statusText, innerException)
        {
            this.Status = status;
            this.LogLevel = LogLevel;
        }

        public AppException(HttpStatusCode status, string statusText, LogLevel logLevel)
            : this(status, statusText, logLevel, null)
        {
        }

        public AppException(HttpStatusCode status, LogLevel logLevel)
            : this(status, null, logLevel)
        {
        }

        public override string ToString()
        {
            return $"[AppException Status={Status}, Message={Message}, LogLevel={LogLevel}, DetailedErrorMessage={DetailedErrorMessage}]";
        }
    }
}
