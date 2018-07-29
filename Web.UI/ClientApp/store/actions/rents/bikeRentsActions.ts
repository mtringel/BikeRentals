import { StoreAction, IStoreAction, StoreActionThunk } from '../storeAction';
import { StoreActionType } from '../storeActionType';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { BikeRentListData } from '../../../models/rents/bikeRentListData';
import { StringHelper } from '../../../helpers/stringHelper';
import { TypeHelper } from '../../../helpers/typeHelper';
import { BikeRent } from '../../../models/rents/bikeRent';
import { Permission } from '../../../models/security/permission';
import { ErrorDetails } from '../../../models/shared/errorDetails';
import { BikeRentListFilter } from '../../../models/rents/bikeRentListFilter';
import { BikeRentAuthContext } from '../../../models/rents/bikeRentAuthContext';
import { PagingInfo } from '../../../models/shared/pagingInfo';
import { WebApiResult } from '../../../models/shared/webApiResult';
import { RootState } from '../../state/rootState';
import { WebApiServiceActions } from '../../actions/shared/webApiServiceActions';
import { AuthServiceActions } from '../../actions/security/authServiceActions';
import { Location } from '../../../models/master/location';
import { BikeRentFormData } from '../../../models/rents/bikeRentFormData';
import { BikeModelsActions } from '../bikes/bikeModelsActions';
import { ColorsActions } from '../master/colorsActions';
import { BikesActions } from '../../actions/bikes/bikesActions';
import { AppUser } from '../../../models/security/appUser';
import { AutoCompleteActions } from '../shared/autoCompleteActions';
import { DateHelper } from '../../../helpers/dateHelper';

const serviceUrl = {
    getList: (filter: BikeRentListFilter, paging: PagingInfo) =>
        "api/bikeRents?" +
        "filter=" + encodeURI(JSON.stringify(filter)) +
        "&paging=" + encodeURI(JSON.stringify(paging))
    ,
    getById: (bikeRentId: string) => "api/bikeRents/" + encodeURI(bikeRentId),
    post: () => "api/bikeRents",
    put: (bikeRentId: string) => "api/bikeRents/" + encodeURI(bikeRentId),
    delete: (bikeRentId: string) => "api/bikeRents/" + encodeURI(bikeRentId)
};

export type BikeRentsActionsPayload =
    BikeRentsActionsPayload_PostPutDelete |
    BikeRentsActionsPayload_SetListData |
    BikeRentsActionsPayload_SetFormData |
    BikeRentsActionsPayload_UseBikeId;

export class BikeRentsActionsPayload_PostPutDelete {
    public readonly bikeRentId: string;
    public readonly bikeRent: BikeRent | null;
}

export class BikeRentsActionsPayload_SetListData {
    public readonly listFilter: BikeRentListFilter;
    public readonly listPaging: PagingInfo;
    public readonly listData: BikeRentListData;
}

export class BikeRentsActionsPayload_SetFormData {
    public readonly bikeRentId: string;
    public readonly formData: BikeRentFormData;
}

export class BikeRentsActionsPayload_UseBikeId {
    public readonly bikeId: number;
}

export class BikeRentsActions {

    public static getList(
        allowCachedData: boolean,
        filter: BikeRentListFilter,
        paging: PagingInfo,
        onSuccess: (data: BikeRentListData) => void
    ): StoreActionThunk {

        return (dispatch, getState) => {
            var rootState = getState();
            var state = rootState.bikeRents;
            var data = allowCachedData ? state.listCache.getListData({ ...filter, ...paging }) : null;

            if (!TypeHelper.isNullOrEmpty(data)) {
                // return from store 
                onSuccess(data);
            } else {
                dispatch(WebApiServiceActions.get<BikeRentListData>(
                    serviceUrl.getList(filter, paging),
                    result => {
                        dispatch(BikeRentsActions.setListData(filter, paging, result));
                        onSuccess(result);
                    }
                ));
            }
        }
    }

    private static setListData(filter: BikeRentListFilter, paging: PagingInfo, data: BikeRentListData): StoreAction<BikeRentsActionsPayload_SetListData> {
        return {
            type: StoreActionType.BikeRents_SetListData,
            payload: {
                listFilter: filter,
                listPaging: paging,
                listData: data
            }
        };
    }

    public static getById(allowCachedData: boolean, bikeRentId: string, onSuccess: (data: BikeRentFormData) => void): StoreActionThunk {

        return (dispatch, getState) => {
            var rootState = getState();
            var state = rootState.bikeRents;
            var data = allowCachedData ? state.formCache.getFormData(bikeRentId) : null;

            if (!TypeHelper.isNullOrEmpty(data)) {
                // return from store
                onSuccess(data);
            } else {
                dispatch(WebApiServiceActions.get<BikeRentFormData>(
                    serviceUrl.getById(bikeRentId),
                    result => {
                        dispatch(BikeRentsActions.setFormData(result));
                        onSuccess(result);
                    }
                ));
            }
        }
    }

    private static setFormData(data: BikeRentFormData): StoreAction<BikeRentsActionsPayload_SetFormData> {
        return {
            type: StoreActionType.BikeRents_SetFormData,
            payload: {
                bikeRentId: data.BikeRent.BikeRentId,
                formData: data
            }
        };
    }

    public static clearState(): StoreAction<BikeRentsActionsPayload> {
        return {
            type: StoreActionType.BikeRents_ClearState,
            payload: null
        };
    }

    public static clearStateIfExpired(): StoreActionThunk {
        return (dispatch, getState) => {
            var rootState = getState();
            var state = rootState.bikeRents;

            if (TypeHelper.isNullOrEmpty(state.timestamp) || DateHelper.dateDiffInDays(state.timestamp, DateHelper.now()) >= rootState.clientContext.globals.ClientCacheDurationInMinutes)
                dispatch(BikeRentsActions.clearState());
        };
    }

    public static post(bikeRent: BikeRent, addLastAntiforgeryToken: boolean, onSuccess: () => void): StoreActionThunk{
        
        return (dispatch, getState) => {
            dispatch(WebApiServiceActions.post(
                serviceUrl.post(),
                bikeRent,
                addLastAntiforgeryToken,
                () => {
                    dispatch(BikeRentsActions.postSuccess(bikeRent));
                    onSuccess();
                }
            ));
        };
    }

    private static postSuccess(bikeRent: BikeRent): StoreAction<BikeRentsActionsPayload_PostPutDelete> {
        return {
            type: StoreActionType.BikeRents_PostSuccess,
            payload: {
                bikeRentId: bikeRent.BikeRentId,
                bikeRent: bikeRent
            }
        };
    }

    public static put(bikeRent: BikeRent, addLastAntiforgeryToken: boolean, onSuccess: () => void)
        : StoreActionThunk {
        
        return (dispatch, getState) => {
            dispatch(WebApiServiceActions.put(
                serviceUrl.put(bikeRent.BikeRentId),
                bikeRent,
                addLastAntiforgeryToken,
                () => {
                    dispatch(BikeRentsActions.putSuccess(bikeRent));
                    onSuccess();
                }
            ));
        };
    }

    private static putSuccess(bikeRent: BikeRent): StoreAction<BikeRentsActionsPayload_PostPutDelete> {
        return {
            type: StoreActionType.BikeRents_PutSuccess,
            payload: {
                bikeRentId: bikeRent.BikeRentId,
                bikeRent: bikeRent
            }
        };
    }

    public static delete(bikeRentId: string, addLastAntiforgeryToken: boolean, onSuccess: () => void): StoreActionThunk {
        
        return (dispatch, getState) => {
            dispatch(WebApiServiceActions.delete(
                serviceUrl.delete(bikeRentId),
                addLastAntiforgeryToken,
                () => {
                    dispatch(BikeRentsActions.deleteSuccess(bikeRentId));
                    onSuccess();
                }
            ));
        };
    }

    private static deleteSuccess(bikeRentId: string): StoreAction<BikeRentsActionsPayload_PostPutDelete> {
        return {
            type: StoreActionType.BikeRents_DeleteSuccess,
            payload: {
                bikeRentId: bikeRentId,
                bikeRent: null
            }
        };
    }

    private static authorizeAny(
        demandAuthenticated: boolean,
        demandPermission?: Permission | Permission[] | undefined | null,
        allPermissions?: boolean | undefined | null,
        onSuccess?: ((authContext: BikeRentAuthContext) => void) | undefined | null,
        onError?: (error: WebApiResult<ErrorDetails>) => void
    ): StoreActionThunk {

        
        return (dispatch, getState) => {
            dispatch(AuthServiceActions.authorize(demandAuthenticated, demandPermission, allPermissions, false, 
                user => {
                    if (!TypeHelper.isNullOrEmpty(onSuccess))
                        onSuccess({
                            currentUser: user,
                            currentUserId: user.UserId,
                            canManageOwn: AppUser.hasPermission(user, Permission.BikeRents_ManageOwn),
                            canManageAll: AppUser.hasPermission(user, Permission.BikeRents_ManageAll)
                        });
                },
                error => {
                    if (!TypeHelper.isNullOrEmpty(onError))
                        onError(error);
                }));
        };
    }

    public static authorizeList(
        onSuccess?: ((authContext: BikeRentAuthContext) => void) | undefined | null,
        onError?: (error: WebApiResult<ErrorDetails>) => void
    ): StoreActionThunk {
        
        return (dispatch, getState) => {
            dispatch(BikeRentsActions.authorizeAny(true, [Permission.BikeRents_ViewAll, Permission.BikeRents_ManageOwn, Permission.BikeRents_ManageAll], false, onSuccess, onError));
        };
    }

    public static useBikeId(bikeId: number): StoreAction<BikeRentsActionsPayload_UseBikeId> {
        return {
            type: StoreActionType.BikeRents_SetUseBikeId,
            payload: {
                bikeId: bikeId
            }
        };
    }

    //public authorizeEdit(
    //    bikeRentId: string,
    //    isNewBikeRent: boolean,
    //    onSuccess?: ((authContext: BikeRentAuthContext) => void) | undefined | null,
    //    onError?: (error: WebApiResult<ErrorDetails>) => void
    //): (dispatch: (action: IStoreAction | ((action: any) => void)) => void) => void {
    //    var self = this;
    //    return (dispatch, getState) => {
    //        if (isNewBikeRent) {
    //            dispatch(self.authorizeAny(true, Permission.BikeRent_Management, false, onSuccess, onError));
    //        } else {
    //            dispatch(self.store.actions.authService.authorize(true, [Permission.BikeRent_EditProfile, Permission.BikeRent_Management], false,
    //                bikeRent => {
    //                    // own profile? 
    //                    var perm = bikeRent.BikeRentId === bikeRentId ? Permission.BikeRentRents_ManageOwn : Permission.BikeRent_Management;
    //                    dispatch(self.authorizeAny(true, perm, false, onSuccess, onError));
    //                },
    //                error => {
    //                    if (!TypeHelper.isNullOrEmpty(onError))
    //                        onError(error);
    //                }
    //            ));
    //        }
    //    };
    //}
}