using Microsoft.AspNetCore.Antiforgery;
using System;
using System.Globalization;
using System.Security.Claims;
using Toptal.BikeRentals.CallContext.Helpers;

namespace Toptal.BikeRentals.CallContext
{
    /// <summary>
    /// Encapsulates all caller context related tasks.
    /// Default implementation for Web applications is just a wrapper around HttpContext.Current, but can be modified for different hosting options.
    /// HttpContext.Current / Request / Response should be ONLY modified here.
    /// </summary>
    public interface ICallContext
    {
        string ResourceUri { get; }

        ClaimsPrincipal Identity { get; }

        /// <summary>
        /// This is either an MVC Controller or a Web API Controller
        /// https://docs.microsoft.com/en-us/aspnet/core/security/anti-request-forgery
        /// </summary>
        IController ActiveController { get; set; }

        CultureInfo UICulture { get; set; }

        bool IsXmlHttpRequest { get; }

        Exception LastError { get; set; }

        /// <summary>
        /// Used for tracing and Unit testing purposes
        /// </summary>
        string LastProcessCompletedMessage { get; set; }

        /// <summary>
        /// Used for tracing and Unit testing purposes
        /// </summary>
        string LastProcessFailedMessage { get; set; }

        /// <summary>
        /// Generates anti-forgery token.
        /// Current version sets the cookie and returns the token.
        /// </summary>
        AntiforgeryTokenSet AntiforgeryTokenGenerate();

        /// <summary>
        /// Validates generated anti-forgery token at post back, if cookie + hidden field were supplied successfully
        /// </summary>
        bool AntiforgeryTokenValidate(bool throwAntiforgeryValidationException);
    }
}
