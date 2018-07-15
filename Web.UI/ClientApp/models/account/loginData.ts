import { Model } from "../shared/model";

export class LoginData extends Model {

    public readonly Email: string = "";

    public readonly Password: string = "";

    public readonly RememberMe: boolean = false;
}