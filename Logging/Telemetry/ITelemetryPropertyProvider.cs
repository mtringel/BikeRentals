using System.Collections.Generic;

namespace Toptal.BikeRentals.Logging.Telemetry
{
    public interface ITelemetryPropertyProvider
    {
        void GetTelemetryProperties(LogType logType, string prefix, IDictionary<string, string> properties);
    }
}
