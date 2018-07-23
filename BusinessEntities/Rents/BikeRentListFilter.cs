using System;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessEntities.Users;

namespace Toptal.BikeRentals.BusinessEntities.Rents
{
    public sealed class BikeRentListFilter : Filter
    {
        public BikeRentState? State { get; set; }

        public string[] Colors { get; set; }

        public int[] BikeModels { get; set; }

        /// <summary>
        /// Dates only.
        /// We don't plan for hours. A bike is either available now (brought back at 10am and now it's 1pm) or has a planned end date, which can be exceeded.
        /// If a bike is _planned_ to be brought back at 3rd, it's only available for rent from 4th.
        /// </summary>
        public Interval<DateTime?> StartDate { get; set; }

        /// <summary>
        /// Until planned (not returned or lost), this is only planned end date.
        /// </summary>
        public Interval<DateTime?> EndDate { get; set; }

        public string[] Users { get; set; }


        /// <summary>
        /// Not returned until planned End Date. (Maybe lost?)
        /// Only used if State is Reserved.
        /// </summary>
        public bool? Late { get; set; }

        public int? BikeId { get; set; }

        public string BikeRentId { get; set; }

        /// <summary>
        /// CurrentLocation is not included, that is used for MaxDistanceMiles
        /// </summary>
        public override bool IsEmpty =>
            !State.HasValue &&
            StartDate.IsEmpty &&
            EndDate.IsEmpty &&
            string.IsNullOrEmpty(BikeRentId) &&
            !BikeId.HasValue &&
            !Late.HasValue &&
            (Users == null || Users.Length == 0) &&
            (Colors == null || Colors.Length == 0) &&
            (BikeModels == null || BikeModels.Length == 0);
    }
}