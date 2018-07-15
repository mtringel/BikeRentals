using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toptal.BikeRentals.BusinessEntities.Helpers;

namespace Toptal.BikeRentals.BusinessEntities.Bikes
{
    public sealed class BikePhoto : Entity
    {
        [Required]
        [Key]
        public int BikeId { get; set; }

        [ForeignKey("BikeId")]
        [Required]
        public Bike Bike { get; set; }

        [Required]
        public byte[] Image { get; set; }

        public BikePhoto()
        {
        }

        public BikePhoto(int bikeId)
        {
            this.BikeId = bikeId;
        }

        public override object[] Keys()
        {
            return new object[] { BikeId };
        }
    }
}