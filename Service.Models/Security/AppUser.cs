using System;
using System.Linq;
using Toptal.BikeRentals.Security.Principals;
using Toptal.BikeRentals.Service.Models.Helpers;

namespace Toptal.BikeRentals.Service.Models.Security
{
    /// <summary>
    /// Application specific user entity. AuthProvider.CurrentUser returns it.
    /// Contains all security information needed for authentication / authorization, see authProvider.js.
    /// </summary>
    public sealed class AppUser : Model
    {
        public string Email { get; private set; }

        public string FirstName { get; private set; }

        public string LastName { get; private set; }

        public string FullName { get { return String.Format("{0} {1}", FirstName, LastName); } }

        public string UserId { get; private set; }

        public string UserName { get; private set; }

        public RoleType Role { get; private set; }

        public string RoleName { get { return Role.Name(); } }

        public string RoleTitle { get { return Role.Title(); } }

        public Permission[] Permissions { get; private set; }

        public AppUser()
        {
        }

        public AppUser(Toptal.BikeRentals.Security.Principals.AppUser user)
        {
            this.Email = user.Email;
            this.FirstName = user.FirstName;
            this.LastName = user.LastName;
            this.UserId = user.UserId;
            this.UserName = user.UserName;
            this.Role = user.Role;

            if (user.Permissions != null)
                this.Permissions = user.Permissions.ToArray();
        }



    }
}