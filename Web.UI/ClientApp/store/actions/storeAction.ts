// custom types
import { StoreActionType } from './storeActionType';
import { RootState } from '../state/rootState';

export interface IStoreAction {
    readonly type: StoreActionType;
    readonly payload: any;
}

export class StoreAction<TPayLoad> implements IStoreAction {
    public readonly type: StoreActionType;
    public readonly payload: TPayLoad;
}

export type StoreDispatch = (action: IStoreAction | StoreActionThunk) => void;

export type StoreActionThunk = (
    dispatch: StoreDispatch,
    getState: () => RootState
) => void;
