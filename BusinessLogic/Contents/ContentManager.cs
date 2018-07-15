using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Toptal.BikeRentals.BusinessEntities.Contents;
using Toptal.BikeRentals.BusinessLogic.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;

namespace Toptal.BikeRentals.BusinessLogic.Contents
{
    public sealed class ContentManager : BusinessLogicManagerBase
    {
        public ContentManager(ICallContext callContext, AppConfig appConfig) : base(callContext, appConfig)
        {
        }

        public async Task<Content> GetContent(ContentRef cref)
        {
            var bytes = await File.ReadAllBytesAsync(Path.Combine(
                AppConfig.WebApplication.ContentBaseFilePath, 
                cref.ContentType.ToString(), 
                cref.Uri
                ));

            return new Content(
                cref.ContentType, 
                cref.Uri, 
                $"image/{Path.GetExtension(cref.Uri).Replace(".", "")}", 
                bytes);
        }
    }
}
