using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.Service.Models.Helpers;

namespace Toptal.BikeRentals.Service.Models.Bikes
{
    public class BikeRef : Model
    {
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BikeId { get; set; }

        /// <summary>
        /// Fetched automatically
        /// </summary>
        [Required]
        [ForeignKey("BikeModelId")]
        public BikeModelRef BikeModel { get; set; }

        /// <summary>
        /// Fetched automatically
        /// </summary>
        [Required]
        public Color Color { get; set; }

        public BikeRef(BusinessEntities.Bikes.Bike bike)
        {
            this.BikeId = bike.BikeId;
            this.BikeModel = new BikeModelRef(bike.BikeModel);
            this.Color = bike.Color;
        }
    }
}