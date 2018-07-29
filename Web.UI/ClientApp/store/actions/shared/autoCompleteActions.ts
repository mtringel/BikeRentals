import { StringHelper } from "../../../helpers/stringHelper";
import { AutoCompleteType } from "../../../models/shared/autoCompleteType";
import { TypeHelper } from "../../../helpers/typeHelper";
import { AutoCompleteListData } from "../../../models/shared/autoCompleteListData";
import { StoreActionThunk, StoreAction } from "../storeAction";
import { StoreActionType } from "../storeActionType";
import { WebApiServiceActions } from "../shared/webApiServiceActions";
import { ArrayHelper } from "../../../helpers/arrayHelper";
import { DateHelper } from "../../../helpers/dateHelper";

const serviceUrl = {
    getList: (type: AutoCompleteType, filter: string) =>
        "api/autocomplete" +
        "?type=" + encodeURI(TypeHelper.toString(type)) +
        "&filter=" + encodeURI(StringHelper.notNullOrEmpty(filter, ""))
};

export type AutoCompleteActionsPayload = AutoCompleteActionsPayload_SetListData;

export class AutoCompleteActionsPayload_SetListData {
    public readonly type: AutoCompleteType;
    public readonly filter: string;
    public readonly data: AutoCompleteListData;
}

export class AutoCompleteActions {

    public static getList(allowCachedData: boolean, type: AutoCompleteType, filter: string, onSuccess: (data: AutoCompleteListData) => void): StoreActionThunk {

        return (dispatch, getState) => {
            var rootState = getState();
            var state = rootState.autoComplete;
            var cache = state.cache[type.toString()];
            var data = allowCachedData && !TypeHelper.isNullOrEmpty(cache) ? cache.getListData(filter) : null;

            if (!TypeHelper.isNullOrEmpty(data)) {
                // return from store 
                onSuccess(data);
            } else {
                // no cached data allowed
                dispatch(WebApiServiceActions.get<AutoCompleteListData>(
                    serviceUrl.getList(type, filter),
                    result => {
                        dispatch(AutoCompleteActions.setListData(type, filter, result));
                        onSuccess(result);
                    }
                ));
            }
        }
    }

    private static setListData(type: AutoCompleteType, filter: string, data: AutoCompleteListData): StoreAction<AutoCompleteActionsPayload_SetListData> {
        return {
            type: StoreActionType.AutoComplete_SetListData,
            payload: {
                type: type,
                filter: filter,
                data: data
            }
        };
    }

    public static clearState(): StoreAction<AutoCompleteActionsPayload> {
        return {
            type: StoreActionType.AutoComplete_ClearState,
            payload: null
        };
    }

    public static clearStateIfExpired(): StoreActionThunk {
        return (dispatch, getState) => {
            var rootState = getState();
            var state = rootState.autoComplete;

            if (TypeHelper.isNullOrEmpty(state.timestamp) || DateHelper.dateDiffInDays(state.timestamp, DateHelper.now()) >= rootState.clientContext.globals.ClientCacheDurationInMinutes)
                dispatch(AutoCompleteActions.clearState());
        };
    }
}