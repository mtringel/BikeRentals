using Toptal.BikeRentals.Service.Models.Helpers;

namespace Toptal.BikeRentals.Service.Models.Bikes
{
    public sealed class BikeListData : Model
    {
        public Service.Models.Bikes.BikeListItem[] List { get; set; }

        public int TotalRowCount { get; set; }
    }
}