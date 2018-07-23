using System;
using System.ComponentModel.DataAnnotations;
using Toptal.BikeRentals.Service.Models.Users;

namespace Toptal.BikeRentals.Service.Models.Rents
{
    public sealed class BikeRent : BikeRentListItem 
    {
        [Required]
        public DateTime Created { get; set; }

        [Required]
        public UserRef CreatedBy { get; set; }

        public BikeRent(BusinessEntities.Rents.BikeRent item)
            : base(item)
        {
            this.Created = item.Created;
            this.CreatedBy = new UserRef(item.CreatedBy);
        }
    }
}