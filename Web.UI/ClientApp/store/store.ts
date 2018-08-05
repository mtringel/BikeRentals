import * as Redux from 'redux';
import thunk from 'redux-thunk';

// custom types
import { RootState } from './state/rootState';
import { RootReducerProvider } from './reducers/rootReducerProvider';
import { IStoreAction, StoreAction, StoreActionThunk, StoreDispatch } from './actions/storeAction';
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

    public dispatch(action: IStoreAction | StoreActionThunk) {
        // we need plain objects
        this.instance.dispatch(action as any);
    }

    public getState(): RootState {
        return this.instance.getState();
    }

    public getInstance() {
        return this.instance;
    } 

  
}

