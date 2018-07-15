using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Web.UI.Helpers;

namespace Toptal.BikeRentals.Web.UI.Controllers
{
    public class HomeController : Toptal.BikeRentals.Web.UI.Helpers.ControllerBase
    {
        public HomeController(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            ITelemetryLogger logger
            )
            : base(callContext, authProvider, appConfig, logger)
        {
        }

        [AllowAnonymous]
        public IActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        public IActionResult Error()
        {
            return View(new ErrorState { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
