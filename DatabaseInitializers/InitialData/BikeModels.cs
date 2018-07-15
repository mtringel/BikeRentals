using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.CallContext.Helpers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess;
using Toptal.BikeRentals.DataAccess.Bikes;

namespace Toptal.BikeRentals.DatabaseInitializers.InitialData
{
    public sealed class BikeModels : Helpers.DatabaseInitializerBase
    {
        internal BikeModels(
            ICallContext callContext,
            AppDbContext appDbContext,
            AppConfig appConfig,
            BikeModelDataProvider bikeModelDataProvider
            ) : base(callContext, appDbContext, appConfig)
        {
            this.BikeModelDataProvider = bikeModelDataProvider;
        }

        private BikeModelDataProvider BikeModelDataProvider;

        public override void AfterDatabaseInitialized()
        {
            base.AfterDatabaseInitialized();

            // https://www.marketing91.com/bicycle-brands/
            foreach (var name in new[] { "Merida", "Kona", "Yeti", "Marin", "Cannondale", "Specialized", "Trek", "Santa Cruz", "GT Bikes", "Giant" })
                this.BikeModelDataProvider.Add(new BikeModel()
                {
                    BikeModelName = name,
                    WeightLbs = (float)ThreadSafeRandom.NextDouble(15, 45)
                });
        }
    }
}