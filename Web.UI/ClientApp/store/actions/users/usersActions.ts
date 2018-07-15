import { StoreAction, IStoreAction } from '../storeAction';
import { StoreActionType } from '../storeActionType';
import { KeyValuePair } from '../../../models/shared/keyValuePair';
import { RoleType } from '../../../models/security/roleType';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { UserListData } from '../../../models/users/userListData';
import { UsersState } from '../../state/users/usersState';
import { StringHelper } from '../../../helpers/stringHelper';
import { TypeHelper } from '../../../helpers/typeHelper';
import { User } from '../../../models/users/user';
import { Permission } from '../../../models/security/permission';
import { UserAuthContext } from '../../../models/users/userAuthContext';
import { WebApiResult } from '../../../models/shared/webApiResult';
import { AppUser } from '../../../models/security/appUser';
import { GlobalParameters } from '../../../models/shared/globalParameters';
import { ErrorDetails } from '../../../models/shared/errorDetails';
import { WebApiServiceActions } from '../../actions/shared/webApiServiceActions';
import { RootState } from '../../state/rootState';
import { AuthServiceActions } from '../../actions/security/authServiceActions';
import { UserEditData } from '../../../models/users/userEditData';

const serviceUrl = {
    getList: (filter: string) => "api/users?filter=" + encodeURI(StringHelper.notNullOrEmpty(filter, "")),
    getById: (userId: string) => "api/users/" + encodeURI(userId),
    post: () => "api/users",
    put: (userId: string) => "api/users/" + encodeURI(userId),
    delete: (userId: string) => "api/users/" + encodeURI(userId)
};

export class UsersActionsPayload {
    public readonly usersFilter;
    public readonly userId: string | null;
    public readonly users: User[];
    public readonly tooMuchData: boolean;
}

export class UsersActions {

    public static getList(allowCachedData: boolean, filter: string, onSuccess: (data: UserListData) => void)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {

        return (dispatch, getState) => {
            var rootState = getState();
            var context = rootState.clientContext;

            if (allowCachedData) {
                var data = rootState.users;

                if (data.usersFilter === filter && !TypeHelper.isNullOrEmpty(data.users)) {

                    // return from store (full match)
                    onSuccess({ List: data.users, TooMuchData: data.tooMuchData });

                } else if (StringHelper.contains(data.usersFilter, filter, true) && !TypeHelper.isNullOrEmpty(data.users)) {

                    // return from store (partial match)
                    var match = data.users.filter((value, index, array) =>
                        StringHelper.contains(value.Email, filter, true) ||
                        StringHelper.contains(value.FirstName, filter, true) ||
                        StringHelper.contains(value.LastName, filter, true) ||
                        StringHelper.contains(value.RoleTitle, filter, true) ||
                        StringHelper.contains(value.UserName, filter, true)
                    );

                    onSuccess({
                        List: match.slice(0, context.globals.GridMaxRows),
                        TooMuchData: match.length > context.globals.GridMaxRows
                    });
                }
                else {
                    // return from server (updates store)
                    dispatch(UsersActions.getList(false, filter, onSuccess));
                }
            }
            else {
                dispatch(WebApiServiceActions.get<UserListData>(
                    serviceUrl.getList(filter),
                    result => {
                        dispatch(UsersActions.setListData(filter, result));
                        onSuccess(result);
                    }
                ));
            }
        }
    }

    private static setListData(filter: string, data: UserListData): StoreAction<Partial<UsersActionsPayload>> {
        return {
            type: StoreActionType.Users_SetListData,
            payload: {
                usersFilter: filter,
                tooMuchData: data.TooMuchData,
                users: data.List
            }
        };
    }

    public static getById(allowCachedData: boolean, userId: string, onSuccess: (data: UserEditData) => void)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {
        
        return (dispatch, getState) => {
            if (allowCachedData) {
                var user = ArrayHelper.findByPredicate(getState().users.users, t => t.UserId === userId);

                if (user !== null) {
                    // return from store
                    onSuccess({ User: user });
                } else {
                    // return from server (updates store)
                    dispatch(UsersActions.getById(false, userId, onSuccess));
                }
            }
            else {
                dispatch(WebApiServiceActions.get<UserEditData>(
                    serviceUrl.getById(userId),
                    result => {
                        dispatch(UsersActions.setFormData(result));
                        onSuccess(result);
                    }
                ));
            }
        }
    }

    private static setFormData(data: UserEditData): StoreAction<Partial<UsersActionsPayload>> {
        return {
            type: StoreActionType.Users_SetFormData,
            payload: {
                userId: data.User.UserId,
                users: [data.User]
            }
        };
    }

    public static clearState(): StoreAction<UsersActionsPayload> {
        return {
            type: StoreActionType.Users_ClearState,
            payload: null
        };
    }

    public static post(user: User, addLastAntiforgeryToken: boolean, onSuccess: () => void)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {

        return (dispatch, getState) => {
            dispatch(WebApiServiceActions.post<User>(
                serviceUrl.post(),
                user,
                addLastAntiforgeryToken,
                user => {
                    dispatch(UsersActions.postSuccess(user));
                    onSuccess();
                }
            ));
        };
    }

    private static postSuccess(user: User): StoreAction<Partial<UsersActionsPayload>> {
        return {
            type: StoreActionType.Users_PostSuccess,
            payload: {
                userId: user.UserId,
                users: [user]
            }
        };
    }

    public static put(user: User, addLastAntiforgeryToken: boolean, onSuccess: () => void)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {
        
        return (dispatch, getState) => {
            dispatch(WebApiServiceActions.put<User>(
                serviceUrl.put(user.UserId),
                user,
                addLastAntiforgeryToken,
                user => {
                    dispatch(UsersActions.putSuccess(user));
                    onSuccess();
                }
            ));
        };
    }

    private static putSuccess(user: User): StoreAction<Partial<UsersActionsPayload>> {
        return {
            type: StoreActionType.Users_PutSuccess,
            payload: {
                userId: user.UserId,
                users: [user]
            }
        };
    }

    public static delete(userId: string, addLastAntiforgeryToken: boolean, onSuccess: () => void)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {
        
        return (dispatch, getState) => {
            dispatch(WebApiServiceActions.delete(
                serviceUrl.delete(userId),
                addLastAntiforgeryToken,
                () => {
                    dispatch(UsersActions.deleteSuccess(userId));
                    onSuccess();
                }
            ));
        };
    }

    private static deleteSuccess(userId: string): StoreAction<Partial<UsersActionsPayload>> {
        return {
            type: StoreActionType.Users_DeleteSuccess,
            payload: {
                userId: userId
            }
        };
    }

    private static authorizeAny(
        demandAuthenticated: boolean,
        demandPermission?: Permission | Permission[] | undefined | null,
        allPermissions?: boolean | undefined | null,
        onSuccess?: ((authContext: UserAuthContext) => void) | undefined | null,
        onError?: (error: WebApiResult<ErrorDetails>) => void
    ): (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {
        
        return (dispatch, getState) => {
            dispatch(AuthServiceActions.authorize(demandAuthenticated, demandPermission, allPermissions, false,
                user => {
                    if (!TypeHelper.isNullOrEmpty(onSuccess))
                        onSuccess({
                            currentUser: user,
                            currentUserId: user.UserId,
                            canEditAdmin: AppUser.hasPermission(user, Permission.User_Management_EditAdmins),
                            canSetRole: AppUser.hasPermission(user, Permission.User_Management_SetRole)
                        });
                },
                error => {
                    if (!TypeHelper.isNullOrEmpty(onError))
                        onError(error);
                }));
        };
    }

    public static authorizeList(
        onSuccess?: ((authContext: UserAuthContext) => void) | undefined | null,
        onError?: (error: WebApiResult<ErrorDetails>) => void
    ): (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {

        return UsersActions.authorizeAny(true, Permission.User_Management, false, onSuccess, onError);
    }

    public static authorizeEdit(
        userId: string,
        isNewUser: boolean,
        onSuccess?: ((authContext: UserAuthContext) => void) | undefined | null,
        onError?: (error: WebApiResult<ErrorDetails>) => void
    ): (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {

        return (dispatch, getState) => {
            if (isNewUser) {
                dispatch(UsersActions.authorizeAny(true, Permission.User_Management, false, onSuccess, onError));
            } else {
                dispatch(AuthServiceActions.authorize(true, [Permission.User_EditProfile, Permission.User_Management], false, false,
                    user => {
                        // own profile? 
                        var perm = userId === "profile" || user.UserId === userId ? Permission.User_EditProfile : Permission.User_Management;
                        dispatch(UsersActions.authorizeAny(true, perm, false, onSuccess, onError));
                    },
                    error => {
                        if (!TypeHelper.isNullOrEmpty(onError))
                            onError(error);
                    }
                ));
            }
        };
    }
}