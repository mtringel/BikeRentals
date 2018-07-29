import { StoreAction, IStoreAction, StoreActionThunk } from '../storeAction';
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
import { UserFormData } from '../../../models/users/userFormData';
import { DateHelper } from '../../../helpers/dateHelper';

const serviceUrl = {
    getList: (filter: string) => "api/users?filter=" + encodeURI(StringHelper.notNullOrEmpty(filter, "")),
    getById: (userId: string) => "api/users/" + encodeURI(userId),
    post: () => "api/users",
    put: (userId: string) => "api/users/" + encodeURI(userId),
    delete: (userId: string) => "api/users/" + encodeURI(userId)
};

export type UsersActionsPayload = UsersActionsPayload_PostPutDelete | UsersActionsPayload_SetListData | UsersActionsPayload_SetFormData;

export class UsersActionsPayload_PostPutDelete {
    public readonly userId: string;
    public readonly user: User | null;
}

export class UsersActionsPayload_SetListData {
    public readonly listFilter: string;
    public readonly listData: UserListData;
}

export class UsersActionsPayload_SetFormData {
    public readonly userId: string;
    public readonly formData: UserFormData;
}

export class UsersActions {

    public static getList(allowCachedData: boolean, filter: string, onSuccess: (data: UserListData) => void): StoreActionThunk {

        return (dispatch, getState) => {
            var rootState = getState();
            var state = rootState.users;
            var data = allowCachedData ? state.cache.getListData(filter) : null;

            if (!TypeHelper.isNullOrEmpty(data)) {
                // return from cache
                onSuccess(data);
            }
            else {
                // load from server
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

    private static setListData(filter: string, data: UserListData): StoreAction<UsersActionsPayload_SetListData> {
        return {
            type: StoreActionType.Users_SetListData,
            payload: {
                listFilter: filter,
                listData: data
            }
        };
    }

    public static getById(allowCachedData: boolean, userId: string, onSuccess: (data: UserFormData) => void): StoreActionThunk {

        return (dispatch, getState) => {
            if (allowCachedData) {
                var user = getState().users.cache.getById(userId);

                if (!TypeHelper.isNullOrEmpty(user)) {
                    // return from cache
                    onSuccess({ User: user });
                    return;
                }
            }

            // load from server
            dispatch(WebApiServiceActions.get<UserFormData>(
                serviceUrl.getById(userId),
                result => {
                    dispatch(UsersActions.setFormData(result));
                    onSuccess(result);
                }
            ));
        }
    }

    private static setFormData(data: UserFormData): StoreAction<UsersActionsPayload_SetFormData> {
        return {
            type: StoreActionType.Users_SetFormData,
            payload: {
                userId: data.User.UserId,
                formData: data
            }
        };
    }

    public static clearState(): StoreAction<UsersActionsPayload> {
        return {
            type: StoreActionType.Users_ClearState,
            payload: null
        };
    }

    public static clearStateIfExpired(): StoreActionThunk {
        return (dispatch, getState) => {
            var rootState = getState();
            var state = rootState.users;

            if (TypeHelper.isNullOrEmpty(state.timestamp) || DateHelper.dateDiffInDays(state.timestamp, DateHelper.now()) >= rootState.clientContext.globals.ClientCacheDurationInMinutes)
                dispatch(UsersActions.clearState());
        };
    }

    public static post(user: User, addLastAntiforgeryToken: boolean, onSuccess: () => void): StoreActionThunk {

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

    private static postSuccess(user: User): StoreAction<UsersActionsPayload_PostPutDelete> {
        return {
            type: StoreActionType.Users_PostSuccess,
            payload: {
                userId: user.UserId,
                user: user
            }
        };
    }

    public static put(user: User, addLastAntiforgeryToken: boolean, onSuccess: () => void): StoreActionThunk {
        
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

    private static putSuccess(user: User): StoreAction<UsersActionsPayload_PostPutDelete> {
        return {
            type: StoreActionType.Users_PutSuccess,
            payload: {
                userId: user.UserId,
                user: user
            }
        };
    }

    public static delete(userId: string, addLastAntiforgeryToken: boolean, onSuccess: () => void): StoreActionThunk {
        
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

    private static deleteSuccess(userId: string): StoreAction<UsersActionsPayload_PostPutDelete> {
        return {
            type: StoreActionType.Users_DeleteSuccess,
            payload: {
                userId: userId,
                user: null
            }
        };
    }

    private static authorizeAny(
        demandAuthenticated: boolean,
        demandPermission?: Permission | Permission[] | undefined | null,
        allPermissions?: boolean | undefined | null,
        onSuccess?: ((authContext: UserAuthContext) => void) | undefined | null,
        onError?: (error: WebApiResult<ErrorDetails>) => void
    ): StoreActionThunk {
        
        return (dispatch, getState) => {
            dispatch(AuthServiceActions.authorize(demandAuthenticated, demandPermission, allPermissions, false,
                user => {
                    if (!TypeHelper.isNullOrEmpty(onSuccess))
                        onSuccess({
                            currentUser: user,
                            currentUserId: user.UserId,
                            canManage: AppUser.hasPermission(user, Permission.User_Management),
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
    ): StoreActionThunk {

        return UsersActions.authorizeAny(true, Permission.User_Management, false, onSuccess, onError);
    }

    public static authorizeEdit(
        userId: string,
        isNewUser: boolean,
        onSuccess?: ((authContext: UserAuthContext) => void) | undefined | null,
        onError?: (error: WebApiResult<ErrorDetails>) => void
    ): StoreActionThunk {

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