using Toptal.BikeRentals.Service.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Helpers;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.BusinessLogic.Bikes;
using Toptal.BikeRentals.Service.Models.Bikes;
using Toptal.BikeRentals.BusinessEntities.Bikes;
using Toptal.BikeRentals.Security.Principals;
using System.Linq;
using Toptal.BikeRentals.BusinessLogic.Master;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessEntities.Master;
using Toptal.BikeRentals.Exceptions.Validation;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Service.Api.Bikes
{
    public sealed class BikeService : ServiceBase
    {
        #region Services

        private BikeManager BikeManager;

        #endregion

        public BikeService(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            ITelemetryLogger logger,
            ITransactionManager transactionManager,
            BikeManager bikeManager
            )
            : base(callContext, authProvider, appConfig, logger, transactionManager)
        {
            this.BikeManager = bikeManager;
        }

        #region Get (collection)

        /// <summary>
        /// Get entity collection
        /// freeTextSearch - looks for in any text field
        /// </summary>
        public BikeListData GetList(BikeListFilter filter, PagingInfo paging, Location? currentLocation)
        {
            using (var scope = Scope("GetList"))
            {
                // authorize
                AuthProvider.Authorize(Permission.Bike_ViewAll, Permission.Bike_Management);

                if (!AuthProvider.HasPermission(Permission.Bike_Management))
                    filter.State = BikeState.Available;

                // process
                var list = BikeManager.GetList(filter, paging, currentLocation, out int totalRowCount).ToArray();
                Helper.ValidateResult(list);

                return scope.Complete(
                    () => new BikeListData()
                    {
                        List = list.Select(t => new Service.Models.Bikes.BikeListItem(t, currentLocation)).ToArray(),
                        TotalRowCount = totalRowCount
                    },
                    t => $"Bike list loaded {t.List.Length} items."
                    );
            }
        }

        #endregion

        #region Get (single entity)

        /// <summary>
        /// Get single entity
        /// id == bikeId or "new" 
        /// </summary>
        public BikeFormData GetById(int bikeId, Location? currentLocation)
        {
            using (var scope = Scope("GetById"))
            {
                AuthProvider.Authenticate(); // throws UnauthorizedException or we have CurrentUser after this

                // prepare
                Helper.Expect(typeof(Models.Bikes.Bike), bikeId);
                var isNew = bikeId <= 0;

                // authorize
                AuthProvider.Authorize(Permission.Bike_ViewAll);

                // process
                return scope.Complete(
                    () => new BikeFormData() { Bike = isNew ? new Models.Bikes.Bike(currentLocation) : new Models.Bikes.Bike(BikeManager.GetById(bikeId), currentLocation) },
                    t => $"Bike loaded with Id={t.Bike.BikeId}."
                    );
            }
        }

        #endregion

        #region Post (create single)

        /// <summary>
        /// Create new entity
        /// </summary>
        public void Post(Models.Bikes.Bike bike)
        {
            using (var scope = Scope("Post"))
            {
                // authorize
                AuthProvider.Authorize(Permission.Bike_Management); // throws UnauthorizedException or we have CurrentUser after this

                // prepare
                Helper.Expect(bike);

                // validate
                Helper.ValidateModel(bike, true);

                // process
                BikeManager.Add(bike.ToEntity());

                scope.Complete(() => $"User has been created with Id={bike.BikeId}.");
            }
        }

        #endregion

        #region Put (update single entity)

        /// <summary>
        /// Update single entity
        /// </summary>
        public void Put(Models.Bikes.Bike bike)
        {
            using (var scope = Scope("Put"))
            {
                // authorize
                AuthProvider.Authorize(Permission.Bike_Management); // throws UnauthorizedException or we have CurrentUser after this

                // prepare
                Helper.Expect(bike, bike.BikeId);

                // validate
                Helper.ValidateModel(bike, true);

                // process
                BikeManager.Update(bike.ToEntity());

                scope.Complete(() => $"User has been updated with Id={bike.BikeId}.");
            }
        }

        #endregion

        #region Delete (single entity)

        /// <summary>
        /// Delete single entity
        /// </summary>
        public void Delete(int bikeId)
        {
            using (var scope = Scope("Delete"))
            {
                // authorize
                AuthProvider.Authorize(Permission.Bike_Management); // throws UnauthorizedException or we have CurrentUser after this

                // prepare
                Helper.Expect(typeof(Models.Bikes.Bike), bikeId);

                // process
                BikeManager.Delete(bikeId);

                scope.Complete(() => $"User has been deleted with Id={bikeId}.");
            }
        }

        #endregion
    }
}