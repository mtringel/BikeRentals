import { StoreActionType } from '../../actions/storeActionType';
import { StoreAction } from '../../actions/storeAction';
import { RootState } from '../../state/rootState';
import { ClientContextState } from '../../state/shared/clientContextState';
import { ClientContextActionsPayload } from '../../actions/shared/clientContextActions';
import { ArrayHelper } from '../../../helpers/arrayHelper';

export const ClientContextReducers: (state: ClientContextState, action: StoreAction<Partial<ClientContextActionsPayload>>) => ClientContextState =
    (state = new ClientContextState(), action) => {
        
        switch (action.type) {
            case StoreActionType.ClientContext_SetGlobals:
                return {
                    ...state,
                    globals: action.payload.globals
                };

            case StoreActionType.ClientContext_AddErrorIndicator:
                return {
                    ...state,
                    errorIndicators: ArrayHelper.add(state.errorIndicators, action.payload.errorIndicatorComponent)
                };

            case StoreActionType.ClientContext_RemoveErrorIndicator:
                return {
                    ...state,
                    errorIndicators: ArrayHelper.remove(state.errorIndicators, t => t === action.payload.errorIndicatorComponent)
                };

            case StoreActionType.ClientContext_AddLoaderIndicator:
                return {
                    ...state,
                    loaderIndicators: ArrayHelper.add(state.loaderIndicators, action.payload.loaderIndicatorComponent)
                };

            case StoreActionType.ClientContext_RemoveLoaderIndicator:
                return {
                    ...state,
                    loaderIndicators: ArrayHelper.remove(state.loaderIndicators, t => t === action.payload.loaderIndicatorComponent)
                };

            case StoreActionType.ClientContext_SetActiveScreen:
                return {
                    ...state,
                    lastScreen: state.activeScreen,
                    activeScreen: action.payload.activeScreen
                };

            case StoreActionType.ClientContext_SetNavMenu:
                return {
                    ...state,
                    navMenu: action.payload.navMenu
                };

            case StoreActionType.ClientContext_SetCurrentLocation:
                return {
                    ...state,
                    currentLocation: action.payload.currentLocation
                };

            default:
                return state;
        }
    };