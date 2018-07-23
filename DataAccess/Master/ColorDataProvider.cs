using System;
using System.Collections.Generic;
using System.Linq;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.DataAccess.Helpers;

namespace Toptal.BikeRentals.DataAccess.Master
{
    /// <summary>
    /// Lifetime: Transient
    /// </summary>
    public sealed  class ColorDataProvider : DataProviderBase
    {
        public ColorDataProvider(ICallContext callContext, AppDbContext appDbContext)
            : base(callContext, appDbContext)
        {
        }

        /// <summary>
        /// Returns entities for listing purposes.
        /// </summary>
        public IEnumerable<Color> GetList()
        {
            // non-active entities are only loaded through reference or by Id
            return AppDbContext.Colors.Where(t => t.IsActive);
        }

        public void Add(Color color)
        {
            AppDbContext.Colors.Add(color);
        }
    }
}
