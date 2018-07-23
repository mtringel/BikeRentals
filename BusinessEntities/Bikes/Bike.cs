using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.BusinessEntities.Rents;
using Toptal.BikeRentals.BusinessEntities.Users;

namespace Toptal.BikeRentals.BusinessEntities.Bikes
{
    public sealed class Bike : Entity
    {
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BikeId { get; set; }

        [Required]
        public BikeState BikeState { get; set; }

        /// <summary>
        /// Fetched automatically
        /// </summary>
        [Required]
        [ForeignKey("BikeModelId")]
        public BikeModel BikeModel { get; set; }

        /// <summary>
        /// Fetched automatically
        /// </summary>
        [Required]
        public Color Color { get; set; }

        [Required]
        [NotMapped]
        public Location CurrentLocation { get; set; }

        [Required]
        [StringLength(100)]
        public string CurrentLocationName { get; set; }

        [Required]
        public double CurrentLocationLat
        {
            get { return CurrentLocation.Lat; }
            set { CurrentLocation = new Location(value, CurrentLocationLng); }
        }

        [Required]
        public double CurrentLocationLng
        {
            get { return CurrentLocation.Lng; }
            set { CurrentLocation = new Location(CurrentLocationLat, value); }
        }

        [Required]
        public bool CurrentlyAvailable { get; set; }

        /// <summary>
        /// Can be available and this is a past date.
        /// Can be unavailable and this is a forecasted future date.
        /// </summary>
        [Required]
        public DateTime AvailableFrom { get; set; }

        [Required]
        public float RateAverage { get; set; }

        [Required]
        public DateTime Created { get; set; }

        [Required]
        public User CreatedBy { get; set; }

        [Required]
        public bool IsActive { get; set; }

        /// <summary>
        /// Not fetched automatically
        /// </summary>
        public ICollection<BikeRent> Rents { get; set; }

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
        {
            this.BikeId = bikeId;
            this.BikeState = bikeState;
            this.BikeModel = bikeModel;
            this.Color = color;
            this.CurrentLocation = currentLocation;
            this.AvailableFrom = availableFrom;
            this.RateAverage = rateAverage;
            this.CurrentlyAvailable = currentlyAvailable;
            this.CurrentLocationName = currentLocationName;
            this.Created = created;
            this.CreatedBy = createdBy;
            this.IsActive = true;
        }

        public override object[] Keys()
        {
            return new object[] { BikeId };
        }
    }
}