namespace Toptal.BikeRentals.BusinessEntities.Contents
{
    public enum ContentType
    {
        BikeImage,
        BikeImageThumb
    }

    public static class ContentTypeHelper
    {
        /// <summary>
        /// Order is imporant.
        /// </summary>
        public static readonly ContentFormat[] Formats = new[]{
            ContentFormat.ImageRgba32,
            ContentFormat.ImageRgba32
        };

        /// <summary>
        /// Order is imporant.
        /// </summary>
        public static readonly ContentType?[] ThumbnailTypes = new ContentType?[]{
            ContentType.BikeImageThumb,
            null
        };

        public static ContentFormat Format(this ContentType contentType)
        {
            return Formats[(int)contentType];
        }

        public static ContentType? ThumbnailType(this ContentType contentType)
        {
            return ThumbnailTypes[(int)contentType];
        }
    }
}