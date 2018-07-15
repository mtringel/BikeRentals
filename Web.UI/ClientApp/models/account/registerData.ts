import { Model } from "../shared/model";

export class RegisterData extends Model {

    public readonly Email: string;

    public readonly Password: string;

    public readonly ConfirmPassword: string;

    public readonly FirstName: string;

    public readonly LastName: string;
}