import { Model } from "../shared/model";
import { RoleType } from "./roleType";
import { Permission } from "./permission";
import { TypeHelper } from "../../helpers/typeHelper";
import { ArrayHelper } from "../../helpers/arrayHelper";

/// <summary>
/// Toptal.BikeRentals.Security.Principals.AppUser must be synchronized with 'permission' enum in Toptal.BikeRentals.Web.UI/ClientApp/app/shared/models/security/appUser.ts
/// </summary>
export class AppUser extends Model {

    public readonly Email: string;

    public readonly FirstName: string;

    public readonly LastName: string;

    public get FullName() { return this.FirstName + ' ' + this.LastName; }

    public readonly UserId: string;

    public readonly UserName: string;

    public readonly Role: RoleType;

    public readonly RoleTitle: string;

    public readonly Permissions: Permission[];

    /// <summary>
    /// Call authorize() first! (and that is asynchronous, be careful)
    /// </summary>
    /// <param name="permission">Permission name string or array of permission names.</param >
    /// <param name="allPermissions">If demandPermission is array, demands ANY of those permissions, if allPermissions is not specified, null, or false, or demands ALL of those permissions, if demandPermission is true.</param>
    public static hasPermission(
        user: AppUser,
        permission: Permission | Permission[],
        allPermissions?: boolean | undefined | null
    ) {
        var res: boolean;

        if (TypeHelper.isNullOrEmpty(user) || user.Role === RoleType.Disabled)
            res = false;
        else if (user.Role === RoleType.Admin)
            res = true;
        else if (user.Permissions === null)
            res = false;
        else if (permission instanceof Array) {

            var permissions = permission as Permission[];
            var userPermissions = user.Permissions;

            if (allPermissions !== true) {
                // ANY
                res = ArrayHelper.any(permissions, t => userPermissions.indexOf(t) >= 0);
            }
            else {
                // ALL
                res = ArrayHelper.all(permissions, t => userPermissions.indexOf(t) >= 0);
            }
        }
        else
            res = user.Permissions.indexOf(permission as Permission) >= 0;

        return res;
    }
}