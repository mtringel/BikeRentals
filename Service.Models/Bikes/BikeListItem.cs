using System;
using System.ComponentModel.DataAnnotations;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.Service.Models.Helpers;

namespace Toptal.BikeRentals.Service.Models.Bikes
{
    public sealed class BikeListItem : Model
    {
        [Required]
        public int BikeId { get; set; }

        [Required]
        public BikeState BikeState { get; set; }

        [Required]
        public BikeModel BikeModel { get; set; }

        [Required]
        public Color Color { get; set; }

        [Required]
        public Location CurrentLocation { get; set; }

        [Required]
        public string CurrentLocationName { get; set; }

        [Required]
        public bool CurrentlyAvailable { get; set; }

        /// <summary>
        /// Can be available and this is a past date.
        /// Can be unavailable and this is a forecasted future date.
        /// </summary>
        [Required]
        public DateTime AvailableFrom { get; set; }

        public double? DistanceMiles { get; private set; }


        [Required]
        public float RateAverage { get; set; }

        public BikeListItem(BusinessEntities.Bikes.BikeListItem bike, Location? currentLocation)
        {
            this.BikeId = bike.BikeId;
            this.BikeState = bike.BikeState;
            this.BikeModel = bike.BikeModel;
            this.Color = bike.Color;
            this.CurrentLocation = bike.CurrentLocation;
            this.AvailableFrom = bike.AvailableFrom;
            this.RateAverage = bike.RateAverage;
            this.CurrentlyAvailable = bike.CurrentlyAvailable;
            this.CurrentLocationName = bike.CurrentLocationName;

            if (currentLocation.HasValue)
                this.DistanceMiles = Location.DistanceMiles(bike.CurrentLocation, currentLocation.Value);
        }
    }
}