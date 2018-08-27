using Toptal.BikeRentals.BusinessEntities.Helpers;

namespace Toptal.BikeRentals.BusinessEntities.Contents
{
   
    public sealed class Content<T> : IContent
    {
        public ContentRef ContentRef { get; private set; }

        public T Data { get; private set; }

        object IContent.Data { get { return this.Data; } }

        public string HttpContentType { get; private set; }

        public Content(ContentRef cref, string httpContentType, T data)
        {
            this.ContentRef = cref;
            this.HttpContentType = httpContentType;
            this.Data = data;
        }
    }
}
