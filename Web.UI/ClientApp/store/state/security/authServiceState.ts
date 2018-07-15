import { AppUser } from '../../../models/security/appUser';

/// <summary>
/// DO NOT add instance properties and functions here.
/// DO initialize all members.
/// </summary>
export class AuthServiceState {

    /// <summary>
    /// undefined means we didn't try to authenticate.
    /// null means we tried to authenticate, but failed.
    /// Otherwise the successfully authenticated user is there.
    /// </summary>
    public readonly currentUser: AppUser | null | undefined = undefined;

    public static currentUserIsInitialized(state: AuthServiceState) { return state.currentUser !== undefined; }

    public static currentUserIsAuthenticated(state: AuthServiceState) { return state.currentUser !== undefined && state.currentUser !== null; }
}
