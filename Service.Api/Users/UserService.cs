using System;
using System.Linq;
using Toptal.BikeRentals.Service.Models.Users;
using Toptal.BikeRentals.BusinessLogic.Users;
using Toptal.BikeRentals.Security.Principals;
using System.Collections.Generic;
using Toptal.BikeRentals.Service.Api.Helpers;
using Toptal.BikeRentals.Service.Models.Helpers;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Security.Managers;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess.Helpers;
using Toptal.BikeRentals.Logging.Telemetry;
using Toptal.BikeRentals.Exceptions.Validation;
// don't refer to BusinessEntities namespaces here (to avoid confusion with Service.Models)

namespace Toptal.BikeRentals.Service.Api.Users
{
    public sealed class UserService : ServiceBase
    {
        #region Services

        private BusinessLogic.Users.UserManager UserManager;

        #endregion

        public UserService(
            ICallContext callContext,
            IAuthProvider authProvider,
            AppConfig appConfig,
            ITelemetryLogger logger,
            ITransactionManager transactionManager,
            BusinessLogic.Users.UserManager userManager
            )
            : base(callContext, authProvider, appConfig, logger, transactionManager)
        {
            UserManager = userManager;
        }

        #region Get (collection)

        /// <summary>
        /// Get entity collection
        /// freeTextSearch - looks for in any text field
        /// </summary>
        public UserListData GetList(string filter)
        {
            using (var scope = Scope("GetList"))
            {
                // authorize
                AuthProvider.Authorize(Permission.User_Management);

                // process
                var maxRows = AppConfig.WebApplication.GridMaxRows;
                var list = UserManager.GetList(filter, null, maxRows + 1).ToArray();
                Helper.ValidateResult(list);

                return scope.Complete(
                    () => new UserListData()
                    {
                        List = list.Take(maxRows).Select(t => new User(t)).ToArray(),
                        TooMuchData = list.Count() > maxRows
                    },
                    t => $"User list loaded {t.List.Length} items."
                    );
            }
        }

        #endregion

        #region Get (single entity)

        /// <summary>
        /// Get single entity
        /// id == userId or "new" or "profile" (own)
        /// </summary>
        public UserFormData GetById(string userId)
        {
            using (var scope = Scope("GetById"))
            {
                AuthProvider.Authenticate(); // throws UnauthenticatedException or we have CurrentUser after this

                // prepare
                Helper.Expect(typeof(User), userId);
                var isNew = string.Compare(userId, "new", true) == 0;
                var ownProfile = !isNew && (userId == "profile" || string.Compare(userId, AuthProvider.CurrentUser.UserId, true) == 0);

                // authorize
                if (ownProfile)
                    AuthProvider.Authorize(Permission.User_EditProfile, Permission.User_Management);
                else
                    AuthProvider.Authorize(Permission.User_Management);

                // process
                return scope.Complete(
                    () => new UserFormData() { User = isNew ? new Models.Users.User() : new Models.Users.User(UserManager.GetById(ownProfile ? AuthProvider.CurrentUser.UserId : userId)) },
                    t => $"User loaded with Id={t.User.UserId}."
                    );
            }
        }

        #endregion

        #region Post (create single)

        /// <summary>
        /// Create new entity
        /// </summary>
        public User Post(User user)
        {
            using (var scope = Scope("Post"))
            {
                // authorize
                AuthProvider.Authorize(Permission.User_Management); // throws UnauthenticatedException or we have CurrentUser after this

                // prepare
                Helper.Expect(user);
                user.UserName = user.Email;

                // only Admin can set roles other than User
                if (!AuthProvider.HasPermission(Permission.User_Management_SetRole) && user.Role != RoleType.User)
                    throw new ValidationException("Role cannot be set.", false);

                // validate
                Helper.ValidateModel(user, true);

                // process
                var entity = user.ToEntity();
                UserManager.Add(entity);

                return scope.Complete(
                    () => new User(entity),
                    t => $"User has been created with Id={t.UserId}."
                    );
            }
        }

        #endregion

        #region Put (update single entity)

        /// <summary>
        /// Update single entity
        /// </summary>
        public User Put(User user)
        {
            using (var scope = Scope("Put"))
            {
                AuthProvider.Authenticate(); // throws UnauthenticatedException or we have CurrentUser after this

                // prepare
                Helper.Expect(user, user.UserId);

                user.UserName = user.Email;

                if (user.UserId != null)
                    user.UserId = user.UserId.ToLower();

                var ownProfile = string.Compare(user.UserId, AuthProvider.CurrentUser.UserId, true) == 0;
                var oldUser = UserManager.GetById(user.UserId); // throws EntityNotFoundException

                // authorize
                if (ownProfile)
                    AuthProvider.Authorize(Permission.User_EditProfile);
                else if (oldUser.Role == RoleType.Manager || oldUser.Role == RoleType.Admin)
                    AuthProvider.Authorize(Permission.User_Management_EditAdmins); // only Admin can edit Admin 
                else
                    AuthProvider.Authorize(Permission.User_Management);

                // only Admin can set roles other than User
                if (!AuthProvider.HasPermission(Permission.User_Management_SetRole) && oldUser.Role != user.Role)
                    throw new ValidationException("Role cannot be set.", false);

                // validate
                Helper.ValidateModel(user, true);

                // process
                var entity = user.ToEntity();
                UserManager.Update(entity);

                return scope.Complete(
                    () => new User(entity),
                    t => $"User has been updated with Id={t.UserId}."
                    );
            }
        }

        #endregion

        #region Delete (single entity)

        /// <summary>
        /// Delete single entity
        /// </summary>
        public void Delete(string userId)
        {
            using (var scope = Scope("Delete"))
            {
                AuthProvider.Authenticate(); // throws UnauthenticatedException or we have CurrentUser after this

                // prepare
                Helper.Expect(typeof(User), userId);

                var ownProfile = string.Compare(userId, AuthProvider.CurrentUser.UserId, true) == 0;
                var oldUser = UserManager.GetById(userId);

                // authorize
                if (ownProfile)
                    AuthProvider.Authorize(Permission.User_EditProfile);
                else if (oldUser.Role == RoleType.Admin)
                    AuthProvider.Authorize(Permission.User_Management_EditAdmins); // only Admin can edit Admin
                else
                    AuthProvider.Authorize(Permission.User_Management);

                // validate

                // process
                // UserManager.Delete(id);
                UserManager.Disable(userId);

                scope.Complete(() => $"User has been deleted with Id={userId}.");
            }
        }

        #endregion
    }
}