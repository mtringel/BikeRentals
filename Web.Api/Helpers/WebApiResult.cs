using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Toptal.BikeRentals.Web.Api.Helpers
{
    public sealed class WebApiResult : ObjectResult
    {
        internal WebApiResult(HttpStatusCode statusCode, object value)
            : this((int)statusCode, value)
        {
        }

        internal WebApiResult(int statusCode, object value)
            : base(value)
        {
            StatusCode = statusCode;
        }
    }
}
