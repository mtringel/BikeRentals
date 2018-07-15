using System;
using System.Collections.Generic;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.DataAccess.Helpers;

namespace Toptal.BikeRentals.DataAccess.Bikes
{
    /// <summary>
    /// Lifetime: Transient
    /// </summary>
    public sealed  class BikeModelDataProvider : DataProviderBase
    {
        public BikeModelDataProvider(ICallContext callContext, AppDbContext appDbContext)
            : base(callContext, appDbContext)
        {
        }

        /// <summary>
        /// Returns entities for listing purposes.
        /// </summary>
        public IEnumerable<BikeModel> GetList()
        {
            return AppDbContext.BikeModels;
        }

        public void Add(BikeModel model)
        {
            AppDbContext.BikeModels.Add(model);
            AppDbContext.SaveChanges();
        }
    }
}
