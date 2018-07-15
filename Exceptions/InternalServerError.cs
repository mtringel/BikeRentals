using System.Net;

namespace Toptal.BikeRentals.Exceptions
{
    public sealed class InternalServerError : AppException 
    {
        public InternalServerError(string description)
            : base(HttpStatusCode.InternalServerError, description, Microsoft.Extensions.Logging.LogLevel.Critical)
        {
        }

        public InternalServerError()
            : this(string.Empty)
        {
        }
    }
}
