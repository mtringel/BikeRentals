using Microsoft.AspNetCore.Mvc;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Security.Managers;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Globalization;
using System;
using Toptal.BikeRentals.Logging.Telemetry;

namespace Toptal.BikeRentals.Web.UI.Helpers
{
    /// <summary>
    /// This is for MVC, not for Web API.
    /// </summary>
    public abstract class ControllerBase : Controller, IController
    {
        public ControllerBase(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            ITelemetryLogger logger
            )
        {
            this.CallContext = callContext;
            this.AuthProvider = authProvider;
            this.AppConfig = appConfig;
            this.Logger = logger;

            this.CallContext.ActiveController = this;
            this.Helper = new ControllerHelper(callContext, appConfig, logger);
        }

        /// <summary>
        /// This is for MVC, not for Web API.
        /// </summary>
        public ControllerHelper Helper { get; private set; }

        /// <summary>
        /// This is for MVC, not for Web API.
        /// </summary>
        public CultureInfo UICulture { get { return CallContext.UICulture; } }

        public virtual string Name
        {
            get
            {
                // Not working in Unit tests
                var name = ControllerContext?.ActionDescriptor?.ControllerName;

                if (!string.IsNullOrEmpty(name))
                    return name;

                name = this.GetType().Name;

                if (name.EndsWith("Controller"))
                    return name.Substring(0, name.Length - "Controller".Length);
                else
                    return name;
            }
        }

        /// <summary>
        /// This is for MVC, not for Web API.
        /// Used to control to output format of validation message (whether 'please' prefix is added)
        /// </summary>
        public bool ModelIsValidated { get; private set; }

        #region Services

        public ITelemetryLogger Logger { get; private set; }

        public ICallContext CallContext { get; private set; }

        public IAuthProvider AuthProvider { get; private set; }

        public AppConfig AppConfig { get; private set; }

        #endregion

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            base.OnActionExecuting(context);

            // don't do it in the constructor, that's too early
            ViewBag.ActiveController = this;
        }

        #region Validation

        /// <summary>
        /// This is for MVC, not for Web API.
        /// </summary>
        protected void ValidateAjaxRequest(bool xmlHttpRequestExpected)
        {
            if (xmlHttpRequestExpected)
            {
                if (!this.CallContext.IsXmlHttpRequest)
                    throw new InvalidOperationException("XmlHttpRequest postback was expected.");
            }
            else if (this.CallContext.IsXmlHttpRequest)
                throw new InvalidOperationException("XmlHttpRequest postback was not expected.");
        }

        /// <summary>
        /// This is for MVC, not for Web API.
        /// Returns true, if there are no errors.
        /// Controller.TryValidateModel does not work in Unit tests
        /// https://github.com/aspnet/Mvc/issues/3586
        /// </summary>
        public bool ValidateModel(object model)
        {
            ModelIsValidated = true;
            return Helper.ValidateModel(model, ModelState);
        }

        #endregion

    }
}
