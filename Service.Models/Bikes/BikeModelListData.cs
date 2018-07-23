using Toptal.BikeRentals.Service.Models.Helpers;

namespace Toptal.BikeRentals.Service.Models.Bikes
{
    public sealed class BikeModelListData : Model
    {
        public BikeModel[] List { get; set; }
    }
}