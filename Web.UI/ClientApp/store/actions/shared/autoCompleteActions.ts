import { StringHelper } from "../../../helpers/stringHelper";
import { AutoCompleteType } from "../../../models/shared/autoCompleteType";
import { TypeHelper } from "../../../helpers/typeHelper";
import { AutoCompleteListData } from "../../../models/shared/autoCompleteListData";
import { StoreActionThunk, StoreAction } from "../storeAction";
import { StoreActionType } from "../storeActionType";
import { WebApiServiceActions } from "../shared/webApiServiceActions";

const serviceUrl = {
    getList: (type: AutoCompleteType, filter: string) =>
        "api/autocomplete" +
        "?type=" + encodeURI(TypeHelper.toString(type)) +
        "&filter=" + encodeURI(StringHelper.notNullOrEmpty(filter, ""))
};

export type AutoCompleteActionsPayload = AutoCompleteActionsPayload_SetListData;

export class AutoCompleteActionsPayload_SetListData {
    public readonly type: AutoCompleteType;
    public readonly listFilter: string;
    public readonly listData: AutoCompleteListData;
}

export class AutoCompleteActions {

    public static getList(allowCachedData: boolean, type: AutoCompleteType, filter: string, onSuccess: (data: AutoCompleteListData) => void): StoreActionThunk {

        return (dispatch, getState) => {
            var rootState = getState();
            var context = rootState.clientContext;

            if (allowCachedData) {
                var data = rootState.autoComplete.data[type.toString()];
                var hasData = !TypeHelper.isNullOrEmpty(data) && !TypeHelper.isNullOrEmpty(data.items);

                if (hasData && data.listFilter === filter) {

                    // return from store (full match)
                    onSuccess({ List: data.items });

                } else if (hasData  && StringHelper.contains(data.listFilter, filter, true)) {

                    // return from store (partial match)
                    var match = data.items.filter(t => StringHelper.contains(t.Value, filter, true));

                    onSuccess({ List: match.slice(0, context.globals.AutoCompleteMaxRows) });
                }
                else {
                    // return from server (updates store)
                    dispatch(AutoCompleteActions.getList(false, type, filter, onSuccess));
                }
            }
            else {
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
                listFilter: filter,
                listData: data
            }
        };
    }

    private static clearState(): StoreAction<AutoCompleteActionsPayload> {
        return {
            type: StoreActionType.AutoComplete_ClearState,
            payload: null
        };
    }

    public static invalidateRelevantCaches(): StoreActionThunk {
        {
            return (dispatch, getState) => {
                dispatch(AutoCompleteActions.clearState());
            };
        }
    }

}