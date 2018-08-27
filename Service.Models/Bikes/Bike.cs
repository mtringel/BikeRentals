using System;
using System.ComponentModel.DataAnnotations;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.Service.Models.Users;

namespace Toptal.BikeRentals.Service.Models.Bikes
{
    public sealed class Bike : BikeListItem, IEditableObject
    {
        public string ImageToUploadContentBase64 { get; set; }

        public string ImageToUploadFileName { get; set; }

        [Required]
        public DateTime? Created { get; set; }

        [Required]
        public UserRef CreatedBy { get; set; }

        public Bike()
            : this(null)
        {
        }

        public Bike(Location? currentLocation)
            : base(new BusinessEntities.Bikes.Bike(), currentLocation)
        {
        }

        public Bike(BusinessEntities.Bikes.Bike bike, Location? currentLocation)
            : base(bike, currentLocation)
        {
            if (bike != null)
            {
                this.Created = bike.CreatedUtc;
                this.CreatedBy = new UserRef(bike.CreatedBy);
            }
        }

        /// <summary>
        /// Model must be validated!
        /// </summary>
        public BusinessEntities.Bikes.Bike ToEntity()
        {
            return new BusinessEntities.Bikes.Bike(
                BikeId.GetValueOrDefault(),
                BikeState.Value,
                BikeModel.ToEntityPartial(),
                Color,
                CurrentLocation,
                CurrentLocationName,
                AvailableFromUtc.GetValueOrDefault(),
                RateAverage.GetValueOrDefault(),
                Created.Value,
                CreatedBy.ToEntityPartial(),
                null,
                ImageSeq,
                true
                );
        }

        public void Validate(Action<IDataObject> validate)
        {
            validate(this);
            validate(CurrentLocation);
        }
    }
}