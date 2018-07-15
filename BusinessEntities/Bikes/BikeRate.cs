using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.BusinessEntities.Users;

namespace Toptal.BikeRentals.BusinessEntities.Bikes
{
    public sealed class BikeRate : Helpers.Entity
    {
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BikeRateId { get; set; }

        [Required]
        public Bike Bike { get; set; }

        [Required]
        public User User { get; set; }

        [Required]
        public DateTime Created { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rate { get; set; }

        public override object[] Keys()
        {
            return new object[] { BikeRateId };
        }
    }
}
