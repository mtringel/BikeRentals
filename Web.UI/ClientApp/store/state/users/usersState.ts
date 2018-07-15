import { User } from '../../../models/users/user';

/// <summary>
/// DO NOT add instance properties and functions here.
/// DO initialize all members.
/// </summary>
export class UsersState {
    /// <summary>
    /// The filter we got the data for.
    /// List of users is completed for this filter. 
    /// </summary>
    public readonly usersFilter: string | undefined = undefined;
    public readonly users: User[] = [];

    public readonly tooMuchData: boolean = false;
}