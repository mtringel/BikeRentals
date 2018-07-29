import { StoreAction, IStoreAction, StoreActionThunk } from '../storeAction';
import { StoreActionType } from '../storeActionType';
import { BikeModel } from '../../../models/bikes/bikeModel';
import { BikeModelsState } from '../../state/bikes/bikeModelsState';
import { BikeModelListData } from '../../../models/bikes/bikeModelListData';
import { RootState } from '../../state/rootState';
import { WebApiServiceActions } from '../../actions/shared/webApiServiceActions';
import { TypeHelper } from '../../../helpers/typeHelper';
import { DateHelper } from '../../../helpers/dateHelper';

const ServiceUrl = "api/bikeModels";

export class BikeModelsActionsPayload {
    public readonly listData: BikeModelListData;
}

export class BikeModelsActions {

    public static getList(allowCachedData: boolean, onSuccess: (data: BikeModelListData) => void): StoreActionThunk {

        return (dispatch, getState) => {
            var rootState = getState();
            var state = rootState.bikeModels;
            var data = allowCachedData ? state.cache.getListData(state.cache.EmptyFilter) : null;

            if (!TypeHelper.isNullOrEmpty(data)) {
                // return from store
                onSuccess(data);
            } else {
                // return from server
                dispatch(WebApiServiceActions.get<BikeModelListData>(
                    ServiceUrl,
                    result => {
                        dispatch(BikeModelsActions.setListData(result));
                        onSuccess(result);
                    }));
            }
        }
    }

    private static setListData(data: BikeModelListData): StoreAction<Partial<BikeModelsActionsPayload>> {
        return {
            type: StoreActionType.BikeModels_SetListData,
            payload: {
                listData: data
            }
        };
    }

    public static clearState(): StoreAction<BikeModelsActionsPayload> {
        return {
            type: StoreActionType.BikeModels_ClearState,
            payload: null
        };
    }

    public static clearStateIfExpired(): StoreActionThunk {
        return (dispatch, getState) => {
            var rootState = getState();
            var state = rootState.bikeModels;

            if (TypeHelper.isNullOrEmpty(state.timestamp) || DateHelper.dateDiffInDays(state.timestamp, DateHelper.now()) >= rootState.clientContext.globals.ClientCacheDurationInMinutes)
                dispatch(BikeModelsActions.clearState());
        };
    }
}