using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.DataAccess.Helpers;

namespace Toptal.BikeRentals.DataAccess.Bikes
{
    /// <summary>
    /// Lifetime: Transient
    /// </summary>
    public sealed class BikeDataProvider : DataProviderBase
    {
        public BikeDataProvider(ICallContext callContext, AppDbContext appDbContext)
            : base(callContext, appDbContext)
        {
        }

        #region Includes 

        private static IQueryable<Bike> Include(IQueryable<Bike> query)
        {
            return query
                .Include(t => t.BikeModel)
                .Include(t => t.Color);
        }

        #endregion

        /// <summary>
        /// Returns entities for listing purposes.
        /// </summary>
        public IEnumerable<Bike> GetList(BikeListFilter filter, PagingInfo paging, Location? currentLocation, out int totalRowCount)
        {
            // non-active entities are only loaded through reference or by Id
            IQueryable<Bike> query = Include(AppDbContext.Bikes).Where(t => t.IsActive);
            totalRowCount = 0;

            if (filter != null && !filter.IsEmpty)
            {
                #region Filtering

                // State
                // When filtering for Available, only bikes available on Availability (or current day) will be listed. This is the only accessible option by users.
                // When filtering for any other states, all bikes are listed.
                if (filter.State.HasValue && (filter.State.Value != BikeState.Available || filter.AvailableUtc.IsEmpty)) query = query.Where(t => t.BikeState == filter.State.Value);

                // Availability
                // Date + time.
                // We don't plan for hours. A bike is either available now (brought back at 10am and now it's 1pm) or has a planned end date, which can be exceeded.
                // If a bike is _planned_ to be brought back at 3rd, it's only available for rent from 4th.
                if (filter.State.HasValue && filter.State.Value == BikeState.Available && (filter.AvailableUtc.From.HasValue || filter.AvailableUtc.To.HasValue))
                {
                    var from = filter.AvailableUtc.From ?? filter.AvailableUtc.To.Value;
                    var to = filter.AvailableUtc.To ?? filter.AvailableUtc.From.Value;

                    query = query.Where(t =>
                        t.AvailableFromUtc <= from &&
                        !t.Rents.Any(t2 => t2.StartDateUtc < to && t2.EndDateUtc > from)
                        );
                }

                // Colors
                if (filter.Colors != null && filter.Colors.Any())
                {
                    // LINQ will generate proper SQL like this 
                    var ids = filter.Colors.ToArray(); 
                    query = query.Where(t => ids.Contains(t.Color.ColorId));
                }

                // Models
                if (filter.BikeModels != null && filter.BikeModels.Any())
                {
                    // LINQ will generate proper SQL like this 
                    var ids = filter.BikeModels.ToArray();
                    query = query.Where(t => ids.Contains(t.BikeModel.BikeModelId));
                }

                // RateAverage
                if (filter.RateAverage.From.HasValue) query = query.Where(t => t.RateAverage >= filter.RateAverage.From.Value);
                if (filter.RateAverage.To.HasValue) query = query.Where(t => t.RateAverage <= filter.RateAverage.To.Value);

                // WeightLbs
                if (filter.WeightLbs.From.HasValue) query = query.Where(t => t.BikeModel.WeightLbs >= filter.WeightLbs.From.Value);
                if (filter.WeightLbs.To.HasValue) query = query.Where(t => t.BikeModel.WeightLbs <= filter.WeightLbs.To.Value);

                // MaxDistanceFromCurrentLocationInMiles
                if (filter.MaxDistanceMiles.HasValue && currentLocation.HasValue)
                {
                    // use SQL function to filter on SQL Server
                    var lat = currentLocation.Value.Lat;
                    var lng = currentLocation.Value.Lng;

                    query = query.Where(t => filter.MaxDistanceMiles >= AppDbContext.ServerFunctions.GeoDistanceMiles(t.CurrentLocationLat, t.CurrentLocationLng, lat, lng));
                }

                // BikeId
                if (filter.BikeId.HasValue) query = query.Where(t => t.BikeId == filter.BikeId);

                #endregion
            }

            // count before paging applied
            if (paging.ReturnTotalRowCount)
                totalRowCount = query.Count();

            if (paging != null && !paging.IsEmpty)
            {
                #region Paging

                // order
                if (paging.OrderBy != null && paging.OrderBy.Length > 0)
                {
                    if (paging.OrderBy.Any(t => string.Compare(t, "DistanceMiles", true) == 0) && currentLocation.HasValue)
                    {
                        // use SQL function to filter on SQL Server
                        var lat = (float)currentLocation.Value.Lat;
                        var lng = (float)currentLocation.Value.Lng;
                        var dir = paging.OrderByDescending ? -1 : 1;

                        query = query.OrderBy(t => dir * AppDbContext.ServerFunctions.GeoDistanceMiles(t.CurrentLocationLat, t.CurrentLocationLng, lat, lng));
                    }

                    var otherFields = paging.OrderBy.Where(t => string.Compare(t, "DistanceMiles", true) != 0);

                    if (otherFields.Any())
                        // use LINQ dynamic
                        query = query.OrderBy(string.Format("{0} {1}", string.Join(",", FormatFieldNames(otherFields)), paging.OrderByDescending ? "DESC" : "ASC"));
                }

                // paging
                if (paging.FirstRow.GetValueOrDefault(0) > 0)
                    query = query.Skip(paging.FirstRow.Value);

                if (paging.RowCount.GetValueOrDefault(int.MaxValue) < int.MaxValue)
                    query = query.Take(paging.RowCount.Value);

                #endregion
            }

            return query;
        }

        public Bike GetById(int bikeId, bool? isActive)
        {
            var result = Include(AppDbContext.Bikes).SingleOrDefault(t => t.BikeId == bikeId);
            return !isActive.HasValue || result.IsActive == isActive.Value ? result : null;
        }

        public void Add(Bike bike)
        {
            AppDbContext.Entry(bike).State = EntityState.Added;
            AppDbContext.Bikes.Add(bike);
            AppDbContext.SaveChanges();
        }

        public void Delete(int bikeId)
        {            
            AppDbContext.Bikes.Remove(AppDbContext.Bikes.Find(bikeId));
            AppDbContext.SaveChanges();
        }

        public void Update(Bike bike)
        {
            AppDbContext.Entry(bike).State = EntityState.Modified;
            AppDbContext.Bikes.Update(bike);
            AppDbContext.SaveChanges();
        }
    }
}

