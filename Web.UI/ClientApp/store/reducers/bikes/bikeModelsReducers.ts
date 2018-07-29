import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { BikeModelsState } from '../../state/bikes/bikeModelsState';
import { BikeModel } from '../../../models/bikes/bikeModel';
import { BikeModelsActionsPayload } from '../../actions/bikes/bikeModelsActions';
import { DateHelper } from '../../../helpers/dateHelper';
import { TypeHelper } from '../../../helpers/typeHelper';

export const BikeModelsReducers: (state: BikeModelsState, action: StoreAction<BikeModelsActionsPayload>) => BikeModelsState =
    (state = new BikeModelsState(), action) => {

        switch (action.type) {
            case StoreActionType.BikeModels_SetListData:
                return {
                    ...state,
                    cache: state.cache.setListData(state.cache.EmptyFilter, action.payload.listData),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };

            case StoreActionType.BikeModels_ClearState:
                return new BikeModelsState();

            default:
                return state;
        }
    };