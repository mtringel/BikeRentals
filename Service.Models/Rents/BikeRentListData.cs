using Toptal.BikeRentals.Service.Models.Helpers;

namespace Toptal.BikeRentals.Service.Models.Rents
{
    public sealed class BikeRentListData : Model
    {
        public BikeRentListItem[] List { get; set; }

        public int TotalRowCount { get; set; }
    }
}