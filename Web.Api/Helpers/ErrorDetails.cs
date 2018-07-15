namespace Toptal.BikeRentals.Web.Api.Helpers
{
    public sealed class ErrorDetails
    {
        public string Message { get; private set; }

        public string DetailedMessage { get; private set; }

        public ErrorDetails(string message, string detailedMessage)
        {
            this.Message = message;
            this.DetailedMessage = detailedMessage;
        }

        public ErrorDetails(string message)
            : this(message, null)
        {
        }
    }
}
