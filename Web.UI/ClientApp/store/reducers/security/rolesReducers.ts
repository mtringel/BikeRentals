import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { RolesState } from '../../state/security/rolesState';
import { KeyValuePair } from '../../../models/shared/keyValuePair';
import { RoleType } from '../../../models/security/roleType';
import { RolesActionsPayload } from '../../actions/security/rolesActions';

export const RolesReducers: (state: RolesState, action: StoreAction<RolesActionsPayload>) => RolesState =
    (state = new RolesState(), action) => {
        
        switch (action.type) {
            case StoreActionType.Roles_SetListData:
                return { roles: action.payload.roles };

            case StoreActionType.Roles_ClearState:
                return { roles: null };

            default:
                return state;
        }
    };