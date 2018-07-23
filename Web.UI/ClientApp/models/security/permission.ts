/// <summary>
/// Toptal.BikeRentals.Security.Principals.Permission must be synchronized with 'permission' enum in Toptal.BikeRentals.Web.UI/ClientApp/app/shared/models/security/permission.ts
/// </summary>
export enum Permission {
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

    BikeRents_ViewAll,

    /// <summary>
    /// Manage own entries
    /// </summary>
    BikeRents_ManageOwn,

    /// <summary>
    /// Manage all entries
    /// </summary>
    BikeRents_ManageAll,

    AutoComplete_GetUsers
}