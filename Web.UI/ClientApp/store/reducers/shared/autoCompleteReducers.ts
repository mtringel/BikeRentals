import { AutoCompleteState } from "../../state/shared/autoCompleteState";
import { StoreAction } from "../../actions/storeAction";
import { AutoCompleteActionsPayload, AutoCompleteActionsPayload_SetListData } from "../../actions/shared/autoCompleteActions";
import { StoreActionType } from "../../actions/storeActionType";
import { ArrayHelper } from "../../../helpers/arrayHelper";
import { TypeHelper } from "../../../helpers/typeHelper";

export const AutoCompleteReducers: (state: AutoCompleteState, action: StoreAction<AutoCompleteActionsPayload>) => AutoCompleteState =
    (state = new AutoCompleteState(), action) => {

        switch (action.type) {
            case StoreActionType.AutoComplete_SetListData: {
                let payload = action.payload as AutoCompleteActionsPayload_SetListData;

                return {
                    data: ArrayHelper.addToDict(
                        state.data,
                        payload.type.toString(),
                        t => ArrayHelper.addToDict(TypeHelper.notNullOrEmpty(t, {}), payload.filter, t2 => payload.data.List)
                    )
                };
            }

            case StoreActionType.AutoComplete_ClearState:
                return new AutoCompleteState();

            default:
                return state;
        }
    };