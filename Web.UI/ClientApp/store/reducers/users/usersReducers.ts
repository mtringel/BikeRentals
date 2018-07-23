import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { UsersState } from '../../state/users/usersState';
import { UsersActionsPayload, UsersActionsPayload_SetListData, UsersActionsPayload_SetFormData, UsersActionsPayload_PostPutDelete } from '../../actions/users/usersActions';
import { TypeHelper } from '../../../helpers/typeHelper';

export const UsersReducers: (state: UsersState, action: StoreAction<UsersActionsPayload>) => UsersState =
    (state = new UsersState(), action) => {

        switch (action.type) {
            case StoreActionType.Users_SetListData: {
                let payload = action.payload as UsersActionsPayload_SetListData;

                return {
                    users: payload.listData.List,
                    listFilter: payload.listFilter,
                    tooMuchData: payload.listData.TooMuchData
                };
            }

            case StoreActionType.Users_SetFormData: {
                let payload = action.payload as UsersActionsPayload_SetFormData;

                if (TypeHelper.isNullOrEmpty(payload.userId)) return state;

                return {
                    ...state,
                    users: ArrayHelper.update(state.users, payload.formData.User, t => t.UserId === payload.userId),
                };
        }

            case StoreActionType.Users_ClearState:
                return {
                    users: [],
                    listFilter: null,
                    tooMuchData: false
                };

            case StoreActionType.Users_PostSuccess: {
                let payload = action.payload as UsersActionsPayload_PostPutDelete;

                return {
                    ...state,
                    users: ArrayHelper.add(state.users, payload.user),
                };
            }

            case StoreActionType.Users_DeleteSuccess: {
                let payload = action.payload as UsersActionsPayload_PostPutDelete;

                return {
                    ...state,
                    users: ArrayHelper.remove(state.users, t => t.UserId === payload.userId),
                };
            }

            case StoreActionType.Users_PutSuccess: {
                let payload = action.payload as UsersActionsPayload_PostPutDelete;

                return {
                    ...state,
                    users: ArrayHelper.update(state.users, payload.user, t => t.UserId === payload.userId),
                };
            }

            default:
                return state;
        }
    };