import * as Redux from 'redux';
import thunk from 'redux-thunk';

// custom types
import { RootState } from './state/rootState';
import { RootReducerProvider } from './reducers/rootReducerProvider';
import { IStoreAction, StoreAction } from './actions/storeAction';
import { UsersActions } from './actions/users/usersActions';
import { BikeModelsActions } from './actions/bikes/bikeModelsActions';
import { ColorsActions } from './actions/master/colorsActions';
import { AutoCompleteActions } from './actions/shared/autoCompleteActions';
import { BikesActions } from './actions/bikes/bikesActions';
import { BikeRentsActions } from './actions/rents/bikeRentsActions';

export class Store {

    private readonly instance: Redux.Store<RootState>;

    public constructor() {
        this.instance = Redux.createStore(
            RootReducerProvider.CombineReducers(),
            Redux.applyMiddleware(thunk)
        );
    }

    public dispatch(action: IStoreAction | ((action: any, state: () => RootState) => void)) {
        // we need plain objects
        this.instance.dispatch(action as any);
    }

    public getState(): RootState {
        return this.instance.getState();
    }

    public getInstance() {
        return this.instance;
    } 

    /// <summary>
    /// Invalidates all cached data which is too old according to its timestamp and AppConfig.WebApplication.ClientCachingDurationInMinutes.
    /// </summary>
    public clearStateIfExpiredAll() {
        this.dispatch(UsersActions.clearStateIfExpired());
        this.dispatch(BikeModelsActions.clearStateIfExpired());
        this.dispatch(ColorsActions.clearStateIfExpired());
        this.dispatch(AutoCompleteActions.clearStateIfExpired());
        this.dispatch(BikesActions.clearStateIfExpired());
        this.dispatch(BikeRentsActions.clearStateIfExpired());
    }

    /// <summary>
    /// Invalidates all cached data.
    /// </summary>
    public clearStateAll() {
        this.dispatch(UsersActions.clearState());
        this.dispatch(BikeModelsActions.clearState());
        this.dispatch(ColorsActions.clearState());
        this.dispatch(AutoCompleteActions.clearState());
        this.dispatch(BikesActions.clearState());
        this.dispatch(BikeRentsActions.clearState());
    }
}

