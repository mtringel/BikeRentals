import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { BikeModelsState } from '../../state/bikes/bikeModelsState';
import { BikeModel } from '../../../models/bikes/bikeModel';
import { BikeModelsActionsPayload } from '../../actions/bikes/bikeModelsActions';

export const BikeModelsReducers: (state: BikeModelsState, action: StoreAction<BikeModelsActionsPayload>) => BikeModelsState =
    (state = new BikeModelsState(), action) => {

        switch (action.type) {
            case StoreActionType.BikeModels_SetListData:
                return { bikeModels: action.payload.bikeModels };

            case StoreActionType.BikeModels_ClearState:
                return new BikeModelsState();

            default:
                return state;
        }
    };