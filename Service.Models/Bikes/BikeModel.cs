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
            if (model != null)
            {
                this.WeightLbs = model.WeightLbs;
            }
        }

        /// <summary>
        /// Returns partial entity.
        /// </summary>
        public BusinessEntities.Bikes.BikeModel ToEntityPartial()
        {
            return new BusinessEntities.Bikes.BikeModel(BikeModelId, BikeModelName, WeightLbs, true);
        }
    }
}