import { StoreAction, IStoreAction } from '../storeAction';
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

export class BikesActionsPayload {
    public readonly bikesFilter: BikeListFilter;
    public readonly bikesPaging: PagingInfo;
    public readonly bikeId: number;
    public readonly bikes: Bike[];
    public readonly totalRowCount: number;
    public readonly currentLocation: Location | null;
}

export class BikesActions {

    public static getList(
        allowCachedData: boolean,
        filter: BikeListFilter,
        paging: PagingInfo,
        currentLocation: Location | null,
        onSuccess: (data: BikeListData) => void
    )
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {
        
        return (dispatch, getState) => {
            if (allowCachedData) {
                var data = getState().bikes;

                if (// filter is matching?
                    PagingInfo.CompareOrdering(data.bikesPaging, paging) &&
                    JSON.stringify(data.bikesFilter) === JSON.stringify(filter) &&
                    Location.compare(data.currentLocation, currentLocation)
                    &&
                    // page is already loaded?
                    !TypeHelper.isNullOrEmpty(data.bikes) &&
                    !TypeHelper.isNullOrEmpty(paging.RowCount) &&
                    data.bikes.length >= paging.FirstRow + paging.RowCount &&
                    ArrayHelper.all(data.bikes, t => !TypeHelper.isNullOrEmpty(t), paging.FirstRow, paging.FirstRow + paging.RowCount - 1)
                ) {
                    // return from store (full match)                   
                    onSuccess({
                        List: data.bikes.slice(paging.FirstRow, paging.FirstRow + paging.RowCount - 1),
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

    private static setListData(filter: BikeListFilter, paging: PagingInfo, currentLocation: Location | null, data: BikeListData): StoreAction<Partial<BikesActionsPayload>> {
        return {
            type: StoreActionType.Bikes_SetListData,
            payload: {
                bikesFilter: filter,
                bikesPaging: paging,
                currentLocation: currentLocation,
                bikes: data.List,
                totalRowCount: data.TotalRowCount
            }
        };
    }

    public static getById(allowCachedData: boolean, bikeId: number, onSuccess: (data: Bike) => void)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {
        
        return (dispatch, getState) => {
            if (allowCachedData) {
                var bike = ArrayHelper.findByPredicate(getState().bikes.bikes, t => !TypeHelper.isNullOrEmpty(t) && t.BikeId === bikeId);

                if (bike !== null) {
                    // return from store
                    onSuccess(bike);
                } else {
                    // return from server (updates store)
                    dispatch(BikesActions.getById(false, bikeId, onSuccess));
                }
            }
            else {
                dispatch(WebApiServiceActions.get<Bike>(
                    serviceUrl.getById(bikeId),
                    result => {
                        dispatch(BikesActions.setFormData(result));
                        onSuccess(result);
                    }
                ));
            }
        }
    }

    private static setFormData(data: Bike): StoreAction<Partial<BikesActionsPayload>> {
        return {
            type: StoreActionType.Bikes_SetFormData,
            payload: {
                bikeId: data.BikeId,
                bikes: [data]
            }
        };
    }

    public static clearState(): StoreAction<BikesActionsPayload> {
        return {
            type: StoreActionType.Bikes_ClearState,
            payload: null
        };
    }

    public static post(bike: Bike, addLastAntiforgeryToken: boolean, onSuccess: () => void)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void{
        
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

    private static postSuccess(bike: Bike): StoreAction<Partial<BikesActionsPayload>> {
        return {
            type: StoreActionType.Bikes_PostSuccess,
            payload: {
                bikeId: bike.BikeId,
                bikes: [bike]
            }
        };
    }

    public static put(bike: Bike, addLastAntiforgeryToken: boolean, onSuccess: () => void)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {
        
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

    private static putSuccess(bike: Bike): StoreAction<Partial<BikesActionsPayload>> {
        return {
            type: StoreActionType.Bikes_PutSuccess,
            payload: {
                bikeId: bike.BikeId,
                bikes: [bike]
            }
        };
    }

    public static delete(bikeId: number, addLastAntiforgeryToken: boolean, onSuccess: () => void)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {
        
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

    private static deleteSuccess(bikeId: number): StoreAction<Partial<BikesActionsPayload>> {
        return {
            type: StoreActionType.Bikes_DeleteSuccess,
            payload: {
                bikeId: bikeId
            }
        };
    }

    private static authorizeAny(
        demandAuthenticated: boolean,
        demandPermission?: Permission | Permission[] | undefined | null,
        allPermissions?: boolean | undefined | null,
        onSuccess?: ((authContext: BikeAuthContext) => void) | undefined | null,
        onError?: (error: WebApiResult<ErrorDetails>) => void
    ): (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {

        
        return (dispatch, getState) => {
            dispatch(AuthServiceActions.authorize(demandAuthenticated, demandPermission, allPermissions, false, 
                user => {
                    if (!TypeHelper.isNullOrEmpty(onSuccess))
                        onSuccess({
                            currentUser: user,
                            currentUserId: user.UserId
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
    ): (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {
        
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