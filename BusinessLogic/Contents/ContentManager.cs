using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;
using System;
using System.IO;
using System.Threading.Tasks;
using Toptal.BikeRentals.BusinessEntities.Contents;
using Toptal.BikeRentals.BusinessLogic.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.Exceptions.Validation;

namespace Toptal.BikeRentals.BusinessLogic.Contents
{
    public sealed class ContentManager : BusinessLogicManagerBase
    {
        public ContentManager(ICallContext callContext, AppConfig appConfig) : base(callContext, appConfig)
        {
        }

        private string GetFullPath(ContentRef cref)
        {
            return Path.Combine(
                AppConfig.WebApplication.ContentBaseFilePath, 
                cref.ContentType.ToString(), 
                $"{Path.GetFileNameWithoutExtension(cref.Uri)}.{GetFormat(cref).FileFormat}"
                );
        }

        private string GetThumbFileName(ContentRef cref)
        {
            return string.Format("{0}_thumb.{1}",
                Path.GetFileNameWithoutExtension(cref.Uri),
                GetFormat(cref).FileFormat
                );
        }

        public string GetHtmlContentType(ContentRef cref)
        {
            switch (cref.ContentType.Format()) {
                case ContentFormat.ImageRgba32:
                    return "image/" + GetFormat(cref);

                default:
                    throw new NotSupportedException($"Not supported format: {cref.ContentType.Format()}");
            }
        }

        public struct GetFormatResult {
            public ContentFileFormat? FileFormat;
            public string Text;
        }

        public GetFormatResult GetFormat(ContentRef cref) {
            switch (cref.ContentType.Format())
            {
                case ContentFormat.ImageRgba32:
                    var ext = Path.GetExtension(cref.Uri);

                    if (ext.StartsWith("."))
                        ext = ext.Substring(1);

                    if (string.Compare(ext, "jpg", true) == 0 || string.Compare(ext, "jpeg", true) == 0)
                        return new GetFormatResult() { FileFormat = ContentFileFormat.jpg, Text = ext };
                    else if (string.Compare(ext, "png", true) == 0)
                        return new GetFormatResult() { FileFormat = ContentFileFormat.png, Text = ext };

                    return new GetFormatResult() { FileFormat = null, Text = ext };

                default:
                    throw new NotSupportedException($"Not supported format: {cref.ContentType.Format()}");
            }
        }
    
        public async Task<IContent> GetContent(ContentRef cref, bool mustExist)
        {
            var fileName = GetFullPath(cref);

            if (mustExist || File.Exists(fileName))
            {
                var bytes = await File.ReadAllBytesAsync(fileName);

                switch (cref.ContentType.Format())
                {
                    case ContentFormat.ImageRgba32:
                        return new Content<Image<Rgba32>>(cref, GetHtmlContentType(cref), Image.Load(bytes));

                    default:
                        throw new NotSupportedException($"Not supported format: {cref.ContentType.Format()}");
                }
            }

            return null;
        }

        public void SaveContent(IContent content, bool generateThumb)
        {
            ValidateContent(content);

            switch (content.ContentRef.ContentType.Format())
            {
                case ContentFormat.ImageRgba32:
                    {
                        var image = (Image<Rgba32>)(object)content.Data;
                        image.Save(GetFullPath(content.ContentRef));

                        var thumbType = content.ContentRef.ContentType.ThumbnailType();

                        if (thumbType.HasValue) {
                            // generate thumbnail
                            image.Mutate(t => t.Resize(new Size(AppConfig.Content.ThumbnailMaxWidth, AppConfig.Content.ThumbnailMaxHeight)));
                            image.Save(GetFullPath(new ContentRef(thumbType.Value, GetThumbFileName(content.ContentRef))));
                        }

                        break;
                    }

                default:
                    throw new NotSupportedException($"Not supported format: {content.ContentRef.ContentType.Format()}");
            }
        }

        public void ValidateContent(IContent content)
        {
            if (string.IsNullOrEmpty(content.ContentRef.Uri) || content.ContentRef.Uri.Length > 255)
                throw new ValidationException($"File name is empty or too long. Must be less than 256 characters. ({content.ContentRef.Uri})", true);

            switch (content.ContentRef.ContentType.Format())
            {
                case ContentFormat.ImageRgba32:
                    var format = GetFormat(content.ContentRef);

                    if (!format.FileFormat.HasValue)
                        throw new ValidationException($"Invalid format: {format.Text}. Allowed formats: jpg, jpeg, png.", true);

                    var image = (Image<Rgba32>)(object)content.Data;

                    if (image.Width > AppConfig.Content.ImageMaxWidth || image.Height > AppConfig.Content.ImageMaxHeight)
                        throw new ValidationException($"Image is too large: {image.Width} x {image.Height}. Max image size: {AppConfig.Content.ImageMaxWidth } x {AppConfig.Content.ImageMaxHeight}", true);
                    break;

                default:
                    throw new NotSupportedException($"Not supported format: {content.ContentRef.ContentType.Format()}");
            }
        }

        public byte[] DecodeBase64(string base64) {
            var i = base64.IndexOf(";");

            if (i >= 0)
                base64 = base64.Substring(i + 1);

            if (base64.StartsWith("base64,"))
                base64 = base64.Substring("base64,".Length);

            return System.Convert.FromBase64String(base64);
        }

        public Image<Rgba32> DecodeBase64Image(string base64) {
            return Image.Load(DecodeBase64(base64));
        }

        public Content<byte[]> Serialize(IContent content)
        {
            if (content == null || content.Data == null)
                return null;

            switch (content.ContentRef.ContentType.Format())
            {
                case ContentFormat.ImageRgba32:
                    using (var stream = new MemoryStream())
                    {
                        var format = GetFormat(content.ContentRef);

                        switch (format.FileFormat)
                        {
                            case ContentFileFormat.jpg:
                                ((Image<Rgba32>)(object)content.Data).SaveAsJpeg(stream);
                                break;

                            case ContentFileFormat.png:
                                ((Image<Rgba32>)(object)content.Data).SaveAsPng(stream);
                                break;

                            default:
                                throw new NotSupportedException($"Not supported file format: {format.Text}");
                        }

                        return new Content<byte[]>(content.ContentRef, content.HttpContentType, stream.ToArray());
                    }

                default:
                    throw new NotSupportedException($"Not supported format: {content.ContentRef.ContentType.Format()}");
            }
        }

        public void DeleteContent(ContentRef cref, bool deleteThumb)
        {
            var fileName = GetFullPath(cref);

            if (File.Exists(fileName))
                File.Delete(fileName);

            if (deleteThumb)
            {
                switch (cref.ContentType)
                {
                    case ContentType.BikeImage:
                        DeleteContent(new ContentRef(ContentType.BikeImageThumb, GetThumbFileName(cref)), false);
                        break;
                }
            }
        }
    }
}