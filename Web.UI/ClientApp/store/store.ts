import * as Redux from 'redux';
import thunk from 'redux-thunk';

// custom types
import { RootState } from './state/rootState';
import { RootReducerProvider } from './reducers/rootReducerProvider';
import { IStoreAction, StoreAction } from './actions/storeAction';

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
}

