import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { BikeRentsState } from '../../state/rents/bikeRentsState';
import { BikeRentsActionsPayload, BikeRentsActionsPayload_SetListData, BikeRentsActionsPayload_SetFormData, BikeRentsActionsPayload_PostPutDelete } from '../../actions/rents/bikeRentsActions';
import { TypeHelper } from '../../../helpers/typeHelper';
import { BikeRentListFilter } from '../../../models/rents/bikeRentListFilter';
import { PagingInfo } from '../../../models/shared/pagingInfo';

export const BikeRentsReducers: (state: BikeRentsState, action: StoreAction<BikeRentsActionsPayload>) => BikeRentsState =
    (state = new BikeRentsState(), action) => {

        switch (action.type) {
            case StoreActionType.BikeRents_SetListData: {
                let payload = action.payload as BikeRentsActionsPayload_SetListData;

                // same ordering and filter?
                // pages can be cached
                if (PagingInfo.CompareOrdering(payload.listPaging, state.listPaging) &&
                    JSON.stringify(payload.listFilter) === JSON.stringify(state.listFilter) 
                )
                    return {
                        ...state,
                        listPaging: payload.listPaging, // store paging, we need the page for navigating back and forth
                        listItems: ArrayHelper.copyTo(
                            state.listItems, // keep cached bikeRents, copy new page
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

            case StoreActionType.BikeRents_SetFormData: {
                let payload = action.payload as BikeRentsActionsPayload_SetFormData;

                return {
                    ...state,
                    formData: ArrayHelper.addToDict(state.formData, payload.bikeRentId, t => payload.formData),
                    listItems: ArrayHelper.update(state.listItems, payload.formData.BikeRent, t => t.BikeRentId === payload.bikeRentId)
                };
            }

            case StoreActionType.BikeModels_ClearState:
                return {
                    listFilter: undefined,
                    listPaging: undefined,
                    currentLocation: undefined,
                    totalRowCount: undefined,
                    listItems: [],
                    formData: {}
                };

            case StoreActionType.BikeRents_PostSuccess: {
                var payload = action.payload as BikeRentsActionsPayload_PostPutDelete;

                return {
                    ...state,
                    listItems: ArrayHelper.add(state.listItems, payload.bikeRent)
                };
            }

            case StoreActionType.BikeRents_DeleteSuccess: {
                var payload = action.payload as BikeRentsActionsPayload_PostPutDelete;

                return {
                    ...state,
                    listItems: ArrayHelper.remove(state.listItems, t => t.BikeRentId === payload.bikeRentId)
                };
            }

            case StoreActionType.BikeRents_PutSuccess: {
                var payload = action.payload as BikeRentsActionsPayload_PostPutDelete;

                return {
                    ...state,
                    listItems: ArrayHelper.update(state.listItems, payload.bikeRent, t => t.BikeRentId === payload.bikeRentId)
                };
            }

            default:
                return state;
        }
    };