import { Model } from "../shared/model";
import { RoleType } from "../security/roleType";

export class User extends Model {

    public readonly FirstName: string;

    public readonly LastName: string;

    public readonly FullName: string;

    public readonly Email: string;

    public readonly UserName: string;

    public readonly RoleTitle: string;

    public readonly Role: RoleType = RoleType.User;

    public readonly UserId: string;

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