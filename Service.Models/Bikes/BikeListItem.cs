using System;
using System.ComponentModel.DataAnnotations;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.BusinessEntities.Master;

namespace Toptal.BikeRentals.Service.Models.Bikes
{
    public class BikeListItem : BikeRef
    {
        [Required]
        public BikeState? BikeState { get; set; }

        [Required]
        public new BikeModel BikeModel { get { return (BikeModel)base.BikeModel; } set { base.BikeModel = value; } }

        [Required]
        public Location CurrentLocation { get; set; }

        [Required]
        [StringLength(100)]
        public string CurrentLocationName { get; set; }
        
        public DateTime? AvailableFromUtc { get; set; }

        public double? DistanceMiles { get; private set; }

        public float? RateAverage { get; set; }

        public BikeListItem(BusinessEntities.Bikes.Bike bike, Location? currentLocation)
            : base(bike)
        {
            if (bike != null)
            {
                this.BikeModel = new BikeModel(bike.BikeModel);
                this.BikeState = bike.BikeState;
                this.CurrentLocation = bike.CurrentLocation;
                this.AvailableFromUtc = bike.AvailableFromUtc;
                this.RateAverage = bike.RateAverage;
                this.CurrentLocationName = bike.CurrentLocationName;

                if (currentLocation.HasValue)
                    this.DistanceMiles = Location.DistanceMiles(bike.CurrentLocation, currentLocation.Value);
            }
        }
    }
}