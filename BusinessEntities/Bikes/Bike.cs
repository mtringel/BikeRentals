using System;
using System.ComponentModel.DataAnnotations;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.BusinessEntities.Users;

namespace Toptal.BikeRentals.BusinessEntities.Bikes
{
    public sealed class Bike : BikeListItem
    {
        [Required]
        public DateTime Created { get; set; }

        [Required]
        public User CreatedBy { get; set; }

        public Bike()
        {
            Created = DateTime.Now;
        }

        public Bike(
            int bikeId,
            BikeState bikeState,
            BikeModel bikeModel,
            Color color,
            Location currentLocation,
            string currentLocationName,
            DateTime availableFrom,
            bool currentlyAvailable,
            float rateAverage,
            DateTime created,
            User createdBy
            )
            : base(bikeId, bikeState, bikeModel, color, currentLocation, currentLocationName, availableFrom, currentlyAvailable, rateAverage)
        {
            this.Created = created;
            this.CreatedBy = createdBy;
        }
    }
}