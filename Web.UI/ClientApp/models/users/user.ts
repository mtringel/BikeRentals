import { RoleType } from "../security/roleType";
import { UserRef } from "./userRef";

export class User extends UserRef {

    public readonly Email: string;

    public readonly UserName: string;

    public readonly RoleTitle: string;

    public readonly Role: RoleType = RoleType.User;

    /// <summary>
    /// Not read from Db.
    /// Not returned to client.
    /// Only used when new user is created.
    /// </summary>
    public readonly Password: string;

    /// <summary>
    /// Not read from Db.
    /// Not returned to client.
    /// Only used when new user is created.
    /// </summary>
    public readonly ConfirmPassword: string;
}