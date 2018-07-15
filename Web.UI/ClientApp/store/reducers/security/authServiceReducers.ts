import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { AuthServiceActionsPayload } from '../../actions/security/authServiceActions';
import { AuthServiceState } from '../../state/security/authServiceState';

export const AuthServiceReducers: (state: AuthServiceState, action: StoreAction<Partial<AuthServiceActionsPayload>>) => AuthServiceState =
    (state = new AuthServiceState(), action) => {
        
        switch (action.type) {
            case StoreActionType.AuthService_SetCurrentUserSuccess:
                return {
                    ...state,
                    currentUser: action.payload.currentUser
                };

            default:
                return state;
        }
    };