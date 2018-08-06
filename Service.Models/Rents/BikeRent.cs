using System;
using System.ComponentModel.DataAnnotations;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.Service.Models.Helpers;
using Toptal.BikeRentals.Service.Models.Users;

namespace Toptal.BikeRentals.Service.Models.Rents
{
    public sealed class BikeRent : BikeRentListItem, IEditableObject
    {
        [Required]
        public DateTime? Created { get; set; }

        [Required]
        public UserRef CreatedBy { get; set; }

        public BikeRent()
            : this(null)
        {
        }

        public BikeRent(BusinessEntities.Rents.BikeRent item)
            : base(item)
        {
            if (item != null)
            {
                this.Created = item.CreatedUtc;
                this.CreatedBy = new UserRef(item.CreatedBy);
            }
        }

        public void Validate(Action<IDataObject> validate)
        {
            validate(this);
            validate(PickUpLocation);
            validate(ReturnLocation);
        }
    }
}