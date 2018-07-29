
import { StoreAction, IStoreAction, StoreActionThunk } from '../storeAction';
import { StoreActionType } from '../storeActionType';
import { KeyValuePair } from '../../../models/shared/keyValuePair';
import { RoleType } from '../../../models/security/roleType';
import { Store } from '../../store';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { Color } from '../../../models/master/color';
import { ColorsState } from '../../state/master/colorsState';
import { ColorListData } from '../../../models/master/colorListData';
import { RootState } from '../../state/rootState';
import { WebApiServiceActions } from '../../actions/shared/webApiServiceActions';
import { TypeHelper } from '../../../helpers/typeHelper';
import { DateHelper } from '../../../helpers/dateHelper';

const ServiceUrl = "api/colors";

export class ColorsActionsPayload {
    public readonly listData: ColorListData;
}

export class ColorsActions {

    public static getList(allowCachedData: boolean, onSuccess: (data: ColorListData) => void): StoreActionThunk {

        return (dispatch, getState) => {
            var rootState = getState();
            var state = rootState.colors;
            var data = allowCachedData ? state.cache.getListData(state.cache.EmptyFilter) : null;

            if (!TypeHelper.isNullOrEmpty(data)) {
                // return from store
                onSuccess(data);
            } else {
                // load from server
                dispatch(WebApiServiceActions.get<ColorListData>(
                    ServiceUrl,
                    result => {
                        dispatch(ColorsActions.setListData(result));
                        onSuccess(result);
                    }));
            }
        }
    }

    private static setListData(data: ColorListData): StoreAction<Partial<ColorsActionsPayload>> {
        return {
            type: StoreActionType.Colors_SetListData,
            payload: {
                listData: data
            }
        };
    }

    public static clearState(): StoreAction<ColorsActionsPayload> {
        return {
            type: StoreActionType.Colors_ClearState,
            payload: null
        };
    }


    public static clearStateIfExpired(): StoreActionThunk {

        return (dispatch, getState) => {
            var rootState = getState();
            var state = rootState.colors;

            if (TypeHelper.isNullOrEmpty(state.timestamp) || DateHelper.dateDiffInDays(state.timestamp, DateHelper.now()) >= rootState.clientContext.globals.ClientCacheDurationInMinutes)
                dispatch(ColorsActions.clearState());
        };
    }
}