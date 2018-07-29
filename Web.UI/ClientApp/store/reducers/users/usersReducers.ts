import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { UsersState } from '../../state/users/usersState';
import { UsersActionsPayload, UsersActionsPayload_SetListData, UsersActionsPayload_SetFormData, UsersActionsPayload_PostPutDelete } from '../../actions/users/usersActions';
import { TypeHelper } from '../../../helpers/typeHelper';
import { DateHelper } from '../../../helpers/dateHelper';

export const UsersReducers: (state: UsersState, action: StoreAction<UsersActionsPayload>) => UsersState =
    (state = new UsersState(), action) => {

        switch (action.type) {
            case StoreActionType.Users_SetListData: {
                let payload = action.payload as UsersActionsPayload_SetListData;

                return {
                    ...state,
                    listFilter: payload.listFilter,
                    cache: state.cache.setListData(payload.listFilter, payload.listData),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.Users_SetFormData: {
                let payload = action.payload as UsersActionsPayload_SetFormData;

                return {
                    ...state,
                    cache: state.cache.setFormData(payload.formData.User),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.Users_ClearState:
                return new UsersState();

            case StoreActionType.Users_PostSuccess: {
                let payload = action.payload as UsersActionsPayload_PostPutDelete;

                return {
                    ...state,
                    cache: state.cache.postSuccess(payload.user, state.listFilter),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.Users_DeleteSuccess: {
                let payload = action.payload as UsersActionsPayload_PostPutDelete;

                return {
                    ...state,
                    cache: state.cache.deleteSuccess(payload.userId),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            case StoreActionType.Users_PutSuccess: {
                let payload = action.payload as UsersActionsPayload_PostPutDelete;

                return {
                    ...state,
                    cache: state.cache.putSuccess(payload.user),
                    timestamp: TypeHelper.notNullOrEmpty(state.timestamp, DateHelper.now())
                };
            }

            default:
                return state;
        }
    };