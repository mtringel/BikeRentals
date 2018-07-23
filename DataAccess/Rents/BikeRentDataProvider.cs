using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using Toptal.BikeRentals.BusinessEntities.Rents;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.DataAccess.Helpers;

namespace Toptal.BikeRentals.DataAccess.Rents
{
    /// <summary>
    /// Lifetime: Transient
    /// </summary>
    public sealed class BikeRentDataProvider : DataProviderBase
    {
        public BikeRentDataProvider(ICallContext callContext, AppDbContext appDbContext)
            : base(callContext, appDbContext)
        {
        }

        #region Includes 

        private static IQueryable<BikeRent> Include(IQueryable<BikeRent> query)
        {
            return query
                .Include(t => t.Bike)
                .Include(t => t.User);
        }

        #endregion

        /// <summary>
        /// Returns entities for listing purposes.
        /// </summary>
        public IEnumerable<BikeRent> GetList(BikeRentListFilter filter, PagingInfo paging, out int totalRowCount)
        {
            IQueryable<BikeRent> query = Include(AppDbContext.BikeRents);
            totalRowCount = 0;

            if (filter != null && !filter.IsEmpty)
            {
                #region Filtering

                // State
                if (filter.State.HasValue)
                {
                    query = query.Where(t => t.BikeRentState == filter.State.Value);

                    // Late
                    if (filter.State.Value == BikeRentState.Reserved && filter.Late.HasValue)
                    {
                        var now = DateTime.Now;

                        if (filter.Late.Value)
                            query = query.Where(t => t.BikeRentState == BikeRentState.Reserved && t.EndDate <= now);
                        else
                            query = query.Where(t => t.BikeRentState == BikeRentState.Reserved && t.EndDate > now);
                    }
                }

                // Colors
                if (filter.Colors != null && filter.Colors.Any())
                {
                    // LINQ will generate proper SQL like this 
                    var ids = filter.Colors.ToArray(); 
                    query = query.Where(t => ids.Contains(t.Bike.Color.ColorId));
                }

                // Models
                if (filter.BikeModels != null && filter.BikeModels.Any())
                {
                    var ids = filter.BikeModels.ToArray();
                    query = query.Where(t => ids.Contains(t.Bike.BikeModel.BikeModelId));
                }

                // BikeId
                if (filter.BikeId.HasValue) query = query.Where(t => t.Bike.BikeId == filter.BikeId.Value);

                // StartDate
                if (filter.StartDate.From.HasValue) query = query.Where(t => t.StartDate >= filter.StartDate.From.Value);
                if (filter.StartDate.To.HasValue) query = query.Where(t => t.StartDate <= filter.StartDate.To.Value);

                // EndDate
                if (filter.EndDate.From.HasValue) query = query.Where(t => t.EndDate >= filter.EndDate.From.Value);
                if (filter.EndDate.To.HasValue) query = query.Where(t => t.EndDate <= filter.EndDate.To.Value);

                // Users
                if (filter.Users != null && filter.Users.Any())
                {
                    var ids = filter.Users.ToArray();
                    query = query.Where(t => ids.Contains(t.User.UserId));
                }

                // BikeRentId
                if (!string.IsNullOrEmpty(filter.BikeRentId)) query = query.Where(t => t.BikeRentId == filter.BikeRentId);

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
                    // use LINQ dynamic
                    query = query.OrderBy(string.Format("{0} {1}", string.Join(",", FormatFieldNames(paging.OrderBy)), paging.OrderByDescending ? "DESC" : "ASC"));
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

        public BikeRent GetById(string bikeRentId)
        {
            return Include(AppDbContext.BikeRents).SingleOrDefault(t => t.BikeRentId == bikeRentId);
        }

        public void Add(BikeRent rent)
        {
            AppDbContext.Entry(rent).State = EntityState.Added;
            AppDbContext.BikeRents.Add(rent);
            AppDbContext.SaveChanges();
        }

        public void Delete(string bikeRentId)
        {            
            AppDbContext.BikeRents.Remove(AppDbContext.BikeRents.Find(bikeRentId));
            AppDbContext.SaveChanges();
        }

        public void Update(BikeRent rent)
        {
            AppDbContext.Entry(rent).State = EntityState.Modified;
            AppDbContext.BikeRents.Update(rent);
            AppDbContext.SaveChanges();
        }
    }
}
