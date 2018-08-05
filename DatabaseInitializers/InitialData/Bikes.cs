using System;
using System.Linq;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.CallContext.Helpers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess;
using Toptal.BikeRentals.DataAccess.Bikes;
using Toptal.BikeRentals.DataAccess.Master;
using Toptal.BikeRentals.DataAccess.Users;

namespace Toptal.BikeRentals.DatabaseInitializers.InitialData
{
    public sealed class Bikes : Helpers.DatabaseInitializerBase
    {
        /// <summary>
        /// I'm here. Put some bikes around.
        /// </summary>
        private static readonly Location Hungary_Pest_Erd = new Location(47.383333d, 18.916667d);

        internal Bikes(
            ICallContext callContext,
            AppDbContext appDbContext,
            AppConfig appConfig,
            ColorDataProvider colorDataProvider,
            BikeModelDataProvider bikeModelDataProvider,
            UserDataProvider userDataProvider,
            BikeDataProvider bikeDataProvider
            ) : base(callContext, appDbContext, appConfig)
        {
            this.BikeDataProvider = bikeDataProvider;
            this.ColorDataProvider = colorDataProvider;
            this.BikeModelDataProvider = bikeModelDataProvider;
            this.UserDataProvider = userDataProvider;
        }

        private BikeDataProvider BikeDataProvider;

        private ColorDataProvider ColorDataProvider;

        private BikeModelDataProvider BikeModelDataProvider;

        private UserDataProvider UserDataProvider;

        public override void AfterDatabaseInitialized()
        {
            base.AfterDatabaseInitialized();

            var dbc = AppConfig.DatabaseCreation;
            var colors = ColorDataProvider.GetList().ToArray();
            var models = BikeModelDataProvider.GetList().ToArray();
            var user = UserDataProvider.GetByUserName(dbc.AdminUserEmail, true);

            for (int i = 0; i < dbc.TestBikesCount; i++)
            {
                var available = ThreadSafeRandom.NextBool();

                BikeDataProvider.Add(new Bike(
                    0,
                    available ? BikeState.Available: ThreadSafeRandom.NextItem(new[]{
                        BikeState.Reserved,
                        BikeState.Reserved,
                        BikeState.Reserved,
                        BikeState.Reserved,
                        BikeState.Reserved,
                        BikeState.Reserved,
                        BikeState.Reserved,
                        BikeState.Reserved,
                        BikeState.Lost,
                        BikeState.Maintenance
                    }),
                    ThreadSafeRandom.NextItem(models),
                    ThreadSafeRandom.NextItem(colors),
                    // put around Érd?
                    ThreadSafeRandom.Next(10) == 0 ?
                        new Location(Hungary_Pest_Erd.Lat + ThreadSafeRandom.NextDouble(-1d, 1d), Hungary_Pest_Erd.Lng + ThreadSafeRandom.NextDouble(-1d, 1d)) :
                        new Location(ThreadSafeRandom.NextDouble(-90d, 90d), ThreadSafeRandom.NextDouble(-180d, 180d))
                        ,
                    ThreadSafeRandom.NextItem(new[]{
                        "San Francisco","New York","Paris","Budapest","Berlin","Tokyo","Washington","Dallas","Houston","London","Madrid","Rome","Lisbon","Vien","Beijing",
                        "Melbourne","Sydney","Rio","Amsterdam","Gant","Brussels","Moscow","Delhi","Genova","Ottawa","Mexico City","Los Angeles","Las Vegas"
                    }),
                    DateTime.Now.AddMinutes(available ? ThreadSafeRandom.Next(-30 * 24 * 60, 0) : ThreadSafeRandom.Next(1, 5 * 24 * 60)),
                    (float)ThreadSafeRandom.NextDouble(0d, 5d),
                    DateTime.Now,
                    user,
                    false
                ));
            }
        }
    }
}