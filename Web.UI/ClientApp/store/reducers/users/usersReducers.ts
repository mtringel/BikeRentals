import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { UsersState } from '../../state/users/usersState';
import { UsersActionsPayload } from '../../actions/users/usersActions';
import { TypeHelper } from '../../../helpers/typeHelper';

export const UsersReducers: (state: UsersState, action: StoreAction<UsersActionsPayload>) => UsersState =
    (state = new UsersState(), action) => {

        switch (action.type) {
            case StoreActionType.Users_SetListData:
                return {
                    users: action.payload.users,
                    usersFilter: action.payload.usersFilter,
                    tooMuchData: action.payload.tooMuchData
                };

            case StoreActionType.Users_SetFormData:
                if (TypeHelper.isNullOrEmpty(action.payload.userId))
                    return state;
                else
                    return {
                        ...state,
                        users: ArrayHelper.update(state.users, action.payload.users[0], t => t.UserId === action.payload.userId),
                    };

            case StoreActionType.Users_ClearState:
                return {
                    users: [],
                    usersFilter: null,
                    tooMuchData: false
                };

            case StoreActionType.Users_PostSuccess:
                return {
                    ...state,
                    users: ArrayHelper.add(state.users, action.payload.users[0]),
                };

            case StoreActionType.Users_DeleteSuccess:
                return {
                    ...state,
                    users: ArrayHelper.remove(state.users, t => t.UserId === action.payload.userId),
                };

            case StoreActionType.Users_PutSuccess:
                
                return {
                    ...state,
                    users: ArrayHelper.update(state.users, action.payload.users[0], t => t.UserId === action.payload.userId),
                };

            default:
                return state;
        }
    };