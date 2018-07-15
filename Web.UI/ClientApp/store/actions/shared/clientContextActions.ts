import { StoreAction, IStoreAction } from '../storeAction';
import { StoreActionType } from '../storeActionType';
import { GlobalParameters } from '../../../models/shared/globalParameters';
import { NavMenu } from '../../../components/NavMenu';
import { IScreen } from '../../../helpers/IScreen';
import { ErrorIndicatorComponent } from '../../../components/shared/errorIndicatorComponent';
import { LoaderIndicatorComponent } from '../../../components/shared/loaderIndicatorComponent';
import { ArrayHelper } from '../../../helpers/arrayHelper';
import { Location } from '../../../models/master/location';
import { GeoLocationHelper } from '../../../helpers/geoLocationHelper';
import { RootState } from '../../state/rootState';

export class ClientContextActionsPayload {
    public navMenu: NavMenu;
    public activeScreen: IScreen;
    public globals: GlobalParameters;
    public errorIndicatorComponent: ErrorIndicatorComponent;
    public loaderIndicatorComponent: LoaderIndicatorComponent;
    public currentLocation: Location | null;
}

export class ClientContextActions {

    public static initialize() : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {

        return (dispatch, getState) => {
            // This is an anti-pattern. One should return global parameters via a service.
            dispatch(ClientContextActions.setGlobals(new GlobalParameters((document as any).globals)));

            // put null first
            dispatch(ClientContextActions.setCurrentLocation(null));

            // this could take some time, waiting for user input
            GeoLocationHelper.GetCurrentLocation(location => dispatch(ClientContextActions.setCurrentLocation(location)), error => { });
        };
    }

    public static addErrorIndicator(indicator: ErrorIndicatorComponent): StoreAction<Partial<ClientContextActionsPayload>> {
        return {
            type: StoreActionType.ClientContext_AddErrorIndicator,
            payload: {
                errorIndicatorComponent: indicator
            }
        };
    }

    public static removeErrorIndicator (indicator: ErrorIndicatorComponent): StoreAction<Partial<ClientContextActionsPayload>>{
        return {
            type: StoreActionType.ClientContext_RemoveErrorIndicator,
            payload: {
                errorIndicatorComponent: indicator
            }
        };
    }

    public static addLoaderIndicator (indicator: LoaderIndicatorComponent): StoreAction<Partial<ClientContextActionsPayload>>{
        return {
            type: StoreActionType.ClientContext_AddLoaderIndicator,
            payload: {
                loaderIndicatorComponent: indicator
            }
        };
    }

    public static removeLoaderIndicator(indicator: LoaderIndicatorComponent): StoreAction<Partial<ClientContextActionsPayload>> {
        return {
            type: StoreActionType.ClientContext_RemoveLoaderIndicator,
            payload: {
                loaderIndicatorComponent: indicator
            }
        };
    }

    public static setNavMenu(navMenu: NavMenu): StoreAction<Partial<ClientContextActionsPayload>> {
        return {
            type: StoreActionType.ClientContext_SetNavMenu,
            payload: {
                navMenu: navMenu
            }
        };
    }

    public static setActiveScreen(screen: IScreen): StoreAction<Partial<ClientContextActionsPayload>>{
        return {
            type: StoreActionType.ClientContext_SetActiveScreen,
            payload: {
                activeScreen: screen
            }
        };
    }

    private static setGlobals(globals: GlobalParameters): StoreAction<Partial<ClientContextActionsPayload>> {
        return {
            type: StoreActionType.ClientContext_SetGlobals,
            payload: {
                globals: globals
            }
        };
    }

    /// <summary>
    /// Shows in the most current indicator. 
    /// </summary>
    public static showError(message: string)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {
        
        return (dispatch, getState)  => {
            var indicators = getState().clientContext.errorIndicators;

            if (!ArrayHelper.isNullOrEmpty(indicators))
                indicators[indicators.length - 1].show(message);
            else
                window.alert(message);
        };
    }

    /// <summary>
    /// Shows the most current indicator. 
    /// DOES NOT hides at the end of the process, must call loader.hide(). 
    /// (Show only after 500ms.)
    /// </summary>
    public static showLoader(process: (onSuccess: () => void) => void)
        : (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {
        
        return (dispatch, getState) => {
            var indicators = getState().clientContext.loaderIndicators;

            if (!ArrayHelper.isNullOrEmpty(indicators)) {
                var indicator = indicators[indicators.length - 1];
                var showIt = true;

                window.setTimeout(() => { if (showIt) indicator.show(); }, 500);

                process(() => {
                    showIt = false;
                    indicator.hide();
                });
            }
            else
                // call with dummy
                process(() => { });
        };
    }

    public static setCurrentLocation(loc: Location | null): StoreAction<Partial<ClientContextActionsPayload>> {
        return {
            type: StoreActionType.ClientContext_SetCurrentLocation,
            payload: {
                currentLocation: loc
            }
        };
    }

    public static redirect(url: string): (dispatch: (action: IStoreAction | ((action: any, getState: () => RootState) => void)) => void, getState: () => RootState) => void {
        return (dispatch, getState) => {
            getState().clientContext.activeScreen.redirect(url);
        };
    }
}