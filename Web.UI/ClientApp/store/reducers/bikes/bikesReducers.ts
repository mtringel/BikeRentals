import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { BikesState } from '../../state/bikes/bikesState';
import { BikesActionsPayload, BikesActionsPayload_SetListData, BikesActionsPayload_SetFormData, BikesActionsPayload_PostPutDelete } from '../../actions/bikes/bikesActions';
import { TypeHelper } from '../../../helpers/typeHelper';
import { BikeListFilter } from '../../../models/bikes/bikeListFilter';
import { PagingInfo } from '../../../models/shared/pagingInfo';
import { StringHelper } from '../../../helpers/stringHelper';
import { Location } from '../../../models/master/location';

export const BikesReducers: (state: BikesState, action: StoreAction<BikesActionsPayload>) => BikesState =
    (state = new BikesState(), action) => {

        switch (action.type) {
            case StoreActionType.Bikes_SetListData: {
                let payload = action.payload as BikesActionsPayload_SetListData;

                // same ordering and filter?
                // pages can be cached
                if (PagingInfo.CompareOrdering(payload.listPaging, state.listPaging) &&
                    JSON.stringify(payload.listFilter) === JSON.stringify(state.listFilter) &&
                    Location.compare(payload.currentLocation, state.currentLocation)
                )
                    return {
                        ...state,
                        listPaging: payload.listPaging, // store paging, we need the page for navigating back and forth
                        listItems: ArrayHelper.copyTo(
                            state.listItems, // keep cached bikes, copy new page
                            TypeHelper.notNullOrEmpty(payload.listPaging.FirstRow, 0),
                            payload.listData.List,
                            0,
                            payload.listData.List.length
                        )
                    };
                else
                    // reload everything, invalidate whole cache
                    return {
                        ...state,
                        listFilter: payload.listFilter,
                        listPaging: payload.listPaging,
                        currentLocation: payload.currentLocation,
                        totalRowCount: payload.listData.TotalRowCount,
                        // start from empty array, copy new page
                        listItems: ArrayHelper.copyTo(
                            [],
                            TypeHelper.notNullOrEmpty(payload.listPaging.FirstRow, 0),
                            payload.listData.List,
                            0,
                            payload.listData.List.length
                        )
                    };
            }

            case StoreActionType.Bikes_SetFormData: {
                let payload = action.payload as BikesActionsPayload_SetFormData;

                return {
                    ...state,
                    formData: ArrayHelper.addToDict(state.formData, payload.bikeId.toString(), t => payload.formData),
                    listItems: ArrayHelper.update(state.listItems, payload.formData.Bike, t => t.BikeId === payload.bikeId)
                };
            }

            case StoreActionType.Bikes_ClearState:
                return new BikesState();

            case StoreActionType.Bikes_PostSuccess: {
                var payload = action.payload as BikesActionsPayload_PostPutDelete;

                return {
                    ...state,
                    listItems: ArrayHelper.add(state.listItems, payload.bike)
                };
            }

            case StoreActionType.Bikes_DeleteSuccess: {
                var payload = action.payload as BikesActionsPayload_PostPutDelete;

                return {
                    ...state,
                    listItems: ArrayHelper.remove(state.listItems, t => t.BikeId === payload.bikeId)
                };
            }

            case StoreActionType.Bikes_PutSuccess: {
                var payload = action.payload as BikesActionsPayload_PostPutDelete;

                return {
                    ...state,
                    listItems: ArrayHelper.update(state.listItems, payload.bike, t => t.BikeId === payload.bikeId)
                };
            }

            default:
                return state;
        }
    };