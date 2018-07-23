using Toptal.BikeRentals.Service.Models.Helpers;

namespace Toptal.BikeRentals.Service.Models.Rents
{
    public sealed class BikeRentFormData : Model
    {
        public BikeRent[] BikeRent { get; set; }
    }
}