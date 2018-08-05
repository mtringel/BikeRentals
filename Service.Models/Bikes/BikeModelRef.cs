using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toptal.BikeRentals.Service.Models.Helpers;

namespace Toptal.BikeRentals.Service.Models.Bikes
{
    public class BikeModelRef : Model
    {
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BikeModelId { get; set; }

        [Required]
        [StringLength(50)]
        public string BikeModelName { get; set; }

        public BikeModelRef(BusinessEntities.Bikes.BikeModel model)
        {
            if (model != null)
            {
                this.BikeModelId = model.BikeModelId;
                this.BikeModelName = model.BikeModelName;
            }
        }
    }
}