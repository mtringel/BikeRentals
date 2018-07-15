
using Microsoft.Extensions.Logging;

namespace Toptal.BikeRentals.Exceptions.Security
{
    /// <summary>
    /// Returnns 403 Forbidden, if not authorized, which will result in an error message displayed (application.webApiResult)
    /// </summary>
    public class UnauthorizedException : SecurityException
    {
        public string ResourceName { get; private set; }

        public string Permission { get; private set; }

        public UnauthorizedException(string resourceName, string permission, LogLevel logLevel)
            : base(System.Net.HttpStatusCode.Forbidden, string.Format(Resources.Resources.Security_Unauthorized, resourceName, permission), logLevel)
        {
            this.Permission = permission;
            this.Permission = permission;
        }
    }
}
