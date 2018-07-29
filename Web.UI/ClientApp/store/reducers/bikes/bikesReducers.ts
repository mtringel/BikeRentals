import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { BikesState } from '../../state/bikes/bikesState';
import { BikesActionsPayload, BikesActionsPayload_SetListData, BikesActionsPayload_SetFormData, BikesActionsPayload_PostPutDelete } from '../../actions/bikes/bikesActions';
import { BikeListFilter } from '../../../models/bikes/bikeListFilter';
import { PagingInfo } from '../../../models/shared/pagingInfo';
import { TypeHelper } from '../../../helpers/typeHelper';
import { DateHelper } from '../../../helpers/dateHelper';

export const BikesReducers: (state: BikesState, action: StoreAction<BikesActionsPayload>) => BikesState =
    (state = new BikesState(), action) => {

        switch (action.type) {
            case StoreActionType.Bikes_SetListData: {
                let payload = action.payload as BikesActionsPayload_SetListData;

                return {
                    ...state,
                    listFilter: payload.listFilter,
                    listPaging: payload.listPaging,   
                    currentLocation: payload.currentLocation,
                    //
                    listCache: state.listCache.setListData({ ...payload.listFilter, ...payload.listPaging }, payload.listData), // the key is the union of filter and paging
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.Bikes_SetFormData: {
                let payload = action.payload as BikesActionsPayload_SetFormData;

                return {
                    ...state,
                    listCache: state.listCache.setFormData(payload.formData.Bike),
                    formCache: state.formCache.setFormData(payload.formData),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.Bikes_ClearState:
                return new BikesState();

            case StoreActionType.Bikes_PostSuccess: {
                var payload = action.payload as BikesActionsPayload_PostPutDelete;

                return {
                    ...state,
                    listCache: state.listCache.postSuccess(payload.bike, { ...state.listFilter, ...state.listPaging }),
                    formCache: state.formCache.postSuccess(payload.bike),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.Bikes_DeleteSuccess: {
                var payload = action.payload as BikesActionsPayload_PostPutDelete;

                return {
                    ...state,
                    listCache: state.listCache.deleteSuccess(payload.bikeId),
                    formCache: state.formCache.deleteSuccess(payload.bikeId),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.Bikes_PutSuccess: {
                var payload = action.payload as BikesActionsPayload_PostPutDelete;

                return {
                    ...state,
                    listCache: state.listCache.putSuccess(payload.bike),
                    formCache: state.formCache.putSuccess(payload.bike),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            default:
                return state;
        }
    };