import { StringHelper } from "../../../helpers/stringHelper";
import { AutoCompleteType } from "../../../models/shared/autoCompleteType";
import { TypeHelper } from "../../../helpers/typeHelper";
import { AutoCompleteListData } from "../../../models/shared/autoCompleteListData";
import { StoreActionThunk, StoreAction } from "../storeAction";
import { StoreActionType } from "../storeActionType";
import { WebApiServiceActions } from "../shared/webApiServiceActions";
import { ArrayHelper } from "../../../helpers/arrayHelper";

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
            var context = rootState.clientContext;

            if (allowCachedData) {
                var typeData = rootState.autoComplete.data[type.toString()];

                if (!TypeHelper.isNullOrEmpty(typeData)) {
                    var filterData = typeData[filter];

                    if (!TypeHelper.isNullOrEmpty(filterData)) {
                        // return from store (full match)
                        onSuccess({
                            List: filterData
                        });
                    }
                    else {
                        var partialMatch = ArrayHelper.firstOrDefault(
                            ArrayHelper.whereMax(
                                ArrayHelper.filterDict(typeData, (key, item) => StringHelper.contains(filter, key, true)),
                                t => t.key.length
                            ));

                        // we can use already loaded sets only, if those are full sets (if truncated sets, then server reload is needed)
                        if (partialMatch !== null && partialMatch.item.length < context.globals.AutoCompleteMaxRows) {
                            // return from store (partial match)
                            onSuccess({
                                List: partialMatch.item.filter(t => StringHelper.contains(t.Value, filter, true))
                            });
                        }
                        else {
                            // no match
                            // return from server (updates store)
                            dispatch(AutoCompleteActions.getList(false, type, filter, onSuccess));
                        }
                    }
                } else {
                    // no data for type loaded
                    // return from server (updates store)
                    dispatch(AutoCompleteActions.getList(false, type, filter, onSuccess));
                }
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