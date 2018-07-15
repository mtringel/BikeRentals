using System;
using System.Linq;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Exceptions.Entities;
using Toptal.BikeRentals.Exceptions.Validation;
using Toptal.BikeRentals.Security.DataAccess;
using Toptal.BikeRentals.Security.Helpers;
using Toptal.BikeRentals.Security.Principals;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace Toptal.BikeRentals.Security.Managers
{
    /// <summary>
    /// Lifetime: Scoped (current request)
    /// </summary>
    public sealed class AuthProvider : IAuthProvider
    {
        public AuthProvider(
            ICallContext callContext,
            IUserProvider userProvider,
            UserManager userManager,
            RoleManager roleManager,
            SignInManager signInManager,
            AspNetIdentityDbContext aspNetIdentityDbContext
            )
        {
            this.UserProvider = userProvider;
            this.UserManager = userManager;
            this.RoleManager = roleManager;
            this.SignInManager = signInManager;
            this.CallContext = callContext;
            this.AspNetIdentityDbContext = aspNetIdentityDbContext;
        }

        #region Services

        private IUserProvider UserProvider;

        private UserManager  UserManager;

        private RoleManager RoleManager;

        private SignInManager SignInManager;

        private ICallContext CallContext;

        private AspNetIdentityDbContext AspNetIdentityDbContext;

        #endregion

        #region CurrentUser

        /// <summary>
        /// CurrentUser can be null even if IsAuthenticated is true. Happens, if somebody deletes a logged in user.
        /// However, after Authenticate() or Authorize() the user is surely here.
        /// </summary>
        public string IdentityName { get { return CallContext.Identity?.Identity?.Name; } }

        private AppUser _CurrentUser;

        /// <summary>
        /// Scope: HttpContext
        /// In a load balanced environment, it is not necessarily present in HttpContext.
        /// HttpContext.User is always set by ASP.Net by auth.cookie.
        /// CurrentUser can be null even if IsAuthenticated is true. Happens, if somebody deletes a logged in user.
        /// However, after Authenticate() or Authorize() the user is surely here.
        /// </summary>
        public AppUser CurrentUser
        {
            get
            {
                if (_CurrentUser == null)
                {
                    if (CallContext.Identity?.Identity?.IsAuthenticated ?? false)
                    {
                        var identity = IdentityName;

                        if (!string.IsNullOrEmpty(identity))
                        {
                            if (UserProvider != null)
                            {
                                // uses UserNameIndex
                                _CurrentUser = UserProvider.FindByUserName(identity);
                            }
                            else
                            {
                                // performs full table scan 
                                var user = UserManager.FindByNameAsync(identity).Result;

                                _CurrentUser = new AppUser(
                                    user,
                                    RoleTypeHelper.Parse(UserManager.GetRolesAsync(user).Result.FirstOrDefault())
                                    );
                            }
                        }
                    }
                }

                return _CurrentUser;
            }
        }

        /// <summary>
        /// Used for testing
        /// </summary>
        public void Impersonate(AppUser user)
        {
            _CurrentUser = user;
        }

        #endregion

        #region Authentication and authorization

        /// <summary>
        /// It's faster than checking CurrentUser (CurrentUser has to retrieve the user entity from the database for the current request)
        /// </summary>
        public bool IsAuthenticated { get { return CallContext.Identity != null && CallContext.Identity.Identity.IsAuthenticated; } }

        public bool HasPermission(params Permission[] permissions)
        {
            return IsAuthenticated && CurrentUser.Role.Authorized(permissions);
        }

        public bool HasPermission(Permission[] permissions, bool all)
        {
            return IsAuthenticated && CurrentUser.Role.Authorized(permissions, all);
        }

        /// <summary>
        /// Throws UnauthenticatedException, which returns 401 Unauthorized, if not authenticated (HandleException), which will trigger a login page redirect with returnUrl (application.webApiResult) or
        /// </summary>
        public void Authenticate()
        {
            // this could happen, if somebody deletes a logged in user
            if (!IsAuthenticated || CurrentUser == null)
                throw new Exceptions.Security.UnauthenticatedException(CallContext.ResourceUri, "LogIn", Microsoft.Extensions.Logging.LogLevel.Warning);
        }

        /// <summary>
        /// Demands any of the permissions.
        /// Either,
        /// Throws UnauthenticatedException, which returns 401 Unauthorized, if not authenticated (HandleException), which will trigger a login page redirect with returnUrl (application.webApiResult) or
        /// Throws UnauthorizedException, which returnns 403 Forbidden, if not authorized, which will result in an error message displayed (application.webApiResult)
        /// </summary>
        public void Authorize(params Permission[] permissions)
        {
            Authorize(permissions, false);
        }

        /// <summary>
        /// /// Demands any or all of the permissions.
        /// Either,
        /// Throws UnauthenticatedException, which returns 401 Unauthorized, if not authenticated (HandleException), which will trigger a login page redirect with returnUrl (application.webApiResult) or
        /// Throws UnauthorizedException, which returnns 403 Forbidden, if not authorized, which will result in an error message displayed (application.webApiResult)
        /// </summary>
        public void Authorize(Permission[] permissions, bool all)
        {
            // this could happen, if somebody deletes a logged in user
            if (!IsAuthenticated || CurrentUser == null)
                throw new Exceptions.Security.UnauthenticatedException(CallContext.ResourceUri, string.Join(",", permissions), Microsoft.Extensions.Logging.LogLevel.Warning);

            if (!CurrentUser.Role.Authorized(permissions, all))
                throw new Exceptions.Security.UnauthorizedException(CallContext.ResourceUri, string.Join(",", permissions), Microsoft.Extensions.Logging.LogLevel.Warning);
        }

        #endregion

        #region User management

        private void Call(Task<IdentityResult> callback)
        {
            Call(callback.Result);
        }

        private void Call(IdentityResult callback)
        {
            if (!callback.Succeeded)
                throw new Exceptions.Validation.ValidationException(callback.Errors.Select(t => t.Description), false);
        }

        /// <summary>
        /// Saves modified user data into the ASP Net Identity database
        /// </summary>
        public void AddUser(string firstName, string lastName, string userName, string email, string password, RoleType role)
        {
            var anotherUser = UserManager.FindByNameAsync(userName).Result;

            // Add
            if (anotherUser != null)
                throw new Exceptions.Validation.ValidationException(Resources.Resources.Register_EmailAlreadyExists, false);

            var user = new AspNetIdentityUser()
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                UserName = userName
            };

            Call(UserManager.CreateAsync(user, password));
            Call(UserManager.AddToRoleAsync(user, role.Name()));

            AspNetIdentityDbContext.SaveChanges();
        }

        /// <summary>
        /// Saves modified user data into the ASP Net Identity database
        /// </summary>
        public void UpdateUser(string userId, string firstName, string lastName, string userName, string email, string password, RoleType role)
        {
            var user = UserManager.FindByIdAsync(userId).Result;

            if (user == null)
                throw new EntityNotFoundException(CallContext.ResourceUri, typeof(AspNetIdentityUser), new[] { userId }, LogLevel.Error);

            var anotherUser = UserManager.FindByNameAsync(userName).Result;

            if (anotherUser != null && string.Compare(anotherUser.Id, userId, true) != 0)
                throw new ValidationException(Resources.Resources.Register_EmailAlreadyExists, false);

            user.FirstName = firstName;
            user.LastName = lastName;
            user.Email = email;
            user.UserName = userName;

            Call(UserManager.UpdateAsync(user));

            // Password
            if (!string.IsNullOrEmpty(password))
            {
                Call(UserManager.RemovePasswordAsync(user));
                Call(UserManager.AddPasswordAsync(user, password));
            }

            // Roles
            var roles = UserManager.GetRolesAsync(user).Result;

            if (!roles.SequenceEqual(new[] { role.Name() }))
            {
                Call(UserManager.RemoveFromRolesAsync(user, roles.ToArray()));
                Call(UserManager.AddToRoleAsync(user, role.Name()));
            }

            AspNetIdentityDbContext.SaveChanges();
        }

        public void DeleteUser(string userId)
        {
            var user = UserManager.FindByIdAsync(userId).Result;

            if (user == null)
                throw new Exceptions.Entities.EntityNotFoundException(CallContext.ResourceUri, typeof(AspNetIdentityUser), new[] { userId }, LogLevel.Error);

            // delete roles
            var roles = UserManager.GetRolesAsync(user).Result;
            Call(UserManager.RemoveFromRolesAsync(user, roles.ToArray()));

            // delete user
            Call(UserManager.DeleteAsync(user));

            AspNetIdentityDbContext.SaveChanges();
        }

        public void Login(string userName, string password, bool rememberMe)
        {
            // This doesn"t count login failures towards account lockout
            // To enable password failures to trigger account lockout, change to shouldLockout: true
            var success = SignInManager.PasswordSignInAsync(userName, password, rememberMe, false).Result;

            if (success.Succeeded)
            {
                var user = UserManager.FindByNameAsync (userName).Result;

                Impersonate(new AppUser(
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.UserName,
                    user.Email,
                    RoleTypeHelper.Parse(UserManager.GetRolesAsync(user).Result.FirstOrDefault())
                    ));
            }
            else if (success.IsLockedOut)
            {
                throw new Exceptions.Validation.ValidationException(Resources.Resources.Account_LockedOut, false);
            }
            else if (success.RequiresTwoFactor)
            {
                throw new Exceptions.Validation.ValidationException(Resources.Resources.Account_RequiresVertification, false);
            }
            else
            {
                throw new Exceptions.Validation.ValidationException(Resources.Resources.Account_InvalidLoginAttempt, false);
            }
        }

        public void LogOut()
        {
            SignInManager.SignOutAsync().Wait();
            Impersonate(null);
        }

        #endregion

        public void CreateRole(RoleType role)
        {
            RoleManager.CreateAsync(new AspNetIdentityRole(role)).Wait();
        }
    }
}
