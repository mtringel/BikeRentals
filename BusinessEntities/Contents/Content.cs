using Toptal.BikeRentals.BusinessEntities.Helpers;

namespace Toptal.BikeRentals.BusinessEntities.Contents
{
    public sealed class Content : Entity
    {
        public ContentType ContentType { get; set; }

        /// <summary>
        /// Image file name or other resource uri.
        /// </summary>
        public string Uri { get; set; }

        public byte[] Bytes { get; set; }

        public string HttpContentType { get; set; }

        public Content(ContentType contentType, string uri, string httpContentType, byte[] bytes)
        {
            this.ContentType = contentType;
            this.Uri = uri;
            this.HttpContentType = httpContentType;
            this.Bytes = bytes;
        }

        public override object[] Keys()
        {
            return new object[] { ContentType, Uri };
        }
    }
}
