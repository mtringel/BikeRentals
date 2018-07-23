import * as React from 'react';
import { ArrayHelper } from '../../helpers/arrayHelper';

/// <summary>
/// Order is important!
/// Toptal.BikeRentals.Security.Principals.RoleType must be synchronized with 'roleType' enum in Toptal.BikeRentals.Web.UI/ClientApp/app/shared/models/security/roleType.ts
/// </summary>
export enum RoleType {
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

export class RoleTypeHelper {
    public static readonly allRoles: RoleType[] = [RoleType.Disabled, RoleType.User, RoleType.Manager, RoleType.Admin];

    public static readonly roleNames: string[] = ["Disabled", "User", "Manager", "Admin"];

    public static getOption(role: RoleType): JSX.Element {
        return <option key={role} value={role}>{RoleTypeHelper.roleNames[role]}</option>
    }
}