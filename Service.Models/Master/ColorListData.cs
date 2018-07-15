using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.Service.Models.Helpers;

namespace Toptal.BikeRentals.Service.Models.Master
{
    public sealed class ColorListData : Model
    {
        public Color[] List { get; set; }
    }
}