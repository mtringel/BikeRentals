using System;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessEntities.Master;

namespace Toptal.BikeRentals.BusinessEntities.Bikes
{
    public sealed class BikeListFilter : Filter
    {
        public string[] Colors { get; set; }

        public int[] BikeModels { get; set; }

        public Interval<float?> WeightLbs { get; set; }

        // TODO: Map
        //public string LocationName { get; set; }

        //public Location? CurrentLocation { get; set; }

        public float? MaxDistanceMiles { get; set; }

        public Interval<float?> RateAverage { get; set; }

        /// <summary>
        /// Dates only.
        /// We don't plan for hours. A bike is either available now (brought back at 10am and now it's 1pm) or has a planned end date, which can be exceeded.
        /// If a bike is _planned_ to be brought back at 3rd, it's only available for rent from 4th.
        /// </summary>
        public Interval<DateTime?> Availability { get; set; }

        // Filtered by Availability = Today
        //public bool? CurrentlyAvailable { get; set; }

        public int? BikeId { get; set; }

        /// <summary>
        /// CurrentLocation is not included, that is used for MaxDistanceMiles
        /// </summary>
        public override bool IsEmpty =>
            !BikeId.HasValue &&
            !MaxDistanceMiles.HasValue &&
            RateAverage.IsEmpty &&
            WeightLbs.IsEmpty &&
            Availability.IsEmpty &&
            (Colors == null || Colors.Length == 0) &&
            (BikeModels == null || BikeModels.Length == 0);
    }
}