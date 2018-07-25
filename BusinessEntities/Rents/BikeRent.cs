using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.BusinessEntities.Users;

namespace Toptal.BikeRentals.BusinessEntities.Rents
{
    public sealed class BikeRent : Entity
    {
        /// <summary>
        /// Generate it by current time + UserId (something like yyyymmddhhnnid)
        /// </summary>
        [Required]
        [Key]
        [StringLength(10)]
        public string BikeRentId { get; set; }

        [Required]
        public BikeRentState BikeRentState { get; set; }

        /// <summary>
        /// Fetched automatically
        /// </summary>
        [Required]
        public Bike Bike { get; set; }

        /// <summary>
        /// Fetched automatically
        /// </summary>
        [Required]
        public User User { get; set; }

        [Required]
        public DateTime StartDateUtc { get; set; }

        /// <summary>
        /// Until planned (not returned or lost), this is only planned end date.
        /// </summary>
        [Required]
        public DateTime EndDateUtc { get; set; }

        [Required]
        [NotMapped]
        public Location PickUpLocation { get; set; }

        [Required]
        [StringLength(100)]
        public string PickUpLocationName { get; set; }

        [Required]
        [JsonIgnore]
        public double PickUpLocationLat
        {
            get { return PickUpLocation.Lat; }
            set { PickUpLocation = new Location(value, PickUpLocationLng); }
        }

        [Required]
        [JsonIgnore]
        public double PickUpLocationLng
        {
            get { return PickUpLocation.Lng; }
            set { PickUpLocation = new Location(PickUpLocationLat, value); }
        }

        [NotMapped]
        public Location? ReturnLocation { get; set; }

        [StringLength(100)]
        public string ReturnLocationName { get; set; }

        [JsonIgnore]
        public double? ReturnLocationLat
        {
            get { return ReturnLocation?.Lat; }
            set { ReturnLocation = value.HasValue && ReturnLocationLng.HasValue ? new Location(value.Value, ReturnLocationLng.Value) : (Location?)null; }
        }

        [JsonIgnore]
        public double? ReturnLocationLng
        {
            get { return ReturnLocation?.Lng; }
            set { ReturnLocation = value.HasValue && ReturnLocationLat.HasValue ? new Location(ReturnLocationLat.Value, value.Value) : (Location?)null; }
        }

        [Required]
        public DateTime CreatedUtc { get; set; }

        [Required]
        public User CreatedBy { get; set; }

        public BikeRent()
        {
            this.CreatedUtc = DateTime.Now;
        }

        public override object[] Keys()
        {
            return new object[] { this.BikeRentId };
        }
    }
}