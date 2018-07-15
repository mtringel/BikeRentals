import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { FormValidatorState } from '../../state/shared/formValidatorState';
import { FormValidatorActionsPayload } from '../../actions/shared/formValidatorActions';

export const FormValidatorReducers: (state: FormValidatorState, action: StoreAction<Partial<FormValidatorActionsPayload>>) => FormValidatorState =
    (state = new FormValidatorState(), action) => {
        
        switch (action.type) {
            case StoreActionType.FormValidator_SetErrors:
                return {
                    errors: action.payload.errors
                };

            default:
                return state;
        }
    };