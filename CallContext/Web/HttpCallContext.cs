using System;
using System.Globalization;
using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Toptal.BikeRentals.CallContext.Helpers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Exceptions.Validation;

namespace Toptal.BikeRentals.CallContext.Web
{
    /// <summary>
    /// Encapsulates all caller context related tasks.
    /// Wrapper around HttpContext.Current, but can be modified for different hosting options.
    /// HttpContext should ONLY be used here in the solution (Request, Response, Cookies, User etc.)
    /// </summary>
    public sealed class HttpCallContext : ICallContext
    {
        public HttpCallContext(
            IHttpContextAccessor httpContextAccessor,
            AppConfig appConfig,
            IAntiforgery antiforgery
            )
        {
            this.HttpContext = httpContextAccessor.HttpContext;
            this.AppConfig = appConfig;
            this.Antiforgery = antiforgery;

            // we go with en-US
            UICulture = CultureInfo.GetCultureInfo("en-US");

            //var langs = HttpContext.Request.Headers["accept-language"];

            //if (langs.Count > 0)
            //{
            //    try
            //    {
            //        UICulture = CultureInfo.GetCultureInfo(langs[0]);
            //    }
            //    catch { }
            //}
        }

        #region Services

        private HttpContext HttpContext;

        private AppConfig AppConfig;

        private IAntiforgery Antiforgery;

        #endregion

        public ClaimsPrincipal Identity { get { return HttpContext.User; } }

        public string ResourceUri { get { return HttpContext.Request.Path; } }

        public CultureInfo UICulture { get; set; }

        /// <summary>
        /// This is either an MVC Controller or a Web API Controller
        /// </summary>
        public IController ActiveController { get; set; }

        public Exception LastError { get; set; }

        public bool IsXmlHttpRequest { get { return HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest"; } }

        /// <summary>
        /// Used for tracing and Unit testing purposes
        /// </summary>
        public string LastProcessCompletedMessage { get; set; }

        /// <summary>
        /// Used for tracing and Unit testing purposes
        /// </summary>
        public string LastProcessFailedMessage { get; set; }

        #region Antiforgery

        /// <summary>
        /// Generates anti-forgery token.
        /// Current version sets the cookie and returns the token.
        /// </summary>
        public AntiforgeryTokenSet AntiforgeryTokenGenerate()
        {
            return Antiforgery.GetAndStoreTokens(this.HttpContext);
        }

        /// <summary>
        /// Validates generated anti-forgery token at post back, if cookie + hidden field were supplied successfully
        /// </summary>
        public bool AntiforgeryTokenValidate(bool throwAntiforgeryValidationException)
        {
            try
            {
                Antiforgery.ValidateRequestAsync(HttpContext).Wait();
                return true;
            }
            catch (Exception ex)
            {
                if (!throwAntiforgeryValidationException)
                    return false;
                else if (ex is Microsoft.AspNetCore.Antiforgery.AntiforgeryValidationException ||
                    ex.InnerException is Microsoft.AspNetCore.Antiforgery.AntiforgeryValidationException)
                {
                    var newEx = new AntiforgeryTokenValidationException();

                    if (AppConfig.ServiceApi.ShowDetailedError)
                        newEx.DetailedErrorMessage = ex is Microsoft.AspNetCore.Antiforgery.AntiforgeryValidationException ? ex.ToString() : ex.InnerException.ToString();

                    throw newEx;
                }
                else
                    throw;
            }
        }

        #endregion
    }
}
