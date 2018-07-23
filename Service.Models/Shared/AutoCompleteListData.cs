using Toptal.BikeRentals.Service.Models.Helpers;

namespace Toptal.BikeRentals.Service.Models.Shared
{
    public sealed class AutoCompleteListData : Model
    {
        public AutoCompleteItem[] List { get; set; }
    }
}
