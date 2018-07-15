using Toptal.BikeRentals.Security.Principals;

namespace Toptal.BikeRentals.Security.Managers
{
    public interface IAuthProvider
    {
        /// <summary>
        /// CurrentUser can be null even if IsAuthenticated is true. Happens, if somebody deletes a logged in user.
        /// However, after Authenticate() or Authorize() the user is surely here.
        /// </summary>
        AppUser CurrentUser { get; }

        bool IsAuthenticated { get; }
        void Authenticate();
        void Impersonate(AppUser user);

        /// <summary>
        /// CurrentUser can be null even if IsAuthenticated is true. Happens, if somebody deletes a logged in user.
        /// However, after Authenticate() or Authorize() the user is surely here.
        /// </summary>
        string IdentityName { get; }

        bool HasPermission(params Permission[] permissions);
        bool HasPermission(Permission[] permissions, bool all);

        void DeleteUser(string userId);

        void Authorize(params Permission[] permissions);
        void Authorize(Permission[] permissions, bool all);

        void Login(string userName, string password, bool rememberMe);
        void LogOut();

        void AddUser(string firstName, string lastName, string userName, string email, string password, RoleType role);
        void UpdateUser(string userId, string firstName, string lastName, string userName, string email, string password, RoleType role);

        void CreateRole(RoleType role);
    }
}