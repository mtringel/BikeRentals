using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Master;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.BusinessLogic.Helpers;
using System.Collections.Generic;

namespace Toptal.BikeRentals.BusinessLogic.Master
{
    /// <summary>
    /// Lifetime: n/a (transient or current request, undetermined, don't rely on internal state)
    /// </summary>
    public sealed class ColorManager : BusinessLogicManagerBase
    {
        #region Services

        private ColorDataProvider ColorDataProvider;

        #endregion

        public ColorManager(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            ColorDataProvider colorDataProvider
            )
            : base(callContext, appConfig)
        {
            this.ColorDataProvider = colorDataProvider;
        }

        public void Add(Color color)
        {
            this.ColorDataProvider.Add(color);
        }

        public IEnumerable<Color> GetList()
        {
            return this.ColorDataProvider.GetList();
        }    
    }
}