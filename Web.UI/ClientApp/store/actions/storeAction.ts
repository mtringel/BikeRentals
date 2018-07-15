// custom types
import { StoreActionType } from './storeActionType';

export interface IStoreAction {
    readonly type: StoreActionType;
    readonly payload: any;
}

export class StoreAction<TPayLoad> implements IStoreAction {

    public readonly type: StoreActionType;

    public readonly payload: TPayLoad;
}