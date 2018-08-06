/// <summary>
/// Cache for advanced filtered data, where filter is complex object. Subset matching is supported.
/// TData, TItem, TKey and TFilter are expected to be immutable. (We don't clone them, just share the references.)
/// </summary>

import { TypeHelper } from "./typeHelper";
import { ArrayHelper } from "./arrayHelper";
import { DateHelper } from "./dateHelper";
import { StringHelper } from "./stringHelper";

export class ReduxFormDataCacheProps<TData, TItem, TKey> {

    // For direct maching:
    public readonly getKey: (item: TItem) => TKey;
    public readonly getItem: (data: TData) => TItem;
    public readonly setItem: (data: TData | null, newItem: TItem) => TData;

    public constructor(
        getKey: (item: TItem) => TKey,
        getItem: (data: TData) => TItem,
        setItem: (data: TData | null, newItem: TItem) => TData
    ) {
        this.getKey = getKey;
        this.getItem = getItem;
        this.setItem = setItem;
    }
}

type ReduxFormDataCacheState<TData> = { [key: string]: TData };

/// <summary>
/// Immutable. All methods returns a new instance.
/// </summary>
export class ReduxFormDataCache<TData, TItem, TKey> {

    private props: ReduxFormDataCacheProps<TData, TItem, TKey>;

    private state: ReduxFormDataCacheState<TData>;

    public constructor(
        props: ReduxFormDataCacheProps<TData, TItem, TKey>,
        state?: ReduxFormDataCacheState<TData> | undefined | null
    ) {
        this.props = props;
        this.state = !TypeHelper.isNullOrEmpty(state) ? state : {};
    }

    public clear(): ReduxFormDataCache<TData, TItem, TKey> {
        return new ReduxFormDataCache<TData, TItem, TKey>(this.props);
    }

    /// <summary>
    /// Returns cached data. Calculates sub-sets, if getMatch and getSubSet are specified.
    /// Returns null otherways. DOES NOT call server.
    /// </summary>
    public getFormData(key: TKey): TData | null {
        var directHit = this.state[JSON.stringify(key)];
        return !TypeHelper.isNullOrEmpty(directHit) ? directHit : null;
    }

    /// <summary>
    /// Sets filtered data result. DOES NOT update calculated sub-sets.
    /// (According to normal process, this method is called when data was loaded from the server, after it was not possible to get that data from the cache.)
    /// </summary>
    public setFormData(newData: TData): ReduxFormDataCache<TData, TItem, TKey> {
        var newItem = this.props.getItem(newData);
        var newKey = this.props.getKey(newItem);
        var newKeyStr = JSON.stringify(newKey);

        return new ReduxFormDataCache<TData, TItem, TKey>(
            this.props,
            // entities are immutable, clone data
            ArrayHelper.addToDict(this.state, newKeyStr, this.props.setItem(newData, newItem))
        );
    }

    /// <summary>
    /// We can add the item to all matching sets.
    /// Does not assume that form data is already loaded.
    /// </summary>
    public postSuccess(newItem: TItem): ReduxFormDataCache<TData, TItem, TKey> {
        var newKey = this.props.getKey(newItem);
        var newKeyStr = JSON.stringify(newKey);

        return new ReduxFormDataCache<TData, TItem, TKey>(
            this.props,
            ArrayHelper.addOrUpdateDict(this.state, newKeyStr, t => this.props.setItem(t, newItem))
        );
    }

    /// <summary>
    /// We can update in all sets by id.
    /// Assumes that form data is already loaded.
    /// </summary>
    public putSuccess(newItem: TItem): ReduxFormDataCache<TData, TItem, TKey> {
        var newKey = this.props.getKey(newItem);
        var newKeyStr = JSON.stringify(newKey);

        return new ReduxFormDataCache<TData, TItem, TKey>(
            this.props,
            ArrayHelper.addOrUpdateDict(this.state, newKeyStr, t => this.props.setItem(t, newItem))
        );
    }

    /// <summary>
    /// We can remove from all sets.
    /// </summary>
    public deleteSuccess(newKey: TKey): ReduxFormDataCache<TData, TItem, TKey> {
        // delete from all
        var newKeyStr = JSON.stringify(newKey);

        return new ReduxFormDataCache<TData, TItem, TKey>(
            this.props,
            ArrayHelper.removeFromDict(this.state, newKeyStr)
        );
    }
}