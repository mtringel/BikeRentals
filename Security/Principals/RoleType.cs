using System.Collections.Generic;
using System.Linq;

namespace Toptal.BikeRentals.Security.Principals
{
    /// <summary>
    /// Order is important!
    /// Toptal.BikeRentals.Security.Principals.RoleType must be synchronized with 'roleType' enum in Web.UI/ClientApp/app/shared/models/security/roleType.ts
    /// </summary>
    public enum RoleType
    {
        Disabled,

        /// <summary>
        /// When logged in, a user can see, edit and delete his times he entered.
        /// A regular user would only be able to CRUD on their owned records.
        /// User must be the first (default).
        /// </summary>
        User,

        /// <summary>
        /// A user manager would be able to CRUD users.
        /// </summary>
        Manager,

        /// <summary>
        /// An admin would be able to CRUD all records and users.
        /// </summary>
        Admin
    }

    public static class RoleTypeHelper
    {
        public static readonly RoleType[] AllRoles = (RoleType[])System.Enum.GetValues(typeof(RoleType));

        private static readonly string[] AllNames = AllRoles.Select(t => t.ToString()).ToArray();

        private static readonly string[] AllTitles = AllRoles.Select(t => t.ToString().Replace('_', ' ')).ToArray();

        #region Helpers

        /// <summary>
        /// Serialized name
        /// </summary>
        public static string Name(this RoleType role)
        {
            return AllNames[(int)role];
        }

        /// <summary>
        /// Displayed title
        /// </summary>
        public static string Title(this RoleType role)
        {
            return AllTitles[(int)role];
        }

        /// <summary>
        /// Parse name or title
        /// </summary>
        public static RoleType Parse(string name)
        {
            // RoleType.User is the default
            if (string.IsNullOrEmpty(name))
                return RoleType.User;
            else
                return AllRoles.FirstOrDefault(t => string.Compare(t.Name(), name, true) == 0 || string.Compare(t.Title(), name, true) == 0);
        }

        #endregion

        #region Authorization

        public static bool Authorized(this RoleType role, params Permission[] permissions)
        {
            return Authorized(role, permissions, false);
        }

        public static bool Authorized(this RoleType role, Permission[] permissions, bool all)
        {
            if (all)
                return role != RoleType.Disabled && (role == RoleType.Admin || permissions.All(t => role.Permissions().Contains(t)));
            else
                return role != RoleType.Disabled && (role == RoleType.Admin || permissions.Any(t => role.Permissions().Contains(t)));
        }

        /// <summary>
        /// Returns null for Admin, since she is authorized for everything
        /// </summary>
        public static HashSet<Permission> Permissions(this RoleType role)
        {
            return PermissionHelper.SecurityMatrix[role];
        }

        #endregion
    }
}
