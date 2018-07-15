namespace Toptal.BikeRentals.Logging.Telemetry
{
    /// <summary>
    /// Order is important
    /// </summary>
    public enum TelemetryMetric
    {
        // TODO
    }

    public static class TelemetryMetricHelper
    {
        /// <summary>
        /// Order is important
        /// </summary>
        public static readonly string[] Titles = new string[]{
        };

        public static string Title(this TelemetryMetric metric)
        {
            return Titles[(int)metric];
        }

        public static string Sequence(this TelemetryMetric metric)
        {
            return metric.ToString();
        }

    }
}
