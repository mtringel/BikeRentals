﻿using Toptal.BikeRentals.Service.Api.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Helpers;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Security.Principals;
using System.Linq;
using Toptal.BikeRentals.BusinessEntities.Helpers;
using Toptal.BikeRentals.BusinessLogic.Rents;
using Toptal.BikeRentals.Service.Models.Rents;
using Toptal.BikeRentals.BusinessEntities.Rents;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Service.Api.Rents
{
    public sealed class BikeRentService : ServiceBase
    {
        #region Services

        private BikeRentManager BikeRentManager;

        #endregion

        public BikeRentService(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            ITelemetryLogger logger,
            ITransactionManager transactionManager,
            BikeRentManager bikeRentManager
            )
            : base(callContext, authProvider, appConfig, logger, transactionManager)
        {
            this.BikeRentManager = bikeRentManager;
        }

        #region Get (collection)

        /// <summary>
        /// Get entity collection
        /// freeTextSearch - looks for in any text field
        /// </summary>
        public BikeRentListData GetList(BikeRentListFilter filter, PagingInfo paging)
        {
            using (var scope = Scope("GetList"))
            {
                // authorize
                AuthProvider.Authorize(Permission.BikeRents_ViewAll, Permission.BikeRents_ManageAll, Permission.BikeRents_ManageOwn);

                if (!AuthProvider.HasPermission(Permission.BikeRents_ViewAll, Permission.BikeRents_ManageAll))
                    filter.Users = new[] { AuthProvider.CurrentUser.UserId };

                // process
                var list = BikeRentManager.GetList(filter, paging, out int totalRowCount).ToArray();
                Helper.ValidateResult(list);

                return scope.Complete(
                    () => new BikeRentListData()
                    {
                        List = list.Select(t => new Models.Rents.BikeRentListItem(t)).ToArray(),
                        TotalRowCount = totalRowCount
                    },
                    t => $"BikeRent list loaded {t.List.Length} items."
                    );
            }
        }

        #endregion

        //#region Get (single entity)

        ///// <summary>
        ///// Get single entity
        ///// id == bikeId or "new" 
        ///// </summary>
        //public BikeFormData GetById(int bikeId)
        //{
        //    using (var scope = Scope("Get", new BikeFormData()))
        //    {
        //        AuthProvider.Authenticate(); // throws UnauthenticatedException or we have CurrentUser after this

        //        // prepare
        //        var isNew = string.Compare(bikeId, "new", true) == 0;

        //        // authorize
        //        AuthProvider.Authorize(Permission.Bike_ViewAll);

        //        // process
        //        scope.Result.Entity = isNew ? new Bike() : BikeManager.Get(bikeId);
        //        scope.Result.Colors = ColorManager.GetList().ToArray();
        //        scope.Result.Bik

        //        return scope.Complete(() => scope.Result, t => $"User loaded with Id={t.Entity.UserId}.");
        //    }
        //}

        //#endregion

        //#region Post (create single)

        ///// <summary>
        ///// Create new entity
        ///// </summary>
        //public void Post(User user)
        //{
        //    using (var scope = Scope("Post"))
        //    {
        //        AuthProvider.Authenticate(); // throws UnauthenticatedException or we have CurrentUser after this

        //        // prepare
        //        Helper.Expect(user);
        //        user.UserName = user.Email;

        //        // authorize
        //        AuthProvider.Authorize(Permission.User_Management);

        //        // only Admin can set roles other than User
        //        if (!AuthProvider.HasPermission(Permission.User_Management_SetRole) && user.Role != RoleType.User)
        //            throw new ValidationException("Role cannot be set.", false);

        //        // validate
        //        Helper.ValidateModel(user, true);

        //        // process
        //        UserManager.Add(user.ToEntity());

        //        scope.Complete(() => $"User has been created with Id={user.UserId}.");
        //    }
        //}

        //#endregion

        //#region Put (update single entity)

        ///// <summary>
        ///// Update single entity
        ///// </summary>
        //public void Put(User user)
        //{
        //    using (var scope = Scope("Put"))
        //    {
        //        AuthProvider.Authenticate(); // throws UnauthenticatedException or we have CurrentUser after this

        //        // prepare
        //        Helper.Expect(user, user.UserId);

        //        user.UserName = user.Email;

        //        if (user.UserId != null)
        //            user.UserId = user.UserId.ToLower();

        //        var ownProfile = string.Compare(user.UserId, AuthProvider.CurrentUser.UserId, true) == 0;
        //        var oldUser = UserManager.Get(user.UserId); // throws EntityNotFoundException

        //        // authorize
        //        if (ownProfile)
        //            AuthProvider.Authorize(Permission.User_EditProfile);
        //        else if (oldUser.Role != RoleType.User)
        //            AuthProvider.Authorize(Permission.User_Management_EditAdmins); // only Admin can edit Admin 
        //        else
        //            AuthProvider.Authorize(Permission.User_Management);

        //        // only Admin can set roles other than User
        //        if (!AuthProvider.HasPermission(Permission.User_Management_SetRole) && oldUser.Role != user.Role)
        //            throw new ValidationException("Role cannot be set.", false);

        //        // validate
        //        Helper.ValidateModel(user, true);

        //        // process
        //        UserManager.Update(user.ToEntity());

        //        scope.Complete(() => $"User has been updated with Id={user.UserId}.");
        //    }
        //}

        //#endregion

        //#region Delete (single entity)

        ///// <summary>
        ///// Delete single entity
        ///// </summary>
        //public void Delete(string id)
        //{
        //    using (var scope = Scope("Delete"))
        //    {
        //        AuthProvider.Authenticate(); // throws UnauthenticatedException or we have CurrentUser after this

        //        // prepare
        //        Helper.Expect(typeof(User), id);

        //        id = id.ToLower();

        //        var ownProfile = string.Compare(id, AuthProvider.CurrentUser.UserId, true) == 0;
        //        var oldUser = UserManager.Get(id);

        //        // authorize
        //        if (ownProfile)
        //            AuthProvider.Authorize(Permission.User_EditProfile);
        //        else if (oldUser.Role == RoleType.Admin)
        //            AuthProvider.Authorize(Permission.User_Management_EditAdmins); // only Admin can edit Admin
        //        else
        //            AuthProvider.Authorize(Permission.User_Management);

        //        // process
        //        UserManager.Delete(id);

        //        scope.Complete(() => $"User has been deleted with Id={id}.");
        //    }
        //}

        //#endregion
    }
}