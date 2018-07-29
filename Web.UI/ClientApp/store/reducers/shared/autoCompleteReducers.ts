import { AutoCompleteState } from "../../state/shared/autoCompleteState";
import { StoreAction } from "../../actions/storeAction";
import { AutoCompleteActionsPayload, AutoCompleteActionsPayload_SetListData } from "../../actions/shared/autoCompleteActions";
import { StoreActionType } from "../../actions/storeActionType";
import { TypeHelper } from "../../../helpers/typeHelper";
import { DateHelper } from "../../../helpers/dateHelper";
import { ArrayHelper } from "../../../helpers/arrayHelper";

export const AutoCompleteReducers: (state: AutoCompleteState, action: StoreAction<AutoCompleteActionsPayload>) => AutoCompleteState =
    (state = new AutoCompleteState(), action) => {

        switch (action.type) {
            case StoreActionType.AutoComplete_SetListData: {
                let payload = action.payload as AutoCompleteActionsPayload_SetListData;

                return {
                    ...state,
                    cache: ArrayHelper.addOrUpdateDict(
                        state.cache,
                        payload.type.toString(),
                        t => AutoCompleteState.getCache(t).setListData(payload.filter, payload.data)
                    ),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.AutoComplete_ClearState:
                return new AutoCompleteState();

            default:
                return state;
        }
    };