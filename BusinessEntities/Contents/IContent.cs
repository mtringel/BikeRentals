using Toptal.BikeRentals.BusinessEntities.Helpers;

namespace Toptal.BikeRentals.BusinessEntities.Contents
{
    public interface IContent
    {
        ContentRef ContentRef { get; }

        object Data { get; }

        string HttpContentType { get; }
    }
}
