using System;
using Microsoft.Extensions.Logging;

namespace Toptal.BikeRentals.Logging.Telemetry
{
    /// <summary>
    /// Implemented by AzureHelper.Telemetry.TelemetryClient
    /// </summary>
    public interface ITelemetryLogger : ILogger
    {
        /// <summary>
        /// If addDateTime is sppecified Year, Month, Day properties are added. If time portion is not 00:00:00.000 then also Hour is added.
        /// </summary>
        void LogTrace(string message, LogLevel level, ITelemetryPropertyProvider properties, DateTime? addDateTime);

        /// <summary>
        /// If addDateTime is sppecified Year, Month, Day properties are added. If time portion is not 00:00:00.000 then also Hour is added.
        /// </summary>
        void LogMetrics(TelemetryMetric[] metrics, double value, ITelemetryPropertyProvider properties, DateTime? addDateTime);

        /// <summary>
        /// If addDateTime is sppecified Year, Month, Day properties are added. If time portion is not 00:00:00.000 then also Hour is added.
        /// </summary>
        void LogMetric(TelemetryMetric metric, double value, ITelemetryPropertyProvider properties, DateTime? addDateTime);

        /// <summary>
        /// If addDateTime is sppecified Year, Month, Day properties are added. If time portion is not 00:00:00.000 then also Hour is added.
        /// </summary>
        void LogEvent(TelemetryEvent eventName, ITelemetryPropertyProvider properties, DateTime? addDateTime);

        /// <summary>
        /// If addDateTime is sppecified Year, Month, Day properties are added. If time portion is not 00:00:00.000 then also Hour is added.
        /// </summary>
        void LogEventWithMetrics(TelemetryEvent eventName, TelemetryMetric[] metrics, double value, ITelemetryPropertyProvider properties, DateTime? addDateTime);
    }
}