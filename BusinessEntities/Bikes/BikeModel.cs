using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toptal.BikeRentals.BusinessEntities.Helpers;

namespace Toptal.BikeRentals.BusinessEntities.Bikes
{
    public sealed class BikeModel : Entity
    {
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BikeModelId { get; set; }

        [Required]
        [StringLength(50)]
        public string BikeModelName { get; set; }

        [Required]
        public float WeightLbs { get; set; }

        public override object[] Keys()
        {
            return new object[] { BikeModelId };
        }
    }
}