using System;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessEntities.Master;

namespace Toptal.BikeRentals.BusinessEntities.Bikes
{
    public sealed class BikeListFilter : Filter
    {
        /// <summary>
        /// When filtering for Available, only bikes available on Availability (or current day) will be listed. This is the only accessible option by users.
        /// When filtering for any other states, all bikes are listed.
        /// </summary>
        public BikeState? State { get; set; }

        public string[] Colors { get; set; }

        public int[] BikeModels { get; set; }

        public Interval<float?> WeightLbs { get; set; }

        // TODO: Map
        //public string LocationName { get; set; }

        //public Location? CurrentLocation { get; set; }

        public float? MaxDistanceMiles { get; set; }

        public Interval<float?> RateAverage { get; set; }

        /// <summary>
        /// Filters only is State is set to Available.
        /// Dates only.
        /// We don't plan for hours. A bike is either available now (brought back at 10am and now it's 1pm) or has a planned end date, which can be exceeded.
        /// If a bike is _planned_ to be brought back at 3rd, it's only available for rent from 4th.
        /// </summary>
        public Interval<DateTime?> AvailableWhen { get; set; }

        // Filtered by Availability = Today
        //public bool? CurrentlyAvailable { get; set; }

        public int? BikeId { get; set; }

        /// <summary>
        /// CurrentLocation is not included, that is used for MaxDistanceMiles
        /// </summary>
        public override bool IsEmpty =>
            !State.HasValue &&
            !BikeId.HasValue &&
            !MaxDistanceMiles.HasValue &&
            RateAverage.IsEmpty &&
            WeightLbs.IsEmpty &&
            AvailableWhen.IsEmpty &&
            (Colors == null || Colors.Length == 0) &&
            (BikeModels == null || BikeModels.Length == 0);
    }
}