using System;
using System.Collections.Generic;

namespace Toptal.BikeRentals.Security.Principals
{
    /// <summary>
    /// This entity is SENT to the client!
    /// Application specific user entity
    /// We do not send down to the client the AspNetIdentityUser, that's too detailed, we send AppUser instead.
    /// Contains all security information needed for authentication / authorization, see authProvider.js.
    /// </summary>
    public sealed class AppUser
    {
        public string Email { get; private set; }

        public string FirstName { get; private set; }

        public string LastName { get; private set; }

        public string FullName { get { return String.Format("{0} {1}", FirstName, LastName); } }

        public string UserId { get; private set; }

        public string UserName { get; private set; }

        public RoleType Role { get; private set; }

        /// <summary>
        /// Returns null for Admin, since she is authorized for everything
        /// </summary>
        public HashSet<Permission> Permissions { get { return Role.Permissions(); } }

        public AppUser(string userId, string firstName, string lastName, string userName, string email, RoleType role)
        {
            this.Email = email;
            this.FirstName = firstName;
            this.LastName = lastName;
            this.UserId = userId;
            this.UserName = userName;
            this.Role = role;
        }

        internal AppUser(AspNetIdentityUser user, RoleType role)
            : this (user.Id, user.FirstName, user.LastName, user.UserName, user.Email, role)
        {
        }


    }
}