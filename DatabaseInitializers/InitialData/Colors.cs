using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess;
using Toptal.BikeRentals.DataAccess.Master;

namespace Toptal.BikeRentals.DatabaseInitializers.InitialData
{
    public sealed class Colors : Helpers.DatabaseInitializerBase
    {
        internal Colors(
            ICallContext callContext,
            AppDbContext appDbContext,
            AppConfig appConfig,
            ColorDataProvider colorDataProvider
            ) : base(callContext, appDbContext, appConfig)
        {
            this.ColorDataProvider = colorDataProvider;
        }

        private ColorDataProvider ColorDataProvider;

        public override void AfterDatabaseInitialized()
        {
            base.AfterDatabaseInitialized();

            this.ColorDataProvider.Add(new Color() { ColorId = "000000", ColorName = "Black" });
            this.ColorDataProvider.Add(new Color() { ColorId = "FF0000", ColorName = "Red" });
            this.ColorDataProvider.Add(new Color() { ColorId = "00FF00", ColorName = "Green" });
            this.ColorDataProvider.Add(new Color() { ColorId = "0000FF", ColorName = "Blue" });
            this.ColorDataProvider.Add(new Color() { ColorId = "FFFFFF", ColorName = "White" });
        }
    }
}