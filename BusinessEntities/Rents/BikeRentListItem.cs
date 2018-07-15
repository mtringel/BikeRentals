using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.BusinessEntities.Users;

namespace Toptal.BikeRentals.BusinessEntities.Rents
{
    public class BikeRentListItem : Helpers.Entity
    {
        /// <summary>
        /// Generate it by current time + UserId (something like yyyymmddhhnnid)
        /// </summary>
        [Required]
        [Key]
        [StringLength(10)]
        public string BikeRentId { get; set; }

        public BikeRentState BikeRentState { get; set; }

        /// <summary>
        /// Fetched automatically
        /// </summary>
        public Bike Bike { get; set; }

        /// <summary>
        /// Fetched automatically
        /// </summary>
        public User User { get; set; }

        public DateTime StartDate { get; set; }

        /// <summary>
        /// Until planned (not returned or lost), this is only planned end date.
        /// </summary>
        public DateTime EndDate { get; set; }

        [Required]
        [NotMapped]
        public Location PickUpLocation { get; set; }

        [Required]
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

        [Required]
        [NotMapped]
        public Location ReturnLocation { get; set; }

        [Required]
        public string ReturnLocationName { get; set; }

        [Required]
        [JsonIgnore]
        public double ReturnLocationLat
        {
            get { return ReturnLocation.Lat; }
            set { ReturnLocation = new Location(value, ReturnLocationLng); }
        }

        [Required]
        [JsonIgnore]
        public double ReturnLocationLng
        {
            get { return ReturnLocation.Lng; }
            set { ReturnLocation = new Location(ReturnLocationLat, value); }
        }

        public BikeRentListItem()
        {
            StartDate = DateTime.Now;
        }

        public override object[] Keys()
        {
            return new object[] { BikeRentId };
        }

    }
}