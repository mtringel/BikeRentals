#if DEBUG
using Microsoft.AspNetCore.Mvc.Filters;
using Toptal.BikeRentals.Logging;

namespace Toptal.BikeRentals.Logging
{
    /// <summary>
    /// Global exception handler
    /// </summary>
    public sealed class ExceptionFilter : IExceptionFilter
    {
        public ExceptionFilter(ILogger logger)
        {
            this.Logger = logger;
        }

        #region Services

        private ILogger Logger;

        #endregion

        /// <summary>
        /// Global exception handler
        /// </summary>
        public void OnException(ExceptionContext filterContext)
        {
            //if (filterContext?.Exception != null)
            //{
            //    // non AppExceptions are Critical
            //    // call it manually, if Exception is swallowed
            //    //Logger.LogError(
            //    //    this,
            //    //    filterContext.Exception is AppException appException ? appException.LogLevel : Microsoft.Extensions.Logging.LogLevel.Critical,
            //    //    filterContext.Exception
            //    //    );
            //}
        }
    }
}
#endif