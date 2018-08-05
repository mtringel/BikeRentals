import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { BikeRentsState } from '../../state/rents/bikeRentsState';
import { BikeRentsActionsPayload, BikeRentsActionsPayload_SetListData, BikeRentsActionsPayload_SetFormData, BikeRentsActionsPayload_PostPutDelete, BikeRentsActionsPayload_UseBikeId } from '../../actions/rents/bikeRentsActions';
import { BikeRentListFilter } from '../../../models/rents/bikeRentListFilter';
import { PagingInfo } from '../../../models/shared/pagingInfo';
import { TypeHelper } from '../../../helpers/typeHelper';
import { DateHelper } from '../../../helpers/dateHelper';

export const BikeRentsReducers: (state: BikeRentsState, action: StoreAction<BikeRentsActionsPayload>) => BikeRentsState =
    (state = new BikeRentsState(), action) => {

        switch (action.type) {
            case StoreActionType.BikeRents_SetListData: {
                let payload = action.payload as BikeRentsActionsPayload_SetListData;

                return {
                    ...state,
                    listFilter: payload.listFilter,
                    listPaging: payload.listPaging,
                    listCache: state.listCache.setListData({ ...payload.listFilter, ...payload.listPaging }, payload.listData), // the key is the union of filter and paging
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.BikeRents_SetFormData: {
                let payload = action.payload as BikeRentsActionsPayload_SetFormData;

                return {
                    ...state,
                    listCache: state.listCache.setFormData(payload.formData.BikeRent),
                    formCache: state.formCache.setFormData(payload.formData),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.BikeRents_ClearState:
                return new BikeRentsState();

            case StoreActionType.Bikes_PostSuccess: {
                let payload = action.payload as BikeRentsActionsPayload_PostPutDelete;

                return {
                    ...state,
                    listCache: state.listCache.postSuccess(payload.bikeRent, { ...state.listFilter, ...state.listPaging }),
                    formCache: state.formCache.postSuccess(payload.bikeRent),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.BikeRents_DeleteSuccess: {
                let payload = action.payload as BikeRentsActionsPayload_PostPutDelete;

                return {
                    ...state,
                    listCache: state.listCache.deleteSuccess(payload.bikeRentId),
                    formCache: state.formCache.deleteSuccess(payload.bikeRentId),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.BikeRents_PutSuccess: {
                let payload = action.payload as BikeRentsActionsPayload_PostPutDelete;

                return {
                    ...state,
                    listCache: state.listCache.putSuccess(payload.bikeRent),
                    formCache: state.formCache.putSuccess(payload.bikeRent),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.BikeRents_SetUseBikeId: {
                let payload = action.payload as BikeRentsActionsPayload_UseBikeId;

                return {
                    ...state,
                    param_BikeId: payload.bikeId
                }
            }

            default:
                return state;
        }
    };