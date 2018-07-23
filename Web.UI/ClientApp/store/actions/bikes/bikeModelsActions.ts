import { StoreAction, IStoreAction, StoreActionThunk } from '../storeAction';
import { StoreActionType } from '../storeActionType';
import { KeyValuePair } from '../../../models/shared/keyValuePair';
import { RoleType } from '../../../models/security/roleType';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { BikeModel } from '../../../models/bikes/bikeModel';
import { BikeModelsState } from '../../state/bikes/bikeModelsState';
import { BikeModelListData } from '../../../models/bikes/bikeModelListData';
import { RootState } from '../../state/rootState';
import { WebApiServiceActions } from '../../actions/shared/webApiServiceActions';

const ServiceUrl = "api/bikeModels";

export class BikeModelsActionsPayload {
    public readonly bikeModels: BikeModel[];
}

export class BikeModelsActions {

    public static getList(allowCachedData: boolean, onSuccess: (data: BikeModelListData) => void): StoreActionThunk {
        
        return (dispatch, getState) => {
            if (allowCachedData) {
                var data = getState().bikeModels.bikeModels;

                if (!ArrayHelper.isNullOrEmpty(data)) {
                    // return from store
                    onSuccess({ List: data });
                } else {
                    // return from server (updates store)
                    dispatch(BikeModelsActions.getList(false, onSuccess));
                }
            }
            else {
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
                bikeModels: data.List
            }
        };
    }

    private static clearState(): StoreAction<BikeModelsActionsPayload> {
        return {
            type: StoreActionType.BikeModels_ClearState,
            payload: null
        };
    }

    public static invalidateRelevantCaches(): StoreActionThunk {

        return (dispatch, getState) => {
            dispatch(BikeModelsActions.clearState());
        };
    }
}