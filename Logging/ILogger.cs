using System;
using Microsoft.Extensions.Logging;

namespace Toptal.BikeRentals.Logging
{
    public interface ILogger
    {
        /// <summary>
        /// Generic logger
        /// Call it manually, if Exception is swallowed
        /// </summary>
        void LogError(object state, LogLevel level, Exception ex);
    }
}