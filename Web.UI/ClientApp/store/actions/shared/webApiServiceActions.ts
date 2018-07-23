import axios, { AxiosPromise, AxiosResponse, AxiosRequestConfig } from 'axios';
import { TypeHelper } from "../../../helpers/typeHelper";
import { GlobalParameters } from "../../../models/shared/globalParameters";
import { Model } from "../../../models/shared/model";
import { HttpStatusCode } from "../../../models/shared/httpStatusCode";
import { StringHelper } from '../../../helpers/stringHelper';
import { WebApiResult } from '../../../models/shared/webApiResult';
import { StoreAction, IStoreAction, StoreActionThunk } from '../../actions/storeAction';
import { StoreActionType } from '../../actions/storeActionType';
import { HttpMethod } from '../../../models/shared/httpMethod';
import { AuthServiceActions } from '../../actions/security/authServiceActions';
import { RootState } from '../../state/rootState';
import { ClientContextActions } from '../../actions/shared/clientContextActions';

export class WebApiServiceActionsPayload {
    public readonly lastAntiforgeryToken: string;

    //// <summary>
    /// All request parameters serialized.
    /// </summary>
    public readonly requestKey: string;

    //// <summary>
    /// OnSuccess callback to be called when the request is completed.
    /// </summary>
    public readonly onSuccess: (result: any) => void;

    public readonly onError: (result: Error) => void;

    //// <summary>
    /// Clear only works if the subscibers number is matching this number.
    /// Used to avoid concurrency issues, instead of locking.
    /// </summary>
    public readonly expectedSubscriberLength: number;
}

export class WebApiServiceActions {

    //// <summary>
    /// resource is optional, $window.location.hash is the defult.
    /// If not debugging, always $window.location.hash is displayed.
    /// </summary>
    public static showResult<T extends Model>(
        result: WebApiResult<T> | AxiosResponse<T> | Error,
        onSuccess?: ((data: T) => void) | undefined | null
    ): StoreActionThunk{

        return (dispatch, getState) => {
            if (TypeHelper.isNullOrEmpty(result)) {
                if (!TypeHelper.isNullOrEmpty(onSuccess))
                    onSuccess(null);
            }
            else {
                var status: number;
                var statusText: string = "";
                var data: T | any = null;

                var res = result as any;

                // Error?
                if (!StringHelper.isNullOrEmpty(res.response))
                    res = res.response;

                // res.status
                // res.Status 
                // res.statusCode 
                // res.StatusCode 

                if (!StringHelper.isNullOrEmpty(res.status))
                    status = res.status;
                else if (!StringHelper.isNullOrEmpty(res.Status))
                    status = res.Status;
                else if (!StringHelper.isNullOrEmpty(res.statusCode))
                    status = res.statusCode;
                else if (!StringHelper.isNullOrEmpty(res.StatusCode))
                    status = res.StatusCode;

                // res.statusText 
                // res.StatusText 
                // res.message 
                // res.Message 

                if (!StringHelper.isNullOrEmpty(res.statusText))
                    statusText = res.statusText;
                else if (!StringHelper.isNullOrEmpty(res.StatusText))
                    statusText = res.StatusText;
                else if (!StringHelper.isNullOrEmpty(res.message))
                    statusText = res.message;
                else if (!StringHelper.isNullOrEmpty(res.Message))
                    statusText = res.Message;

                // res.data 
                // res.Data 

                if (!StringHelper.isNullOrEmpty(res.data))
                    data = res.data;
                else if (!StringHelper.isNullOrEmpty(res.Data))
                    data = res.Data;

                // data.statusText 
                // data.StatusText 
                // data.message 
                // data.Message 

                if (!StringHelper.isNullOrEmpty(data)) {
                    if (!StringHelper.isNullOrEmpty(data.statusText))
                        statusText = data.statusText;
                    else if (!StringHelper.isNullOrEmpty(data.StatusText))
                        statusText = data.StatusText;
                    else if (!StringHelper.isNullOrEmpty(data.message))
                        statusText = data.message;
                    else if (!StringHelper.isNullOrEmpty(data.Message))
                        statusText = data.Message;
                }

                // Error? (1xx Informational responses, 2xx Success, 3xx Redirection, 4xx Client errors, 5xx Server errors)
                if (status >= 300) {

                    var msg: string;

                    if (!StringHelper.isNullOrEmpty(statusText))
                        // custom error (validation error typically)
                        msg = statusText;
                    else
                        // http error
                        msg = 'Error ' + status.toString() + ' occured. Please, contact the Administrator.';

                    if (getState().clientContext.globals.IsDebugging && !StringHelper.isNullOrEmpty(data) && !StringHelper.isNullOrEmpty(data.DetailedMessage))
                        msg += ' [ERROR DETAILS] ' + data.DetailedMessage;

                    dispatch(ClientContextActions.showError(msg));

                    //if (status === HttpStatusCode.Unauthorized)
                    //    self.clientContext.redirect('#/login?returnUrl=' + encodeURI(ClientContext.currentUrl));
                }
                else
                    dispatch(ClientContextActions.showError(null));

                if (!TypeHelper.isNullOrEmpty(onSuccess))
                    onSuccess(data);
            }
        };
    }

    private static defaultConfig(state: RootState, addLastAntiforgeryToken: boolean): AxiosRequestConfig {
        var headers = {
            "Content-Type": "application/json"
        };
        
        if (addLastAntiforgeryToken) 
            headers[state.clientContext.globals.AntiforgeryTokenHeaderName] = state.webApiService.lastAntiforgeryToken;

        return {
            headers: headers
        };
    }

    /// <summary>
    /// Do not add the Post action name suffix to the url, unless it's specified in HttpPostAttribute on method.
    /// </summary>
    public static post<TResult extends Model>(
        url: string,
        data: Model,
        addLastAntiforgeryToken: boolean,
        onSuccess?: ((result: TResult) => void) | undefined | null,
        onError?: ((error: Error) => void) | undefined | null
    ): StoreActionThunk {

        return WebApiServiceActions.deferredAction(url, HttpMethod.Post, data, addLastAntiforgeryToken, onSuccess, onError);
    }

    /// <summary>
    /// Do not add the Post action name suffix to the url, unless it's specified in HttpPutAttribute on method.
    /// </summary>
    public static put<TResult extends Model>(
        url: string,
        data: Model,
        addLastAntiforgeryToken: boolean,
        onSuccess?: ((result: TResult) => void) | undefined | null,
        onError?: ((error: Error) => void) | undefined | null
    ): StoreActionThunk {

        return WebApiServiceActions.deferredAction(url, HttpMethod.Put, data, addLastAntiforgeryToken, onSuccess, onError);
    }

    /// <summary>
    /// Do not add the Post action name suffix to the url, unless it's specified in HttpGetAttribute on method.
    /// </summary>
    public static get<TResult extends Model>(
        url: string,
        onSuccess?: ((result: TResult) => void) | undefined | null,
        onError?: ((error: Error) => void) | undefined | null
    ): StoreActionThunk {

        return WebApiServiceActions.deferredAction(url, HttpMethod.Get, null, false, onSuccess, onError);
    }

    /// <summary>
    /// Do not add the Post action name suffix to the url, unless it's specified in HttpDeleteAttribute on method.
    /// </summary>
    public static delete<TResult extends Model>(
        url: string,
        addLastAntiforgeryToken: boolean,
        onSuccess?: ((result: TResult) => void) | undefined | null,
        onError?: ((error: Error) => void) | undefined | null
    ): StoreActionThunk {

        return WebApiServiceActions.deferredAction(url, HttpMethod.Delete, null, addLastAntiforgeryToken, onSuccess, onError);
    }

    /// <summary>
    /// If the cachedResult parameter is specified, then the action is not called and that will be returned (in then()).
    /// loaderIndicatorComponent is automatically displayed for longer operations.
    /// webApiResult() is called automatically to show any errors.
    /// Call then() on the returned Observable object, otherwise the action won't be executed.
    /// </summary>
    private static deferredAction<TResult extends Model>(
        url: string,
        method: HttpMethod,
        data: Model,
        addLastAntiforgeryToken: boolean,
        onSuccess?: ((result: TResult) => void) | undefined | null,
        onError?: ((error: Error) => void) | undefined | null
    ): StoreActionThunk {

        return (dispatch, getState) => {
            var rootState = getState();
            var config = WebApiServiceActions.defaultConfig(rootState, addLastAntiforgeryToken);

            // subscribe first
            var subscribeAction = WebApiServiceActions.subscribeRequest(url, method, data, config, onSuccess, onError);
            var requestKey = subscribeAction.payload.requestKey;
            dispatch(subscribeAction);

            // check if already running
            rootState = getState();
            var subscribers = rootState.webApiService.activeRequests[requestKey];

            if (subscribers.length > 1) {
                // wait for first subscriber to finish, that will call the events
            }
            else {
                // we are the first subscriber, call the server, wait for the result, call ALL subscribers at the end                

                dispatch(ClientContextActions.showLoader(onCompleted => {
                    var action: AxiosPromise<TResult>;

                    switch (method) {
                        case HttpMethod.Post:
                            action = axios.post(url, data, config);
                            break;
                        case HttpMethod.Put:
                            action = axios.put(url, data, config);
                            break;
                        case HttpMethod.Delete:
                            action = axios.delete(url, config);
                            break;
                        default:
                            action = axios.get(url, config);
                            break;
                    }

                    action.then(
                        result => {
                            onCompleted();
                            dispatch(WebApiServiceActions.showResult<TResult>(
                                result,
                                data => {
                                    // get antiforgery token, if returned
                                    if (!TypeHelper.isNullOrEmpty(data)) {
                                        var antiforgeryToken = data[rootState.clientContext.globals.AntiforgeryTokenFieldName];

                                        if (!StringHelper.isNullOrEmpty(antiforgeryToken))
                                            dispatch(WebApiServiceActions.setLastAntiforgeryToken(antiforgeryToken));
                                    }

                                    while (true) {
                                        // call all subscribers                                   
                                        rootState = getState();

                                        var subscribers = rootState.webApiService.activeRequests[requestKey];
                                        dispatch(WebApiServiceActions.clearAllRequests(requestKey, subscribers.length));

                                        // check if we had no concurrency issues when clearing
                                        rootState = getState();

                                        if (rootState.webApiService.activeRequests[requestKey] === undefined) {
                                            subscribers.forEach(t => {
                                                if (!TypeHelper.isNullOrEmpty(t.onSuccess))
                                                    t.onSuccess(data);
                                            });
                                            break;
                                        }
                                    }
                                }));
                        },
                        error => {
                            onCompleted();
                            dispatch(WebApiServiceActions.showResult<Error>(
                                error,
                                data => {
                                    while (true) {
                                        // call all subscribers                                   
                                        rootState = getState(); 

                                        var subscribers = rootState.webApiService.activeRequests[requestKey];
                                        dispatch(WebApiServiceActions.clearAllRequests(requestKey, subscribers.length));

                                        // check if we had no concurrency issues when clearing
                                        rootState = getState(); 

                                        if (rootState.webApiService.activeRequests[requestKey] === undefined) {
                                            subscribers.forEach(t => {
                                                if (!TypeHelper.isNullOrEmpty(t.onError))
                                                    t.onError(error);
                                            });
                                            break;
                                        }
                                    }
                                }));
                        });
                }));
            }
        }
    }

    /// <summary>
    /// Antiforgery works with form token + cookie token.
    /// Since the cookie can only hold the last token, we keep the last form token only.
    /// </summary>
    private static setLastAntiforgeryToken(token: string): StoreAction<Partial<WebApiServiceActionsPayload>> {
        return {
            type: StoreActionType.WebApiService_SetLastAntiforgeryToken,
            payload: {
                lastAntiforgeryToken: token
            }
        };
    }

    private static subscribeRequest(url: string, method: HttpMethod, data: any, config: AxiosRequestConfig, onSuccess: (result: any) => void, onError: (error: Error) => void)
        : StoreAction<Partial<WebApiServiceActionsPayload>> {

        return {
            type: StoreActionType.WebApiService_SubscribeRequest,
            payload: {
                requestKey: JSON.stringify({
                    url: url,
                    method: method,
                    data: data,
                    config: config
                }),
                onSuccess: onSuccess,
                onError: onError
            }
        };
    }

    private static clearAllRequests(requestKey: string, expectedSubscriberLength: number)
        : StoreAction<Partial<WebApiServiceActionsPayload>> {

        return {
            type: StoreActionType.WebApiService_ClearAllRequests,
            payload: {
                requestKey: requestKey,
                expectedSubscriberLength: expectedSubscriberLength
            }
        };
    }
}

