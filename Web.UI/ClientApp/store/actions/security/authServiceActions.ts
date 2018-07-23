import { StoreAction, IStoreAction, StoreActionThunk } from '../storeAction';
import { StoreActionType } from '../storeActionType';
import { AppUser } from '../../../models/security/appUser';
import { Permission } from '../../../models/security/permission';
import { StringHelper } from '../../../helpers/stringHelper';
import { GlobalParameters } from '../../../models/shared/globalParameters';
import { ResourceType } from '../../../models/shared/resourceType';
import { TypeHelper } from '../../../helpers/typeHelper';
import { HttpStatusCode } from '../../../models/shared/httpStatusCode';
import { WebApiResult } from '../../../models/shared/webApiResult';
import { LoginData } from '../../../models/account/loginData';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { AuthServiceState } from '../../state/security/authServiceState';
import { ClientContextState } from '../../state/shared/clientContextState';
import { ErrorDetails } from '../../../models/shared/errorDetails';
import { routeUrls } from '../../../routes';
import { RootState } from '../../state/rootState';
import { LoginParamsActions } from '../../actions/account/loginParamsActions';
import { WebApiServiceActions } from '../../actions/shared/webApiServiceActions';
import { ClientContextActions } from '../../actions/shared/clientContextActions';

const ServiceUrl = "api/authservice";

export class AuthServiceActionsPayload {
    public readonly currentUser: AppUser;
}

export class AuthServiceActions {

    /// <summary>
    /// Since authorization is always asynchronous (we might have to contact the server), always use the result of this method, nothing else. DO NOT use instance members of the ClientContext.
    /// Displays current user in the id='LoginInfo*' elements.
    /// Returns OK or Redirect (redirection is the responsibility of the caller, usually by calling webApiResult()).
    /// Returns promise.
    /// webApiResult() will interpret result; caller is responsible.
    /// Call then() on the returned Promise object, otherwise the action won't be executed.
    /// </summary>
    /// <param name="setCurrentUser">
    /// Tries to retrieve from server and set the currentUser at the first time it's called (via /Api/ClientContext). 
    /// By default login sets the current user and authService in singleton; this comes to importance if the user reloads the page, then the current user must be get from server side, if needed.
    /// </param >
    /// <param name="demandAuthenticated">Redirects to login page if the current user is anonymous (by returnUrl specified in the query string).</param>
    /// <param name="demandPermission">Permission name or array of permission.</param >
    /// <param name="allPermissions">If demandPermission is array, demands ANY of those permissions, if allPermissions is not specified, null, or false, or demands ALL of those permissions, if demandPermission is true.</param>
    public static authorize(
        demandAuthenticated: boolean,
        demandPermission?: Permission | Permission[] | undefined | null,
        allPermissions?: boolean | undefined | null,
        forceReauthentication?: boolean | undefined | null,
        onSuccess?: ((user: AppUser | null) => void) | undefined | null,
        onError?: (error: WebApiResult<ErrorDetails>) => void
    ): StoreActionThunk {

        return (dispatch, getState) => {

            var getUserOnSuccess = (user: AppUser) => {
                var rootState = getState();
                var context = rootState.clientContext;
                var state = rootState.authService;

                // we have initialized the user, even if, it is not authorized
                if (!AuthServiceState.currentUserIsInitialized(state) || state.currentUser !== user || forceReauthentication === true)
                    dispatch(AuthServiceActions.setCurrentUser(user));

                // authenticated?
                if (demandAuthenticated === true && user === null) {

                    var err = new WebApiResult(
                        HttpStatusCode.Unauthorized,
                        new ErrorDetails(context.globals.resource(ResourceType.Security_Unauthenticated, rootState.clientContext.activeScreen.currentPath(), TypeHelper.toString(demandPermission)))
                    );

                    dispatch(WebApiServiceActions.showResult(err));

                    if (!TypeHelper.isNullOrEmpty(onError))
                        onError(err);
                }
                // authorized?
                else if (demandPermission !== undefined && demandPermission !== null && !AppUser.hasPermission(user, demandPermission, allPermissions)) {

                    var err = new WebApiResult(
                        HttpStatusCode.Forbidden,
                        new ErrorDetails(context.globals.resource(ResourceType.Security_Unauthorized, rootState.clientContext.activeScreen.currentPath(), TypeHelper.toString(demandPermission)))
                    );

                    dispatch(WebApiServiceActions.showResult(err));

                    if (!TypeHelper.isNullOrEmpty(onError))
                        onError(err);
                }
                // all ok
                else if (!TypeHelper.isNullOrEmpty(onSuccess))
                    onSuccess(user);
            };

            var getUserOnError = (error: Error) => {
                var state = getState().authService;

                // we have initialized the user, even if, it is not authorized
                if (!AuthServiceState.currentUserIsInitialized(state) || state.currentUser !== null || forceReauthentication === true)
                    dispatch(AuthServiceActions.setCurrentUser(null));

                var err = new WebApiResult(HttpStatusCode.InternalServerError, new ErrorDetails(error.message));
                dispatch(WebApiServiceActions.showResult(err));

                if (onError !== null)
                    onError(err);
            };

            var state = getState().authService;

            // get from server?
            if (!AuthServiceState.currentUserIsInitialized(state) || forceReauthentication === true) {
                dispatch(WebApiServiceActions.get<AppUser | null>(
                    ServiceUrl,
                    user => getUserOnSuccess(user),
                    error => getUserOnError(error)
                ));
            }
            else
                getUserOnSuccess(state.currentUser);
        }
    }

    /// <summary>
    /// For development purposes only
    /// Returns promise
    /// </summary>
    /// <returns></returns>
    public static autoLogin(
        onSuccess?: ((user: AppUser | null) => void) | undefined | null,
        onError?: ((error: Error) => void) | undefined | null
    ): StoreActionThunk  {

        return (dispatch, getState) => {
            var rootState = getState();
            var context = rootState.clientContext;
            var state = rootState.authService;
            
            // autologin?
            if (!AuthServiceState.currentUserIsInitialized(state) &&
                context.globals.IsDebugging &&
                !StringHelper.isNullOrEmpty(context.globals.AutoLoginEmail) &&
                !StringHelper.isNullOrEmpty(context.globals.AutoLoginPassword)
            ) {
                // login does not require anti-forgery token
                dispatch(WebApiServiceActions.post<AppUser | null>(
                    ServiceUrl,
                    {
                        Email: context.globals.AutoLoginEmail,
                        Password: context.globals.AutoLoginPassword,
                        RememberMe: false
                    },
                    null,
                    user => {
                        dispatch(AuthServiceActions.setCurrentUser(user));

                        if (!TypeHelper.isNullOrEmpty(onSuccess))
                            onSuccess(user);
                    },
                    error => {
                        dispatch(AuthServiceActions.setCurrentUser(null));

                        if (!TypeHelper.isNullOrEmpty(onError))
                            onError(error);
                    }));
            }
            else if (!TypeHelper.isNullOrEmpty(onSuccess))
                onSuccess(null);
        };
    }

    private static setCurrentUser(user: AppUser | null): StoreActionThunk {
        var self = this;

        return (dispatch, getState) => {
            dispatch(AuthServiceActions.setCurrentUserSuccess(user));

            var navMenu = getState().clientContext.navMenu;

            if (!TypeHelper.isNullOrEmpty(navMenu))
                navMenu.refresh();
        };
    }

    private static setCurrentUserSuccess(user: AppUser | null) : StoreAction<Partial<AuthServiceActionsPayload>> {
        return {
            type: StoreActionType.AuthService_SetCurrentUserSuccess,
            payload: {
                currentUser: user
            }
        };
    }

    /// <summary>
    /// Returns promise
    /// </summary>
    public static logoff(onSuccess: () => void): StoreActionThunk {
        
        return (dispatch, getState) => {
            dispatch(WebApiServiceActions.delete(
                ServiceUrl,
                false,
                result => {
                    dispatch(AuthServiceActions.setCurrentUser(null));
                    onSuccess();
                }
            ));
        }
    }

    public static login(data: LoginData, onSuccess: (user: AppUser) => void): StoreActionThunk {
        
        return (dispatch, getState) => {
            dispatch(WebApiServiceActions.post<AppUser>(
                ServiceUrl,
                data,
                false,
                user => {
                    dispatch(AuthServiceActions.setCurrentUser(user));
                    onSuccess(user);
                }
            ));
        };
    }

    public static redirectToLoginPageIfNeeded(): StoreActionThunk {

        return (dispatch, getState) => {

            var rootState = getState();

            if (TypeHelper.isNullOrEmpty(rootState.authService.currentUser)) {
                dispatch(LoginParamsActions.setReturnUrl(rootState.clientContext.activeScreen.currentPath()));
                dispatch(ClientContextActions.redirect(routeUrls.account.login()));
            }
        }
    }
}