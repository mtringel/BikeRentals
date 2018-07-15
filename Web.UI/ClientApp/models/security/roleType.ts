/// <summary>
/// Order is important!
/// Toptal.BikeRentals.Security.Principals.RoleType must be synchronized with 'roleType' enum in Toptal.BikeRentals.Web.UI/ClientApp/app/shared/models/security/roleType.ts
/// </summary>
export enum RoleType {
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