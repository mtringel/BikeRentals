import { User } from "./user";
import { TypeHelper } from "../../helpers/typeHelper";

export class UserListData {

    /// <summary>
    /// Top 100 items only
    /// </summary>
    public readonly List: User[] = [];

    /// <summary>
    /// If there are more than 100 returned items
    /// </summary>
    public readonly TooMuchData: boolean = false;
}