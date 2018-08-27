using Toptal.BikeRentals.BusinessEntities.Helpers;

namespace Toptal.BikeRentals.BusinessEntities.Contents
{
    public sealed class ContentRef
    {
        public ContentType ContentType { get; private set; }

        /// <summary>
        /// Image file name or other resource uri.
        /// </summary>
        public string Uri { get; private set; }

        public ContentRef(ContentType contentType, string uri)
        {
            this.ContentType = contentType;
            this.Uri = uri;
        }
    }
}
