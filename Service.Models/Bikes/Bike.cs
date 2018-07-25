using System;
using System.ComponentModel.DataAnnotations;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.Service.Models.Users;

namespace Toptal.BikeRentals.Service.Models.Bikes
{
    public sealed class Bike : BikeListItem
    {
        [Required]
        public DateTime Created { get; set; }

        [Required]
        public UserRef CreatedBy { get; set; }

        public Bike(BusinessEntities.Bikes.Bike bike, Location? currentLocation)
            : base(bike, currentLocation)
        {
            this.Created = bike.CreatedUtc;
            this.CreatedBy = new UserRef(bike.CreatedBy);
        }
    }
}