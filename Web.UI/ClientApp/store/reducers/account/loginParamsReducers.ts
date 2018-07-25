import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { LoginParamsState } from '../../state/account/loginParamsState';
import { LoginParamsActionsPayload } from '../../actions/account/loginParamsActions';

export const LoginParamsReducers: (state: LoginParamsState, action: StoreAction<LoginParamsActionsPayload>) => LoginParamsState =
    (state = new LoginParamsState(), action) => {

        switch (action.type) {
            case StoreActionType.LoginParams_SetReturnUrl:
                return {
                    ...state,
                    useReturnUrl: action.payload.returnUrl
                };

            case StoreActionType.LoginParams_SetDefaultEmail:
                return {
                    ...state,
                    useDefaultEmail: action.payload.defaultEmail
                };

            default:
                return state;
        }
    };