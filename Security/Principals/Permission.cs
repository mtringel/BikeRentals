using System.Collections.Generic;
using System.Linq;

namespace Toptal.BikeRentals.Security.Principals
{
    /// <summary>
    /// Toptal.BikeRentals.Security.Principals.Permission must be synchronized with 'permission' enum in Web.UI/ClientApp/app/shared/models/security/permission.ts
    /// </summary>
    public enum Permission
    {
        /// <summary>
        /// Minimum permission for a logged in user
        /// </summary>
        User_LoggedIn,

        /// <summary>
        /// User edits her own profile
        /// </summary>
        User_EditProfile,

        /// <summary>
        /// Manage all user profiles
        /// </summary>
        User_Management,

        /// <summary>
        /// Set user role to other than User
        /// UserManager cannot do it, only Admin can do it.
        /// </summary>
        User_Management_SetRole,

        /// <summary>
        /// UserManager cannot edit Admin users, only Admins can do it
        /// </summary>
        User_Management_EditAdmins,

        Bike_ViewAll,

        Bike_Management,

        BikeRentals_ViewAll,

        /// <summary>
        /// Manage own entries
        /// </summary>
        BikeRentals_ManageOwn,

        /// <summary>
        /// Manage all entries
        /// </summary>
        BikeRentals_ManageAll
    }

    public static class PermissionHelper
    {
        public static readonly Permission[] AllPermissions = (Permission[])System.Enum.GetValues(typeof(Permission));

        private static readonly string[] AllNames = AllPermissions.Select(t => t.ToString()).ToArray();

        private static readonly string[] AllTitles = AllPermissions.Select(t => t.ToString().Replace('_', ' ')).ToArray();

        #region Security Matrix

        /// <summary>
        /// SecurityMatrix[(int)roleType, (int)permission]
        /// </summary>
        internal static readonly Dictionary<RoleType, HashSet<Permission>> SecurityMatrix = new Dictionary<RoleType, HashSet<Permission>>()
        {
            #region User permissions

            { RoleType.User, new HashSet<Permission> (new[]{
                // User
                Permission.User_LoggedIn ,
                Permission.User_EditProfile ,
                // Bike
                Permission.Bike_ViewAll,
                // BikeRentals
                Permission.BikeRentals_ManageOwn
            }) },

            #endregion

            #region UserManager permissions

            // automatically get the permissions of the User role, put only additional permissions here
            { RoleType.Manager, new HashSet<Permission> (new[]{
                // User
                Permission.User_Management,
                // Bike
                Permission.Bike_Management,
                // BikeRentals
                Permission.BikeRentals_ViewAll
            }) },

            #endregion

            #region Admin permissions 

            // Admin has all permissions by default, no need to list it
            { RoleType.Admin, null }

            #endregion
        };

        #endregion

        static PermissionHelper()
        {
            #region Copy permissions User -> Manager

            var userManagerPermissions = SecurityMatrix[RoleType.Manager];

            foreach (var permission in SecurityMatrix[RoleType.User])
                userManagerPermissions.Add(permission);

            #endregion
        }

        #region Helpers

        /// <summary>
        /// Serialized name
        /// </summary>
        public static string Name(this Permission permission)
        {
            return AllNames[(int)permission];
        }

        /// <summary>
        /// Displayed title
        /// </summary>
        public static string Title(this Permission permission)
        {
            return AllTitles[(int)permission];
        }

        #endregion
    }
}
