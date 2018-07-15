import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { BikesState } from '../../state/bikes/bikesState';
import { BikesActionsPayload } from '../../actions/bikes/bikesActions';
import { TypeHelper } from '../../../helpers/typeHelper';
import { BikeListFilter } from '../../../models/bikes/bikeListFilter';
import { PagingInfo } from '../../../models/shared/pagingInfo';
import { StringHelper } from '../../../helpers/stringHelper';
import { Location } from '../../../models/master/location';

export const BikesReducers: (state: BikesState, action: StoreAction<BikesActionsPayload>) => BikesState =
    (state = new BikesState(), action) => {

        switch (action.type) {
            case StoreActionType.Bikes_SetListData:
                // same ordering and filter?
                // pages can be cached
                if (PagingInfo.CompareOrdering(action.payload.bikesPaging, state.bikesPaging) &&
                    JSON.stringify(action.payload.bikesFilter) === JSON.stringify(state.bikesFilter) &&
                    Location.compare(action.payload.currentLocation, state.currentLocation)
                )
                    return {
                        ...state,
                        bikesPaging: action.payload.bikesPaging, // store paging, we need the page for navigating back and forth
                        bikes: ArrayHelper.copyTo(
                            state.bikes, // keep cached bikes, copy new page
                            TypeHelper.notNullOrEmpty(action.payload.bikesPaging.FirstRow, 0),
                            action.payload.bikes,
                            0,
                            action.payload.bikes.length
                        )
                    };
                else
                    // reload everything, invalidate whole cache
                    return {
                        ...state,
                        bikesFilter: action.payload.bikesFilter,
                        bikesPaging: action.payload.bikesPaging,
                        currentLocation: action.payload.currentLocation,
                        totalRowCount: action.payload.totalRowCount,
                        // start from empty array, copy new page
                        bikes: ArrayHelper.copyTo(
                            [],
                            TypeHelper.notNullOrEmpty(action.payload.bikesPaging.FirstRow, 0),
                            action.payload.bikes,
                            0,
                            action.payload.bikes.length
                        )
                    };

            case StoreActionType.Bikes_SetFormData:
                return {
                    ...state,
                    bikes: ArrayHelper.update(state.bikes, action.payload.bikes[0], t => t.BikeId === action.payload.bikeId)
                };

            case StoreActionType.BikeModels_ClearState:
                return {
                    bikesFilter: undefined,
                    bikesPaging: undefined,
                    currentLocation: undefined,
                    totalRowCount: undefined,
                    bikes: []
                };

            case StoreActionType.Bikes_PostSuccess:
                return {
                    ...state,
                    bikes: ArrayHelper.add(state.bikes, action.payload.bikes[0])
                };

            case StoreActionType.Bikes_DeleteSuccess:
                return {
                    ...state,
                    bikes: ArrayHelper.remove(state.bikes, t => t.BikeId === action.payload.bikeId)
                };

            case StoreActionType.Bikes_PutSuccess:
                
                return {
                    ...state,
                    bikes: ArrayHelper.update(state.bikes, action.payload.bikes[0], t => t.BikeId === action.payload.bikeId)
                };

            default:
                return state;
        }
    };