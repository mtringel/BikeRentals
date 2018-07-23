import { AutoCompleteState } from "../../state/shared/autoCompleteState";
import { StoreAction } from "../../actions/storeAction";
import { AutoCompleteActionsPayload, AutoCompleteActionsPayload_SetListData } from "../../actions/shared/autoCompleteActions";
import { StoreActionType } from "../../actions/storeActionType";
import { ArrayHelper } from "../../../helpers/arrayHelper";

export const AutoCompleteReducers: (state: AutoCompleteState, action: StoreAction<AutoCompleteActionsPayload>) => AutoCompleteState =
    (state = new AutoCompleteState(), action) => {

        switch (action.type) {
            case StoreActionType.AutoComplete_SetListData: {
                let payload = action.payload as AutoCompleteActionsPayload_SetListData;

                return {
                    data: ArrayHelper.addToDict(state.data, payload.type.toString(), t => { return { listFilter: payload.listFilter, items: payload.listData.List }; })
                };
            }

            case StoreActionType.AutoComplete_ClearState:
                return {
                    data: {}
                };

            default:
                return state;
        }
    };