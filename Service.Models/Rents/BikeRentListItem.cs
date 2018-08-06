using System;
using System.ComponentModel.DataAnnotations;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.BusinessEntities.Rents;
using Toptal.BikeRentals.Service.Models.Bikes;
using Toptal.BikeRentals.Service.Models.Helpers;
using Toptal.BikeRentals.Service.Models.Users;

namespace Toptal.BikeRentals.Service.Models.Rents
{
    public class BikeRentListItem : Model
    {   
        /// <summary>
        /// Generate it by current time + UserId (something like yyyymmddhhnnid)
        /// </summary>
        [Key]
        [StringLength(10)]
        public string BikeRentId { get; set; }

        [Required]
        public BikeRentState? BikeRentState { get; set; }

        [Required]
        public BikeRef Bike { get; set; }

        [Required]
        public UserRef User { get; set; }

        [Required]
        public DateTime? StartDateUtc { get; set; }

        /// <summary>
        /// Until planned (not returned or lost), this is only planned end date.
        /// </summary>
        [Required]
        public DateTime? EndDateUtc { get; set; }

        [Required]
        public Location? PickUpLocation { get; set; }

        [Required]
        [StringLength(100)]
        public string PickUpLocationName { get; set; }

        [Required]
        public Location? ReturnLocation { get; set; }

        [Required]
        [StringLength(100)]
        public string ReturnLocationName { get; set; }

        public BikeRentListItem(BusinessEntities.Rents.BikeRent item)
        {
            if (item != null)
            {
                this.BikeRentId = item.BikeRentId;
                this.BikeRentState = item.BikeRentState;
                this.Bike = new BikeRef(item.Bike);
                this.User = new UserRef(item.User);
                this.StartDateUtc = item.StartDateUtc;
                this.EndDateUtc = item.EndDateUtc;
                this.PickUpLocation = item.PickUpLocation;
                this.PickUpLocationName = item.PickUpLocationName;
                this.ReturnLocation = item.ReturnLocation;
                this.ReturnLocationName = item.ReturnLocationName;
            }
        }
    }
}