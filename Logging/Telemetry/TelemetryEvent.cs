namespace Toptal.BikeRentals.Logging.Telemetry
{
    /// <summary>
    /// Order is important
    /// </summary>
    public enum TelemetryEvent
    {
        // TODO
    }

    public static class TelemetryEventHelper
    {
        /// <summary>
        /// Order is important
        /// </summary>
        public static readonly string[] Titles = new string[]{
            // TODO
        };

        public static string Title(this TelemetryEvent evt)
        {
            return Titles[(int)evt];
        }

        public static string Sequence(this TelemetryEvent evt)
        {
            return evt.ToString();
        }
    }
}
