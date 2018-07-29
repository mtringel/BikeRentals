import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { WebApiServiceState } from '../../state/shared/webApiServiceState';
import { WebApiServiceActionsPayload } from '../../actions/shared/webApiServiceActions';
import { ArrayHelper } from '../../../helpers/arrayHelper';

export const WebApiServiceReducers: (state: WebApiServiceState, action: StoreAction<Partial<WebApiServiceActionsPayload>>) => WebApiServiceState =
    (state = new WebApiServiceState(), action) => {
        
        switch (action.type) {
            case StoreActionType.WebApiService_SetLastAntiforgeryToken:
                return {
                    ...state,
                    lastAntiforgeryToken: action.payload.lastAntiforgeryToken
                };

            case StoreActionType.WebApiService_SubscribeRequest:
                return {
                    ...state,
                    activeRequests: ArrayHelper.addOrUpdateDict(
                        state.activeRequests,
                        action.payload.requestKey,
                        t => ArrayHelper.add(t, { onSuccess: action.payload.onSuccess, onError: action.payload.onError })
                    )
                };

            case StoreActionType.WebApiService_ClearAllRequests:
                return {
                    ...state,
                    activeRequests:
                        // Clear only works if the subscibers number is matching this number.
                        // Used to avoid concurrency issues, instead of locking.
                        state.activeRequests[action.payload.requestKey].length === action.payload.expectedSubscriberLength ?
                            ArrayHelper.removeFromDict(state.activeRequests, action.payload.requestKey) :
                            state.activeRequests
                };

            default:
                return state;
        }
    };