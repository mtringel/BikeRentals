using Toptal.BikeRentals.BusinessEntities.Helpers;

namespace Toptal.BikeRentals.BusinessEntities.Contents
{
    public sealed class ContentRef : Entity
    {
        public ContentType ContentType { get; set; }

        /// <summary>
        /// Image file name or other resource uri.
        /// </summary>
        public string Uri { get; set; }

        public ContentRef(ContentType contentType, string uri)
        {
            this.ContentType = contentType;
            this.Uri = uri;
        }

        public override object[] Keys()
        {
            return new object[] { ContentType, Uri };
        }
    }
}
