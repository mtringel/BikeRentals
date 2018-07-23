import { Model } from "../shared/model";

export class UserRef extends Model {

    public readonly FirstName: string;

    public readonly LastName: string;

    public readonly UserId: string;
}
