namespace Toptal.BikeRentals.Web.UI.Helpers
{
    public sealed class ErrorState : Model
    {
        public string RequestId { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

        internal ErrorState()
        {
        }
    }
}
