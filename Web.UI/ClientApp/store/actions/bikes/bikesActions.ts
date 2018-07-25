import { StoreAction, IStoreAction, StoreActionThunk } from '../storeAction';
import { StoreActionType } from '../storeActionType';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { BikeListData } from '../../../models/bikes/bikeListData';
import { StringHelper } from '../../../helpers/stringHelper';
import { TypeHelper } from '../../../helpers/typeHelper';
import { Bike } from '../../../models/bikes/bike';
import { Permission } from '../../../models/security/permission';
import { ErrorDetails } from '../../../models/shared/errorDetails';
import { BikeListFilter } from '../../../models/bikes/bikeListFilter';
import { BikeAuthContext } from '../../../models/bikes/bikeAuthContext';
import { PagingInfo } from '../../../models/shared/pagingInfo';
import { WebApiResult } from '../../../models/shared/webApiResult';
import { RootState } from '../../state/rootState';
import { WebApiServiceActions } from '../../actions/shared/webApiServiceActions';
import { AuthServiceActions } from '../../actions/security/authServiceActions';
import { Location } from '../../../models/master/location';
import { BikeFormData } from '../../../models/bikes/bikeFormData';
import { BikeModelsActions } from '../bikes/bikeModelsActions';
import { ColorsActions } from '../master/colorsActions';
import { AppUser } from '../../../models/security/appUser';

const serviceUrl = {
    getList: (filter: BikeListFilter, paging: PagingInfo, currentLocation: Location | null) =>
        "api/bikes?" +
        "filter=" + encodeURI(JSON.stringify(filter)) +
        "&paging=" + encodeURI(JSON.stringify(paging)) +
        (TypeHelper.isNullOrEmpty(currentLocation) ? "" : ("&currentLocation=" + encodeURI(JSON.stringify(currentLocation))))
    ,
    getById: (bikeId: number) => "api/bikes/" + encodeURI(bikeId.toString()),
    post: () => "api/bikes",
    put: (bikeId: number) => "api/bikes/" + encodeURI(bikeId.toString()),
    delete: (bikeId: number) => "api/bikes/" + encodeURI(bikeId.toString())
};

export type BikesActionsPayload = BikesActionsPayload_PostPutDelete | BikesActionsPayload_SetListData | BikesActionsPayload_SetFormData;

export class BikesActionsPayload_PostPutDelete {
    public readonly bikeId: number;
    public readonly bike: Bike | null;
}

export class BikesActionsPayload_SetListData {
    public readonly listFilter: BikeListFilter;
    public readonly listPaging: PagingInfo;
    public readonly listData: BikeListData;
    public readonly currentLocation: Location | null;
}

export class BikesActionsPayload_SetFormData {
    public readonly bikeId: number;
    public readonly formData: BikeFormData;
}

export class BikesActions {

    public static getList(
        allowCachedData: boolean,
        filter: BikeListFilter,
        paging: PagingInfo,
        currentLocation: Location | null,
        onSuccess: (data: BikeListData) => void
    ): StoreActionThunk {
        
        return (dispatch, getState) => {
            if (allowCachedData) {
                var data = getState().bikes;
                
                if (// filter is matching?
                    PagingInfo.CompareOrdering(data.listPaging, paging) &&
                    JSON.stringify(data.listFilter) === JSON.stringify(filter) &&
                    Location.compare(data.currentLocation, currentLocation)
                    &&
                    // page is already loaded?
                    !TypeHelper.isNullOrEmpty(data.listItems) &&
                    !TypeHelper.isNullOrEmpty(paging.RowCount) &&
                    data.listItems.length >= paging.FirstRow + paging.RowCount &&
                    ArrayHelper.all(data.listItems, t => !TypeHelper.isNullOrEmpty(t), paging.FirstRow, paging.FirstRow + paging.RowCount - 1)
                ) {
                    // return from store (full match)                   
                    onSuccess({
                        List: data.listItems.slice(paging.FirstRow, paging.FirstRow + paging.RowCount - 1),
                        TotalRowCount: data.totalRowCount
                    });
                } else {
                    // return from server (updates store) -- no partial match here now 
                    dispatch(BikesActions.getList(false, filter, paging, currentLocation, onSuccess));
                }
            }
            else {
                dispatch(WebApiServiceActions.get<BikeListData>(
                    serviceUrl.getList(filter, paging, currentLocation),
                    result => {
                        dispatch(BikesActions.setListData(filter, paging, currentLocation, result));
                        onSuccess(result);
                    }
                ));
            }
        }
    }

    private static setListData(filter: BikeListFilter, paging: PagingInfo, currentLocation: Location | null, data: BikeListData): StoreAction<BikesActionsPayload_SetListData> {
        return {
            type: StoreActionType.Bikes_SetListData,
            payload: {
                listFilter: filter,
                listPaging: paging,
                currentLocation: currentLocation,
                listData: data
            }
        };
    }

    public static getById(allowCachedData: boolean, bikeId: number, onSuccess: (data: BikeFormData) => void): StoreActionThunk {
        
        return (dispatch, getState) => {
            if (allowCachedData) {
                var data = getState().bikes.formData[bikeId];

                if (!TypeHelper.isNullOrEmpty(data)) {
                    // return from store
                    onSuccess(data);
                } else {
                    // return from server (updates store)
                    dispatch(BikesActions.getById(false, bikeId, onSuccess));
                }
            }
            else {
                dispatch(WebApiServiceActions.get<BikeFormData>(
                    serviceUrl.getById(bikeId),
                    result => {
                        dispatch(BikesActions.setFormData(result));
                        onSuccess(result);
                    }
                ));
            }
        }
    }

    private static setFormData(data: BikeFormData): StoreAction<BikesActionsPayload_SetFormData> {
        return {
            type: StoreActionType.Bikes_SetFormData,
            payload: {
                bikeId: data.Bike.BikeId,
                formData: data
            }
        };
    }

    private static clearState(): StoreAction<BikesActionsPayload> {
        return {
            type: StoreActionType.Bikes_ClearState,
            payload: null
        };
    }

    public static invalidateRelevantCaches(): StoreActionThunk {

        return (dispatch, getState) => {
            dispatch(BikesActions.clearState());

            dispatch(ColorsActions.invalidateRelevantCaches());
            dispatch(BikeModelsActions.invalidateRelevantCaches());
        };
    }

    public static post(bike: Bike, addLastAntiforgeryToken: boolean, onSuccess: () => void): StoreActionThunk{
        
        return (dispatch, getState) => {
            dispatch(WebApiServiceActions.post(
                serviceUrl.post(),
                bike,
                addLastAntiforgeryToken,
                () => {
                    dispatch(BikesActions.postSuccess(bike));
                    onSuccess();
                }
            ));
        };
    }

    private static postSuccess(bike: Bike): StoreAction<BikesActionsPayload_PostPutDelete> {
        return {
            type: StoreActionType.Bikes_PostSuccess,
            payload: {
                bikeId: bike.BikeId,
                bike: bike
            }
        };
    }

    public static put(bike: Bike, addLastAntiforgeryToken: boolean, onSuccess: () => void)
        : StoreActionThunk {
        
        return (dispatch, getState) => {
            dispatch(WebApiServiceActions.put(
                serviceUrl.put(bike.BikeId),
                bike,
                addLastAntiforgeryToken,
                () => {
                    dispatch(BikesActions.putSuccess(bike));
                    onSuccess();
                }
            ));
        };
    }

    private static putSuccess(bike: Bike): StoreAction<BikesActionsPayload_PostPutDelete> {
        return {
            type: StoreActionType.Bikes_PutSuccess,
            payload: {
                bikeId: bike.BikeId,
                bike: bike
            }
        };
    }

    public static delete(bikeId: number, addLastAntiforgeryToken: boolean, onSuccess: () => void): StoreActionThunk {
        
        return (dispatch, getState) => {
            dispatch(WebApiServiceActions.delete(
                serviceUrl.delete(bikeId),
                addLastAntiforgeryToken,
                () => {
                    dispatch(BikesActions.deleteSuccess(bikeId));
                    onSuccess();
                }
            ));
        };
    }

    private static deleteSuccess(bikeId: number): StoreAction<BikesActionsPayload_PostPutDelete> {
        return {
            type: StoreActionType.Bikes_DeleteSuccess,
            payload: {
                bikeId: bikeId,
                bike: null
            }
        };
    }

    private static authorizeAny(
        demandAuthenticated: boolean,
        demandPermission?: Permission | Permission[] | undefined | null,
        allPermissions?: boolean | undefined | null,
        onSuccess?: ((authContext: BikeAuthContext) => void) | undefined | null,
        onError?: (error: WebApiResult<ErrorDetails>) => void
    ): StoreActionThunk {

        return (dispatch, getState) => {
            dispatch(AuthServiceActions.authorize(demandAuthenticated, demandPermission, allPermissions, false, 
                user => {
                    if (!TypeHelper.isNullOrEmpty(onSuccess))
                        onSuccess({
                            currentUser: user,
                            currentUserId: user.UserId,
                            canManage: AppUser.hasPermission(user, Permission.Bike_Management),
                            canRent: AppUser.hasPermission(user, Permission.BikeRents_ManageOwn),
                            canViewRents: AppUser.hasPermission(user, Permission.BikeRents_ViewAll)
                        });
                },
                error => {
                    if (!TypeHelper.isNullOrEmpty(onError))
                        onError(error);
                }));
        };
    }

    public static authorizeList(
        onSuccess?: ((authContext: BikeAuthContext) => void) | undefined | null,
        onError?: (error: WebApiResult<ErrorDetails>) => void
    ): StoreActionThunk {
        
        return (dispatch, getState) => {
            dispatch(BikesActions.authorizeAny(true, [Permission.Bike_ViewAll, Permission.Bike_Management], false, onSuccess, onError));
        };
    }

    //public authorizeEdit(
    //    bikeId: string,
    //    isNewBike: boolean,
    //    onSuccess?: ((authContext: BikeAuthContext) => void) | undefined | null,
    //    onError?: (error: WebApiResult<ErrorDetails>) => void
    //): (dispatch: (action: IStoreAction | ((action: any) => void)) => void) => void {
    //    var self = this;
    //    return (dispatch, getState) => {
    //        if (isNewBike) {
    //            dispatch(self.authorizeAny(true, Permission.Bike_Management, false, onSuccess, onError));
    //        } else {
    //            dispatch(self.store.actions.authService.authorize(true, [Permission.Bike_EditProfile, Permission.Bike_Management], false,
    //                bike => {
    //                    // own profile? 
    //                    var perm = bike.BikeId === bikeId ? Permission.BikeRents_ManageOwn : Permission.Bike_Management;
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