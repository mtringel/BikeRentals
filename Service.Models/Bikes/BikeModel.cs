using System.ComponentModel.DataAnnotations;

namespace Toptal.BikeRentals.Service.Models.Bikes
{
    public sealed class BikeModel : BikeModelRef
    {
        [Required]
        public float WeightLbs { get; set; }

        public BikeModel(BusinessEntities.Bikes.BikeModel model)
            : base(model)
        {
            this.WeightLbs = model.WeightLbs;
        }
    }
}