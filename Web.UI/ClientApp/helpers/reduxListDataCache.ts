/// <summary>
/// Cache for advanced filtered data, where filter is complex object. Subset matching is supported.
/// TData, TItem, TKey and TFilter are expected to be immutable. (We don't clone them, just share the references.)
/// </summary>

import { TypeHelper } from "./typeHelper";
import { ArrayHelper } from "./arrayHelper";
import { DateHelper } from "./dateHelper";
import { StringHelper } from "./stringHelper";

export class ReduxListDataCacheProps<TData, TItem, TKey, TFilter> {

    // For direct maching:
    public readonly getKey: (item: TItem) => TKey;
    public readonly getItems: (data: TData) => TItem[];
    public readonly setItems: (data: TData | null, newItems: TItem[]) => TData;

    // For sub-set matching:

    /// <summary>
    /// Evaluates whether subFilter filters a sub-set of parentFilter.
    /// Should return null, if subset cannot be calculated. (for example: parentData is not complete set, contains only the first N rows)
    /// </summary>
    public readonly isSubSet: (parentFilter: TFilter, parentData: TData, subFilter: TFilter) => boolean;

    /// <summary>
    /// Evaluates subFilter on a subset of data filtered by parentFilter.
    /// Should return null, if subset cannot be calculated. (for example: parentData is not complete set, contains only the first N rows)
    /// </summary>
    public readonly getSubSet: ((
        parentFilter: TFilter,
        parentData: TData,
        subFilter: TFilter,
        getMatch: ((item: TItem, filter: TFilter) => boolean) | null
    ) => TData) | null;

    public readonly getMatch: ((item: TItem, filter: TFilter) => boolean) | null;
    public readonly supportsSubSets: boolean;

    public constructor(
        getKey: (item: TItem) => TKey,
        getItems: (data: TData) => TItem[],
        setItems: (data: TData | null, newItems: TItem[]) => TData,
        getMatch?: ((item: TItem, filter: TFilter) => boolean) | undefined | null,
        isSubSet?: (parentFilter: TFilter, parentData: TData, subFilter: TFilter) => boolean | undefined | null,
        getSubSet?: ((parentFilter: TFilter, parentData: TData, subFilter: TFilter, getMatch: ((item: TItem, filter: TFilter) => boolean) | null) => TData) | undefined | null
    ) {
        this.getKey = getKey;
        this.getItems = getItems;
        this.setItems = setItems;
        this.isSubSet = isSubSet;
        this.getSubSet = getSubSet;
        this.getMatch = getMatch;

        this.supportsSubSets = !TypeHelper.isNullOrEmpty(isSubSet) &&
            !TypeHelper.isNullOrEmpty(getMatch) &&
            !TypeHelper.isNullOrEmpty(getSubSet);
    }
}

class ReduxListDataCacheItem<TData, TFilter> {
    filter: TFilter;
    data: TData;
}

type ReduxListDataCacheState<TData, TFilter> = { [filterKey: string]: ReduxListDataCacheItem<TData, TFilter> };

/// <summary>
/// Immutable. All methods returns a new instance.
/// </summary>
export class ReduxListDataCache<TData, TItem, TKey, TFilter> {

    public readonly EmptyFilter: TFilter = null;

    private props: ReduxListDataCacheProps<TData, TItem, TKey, TFilter>;

    private state: ReduxListDataCacheState<TData, TFilter>;

    public constructor(
        props: ReduxListDataCacheProps<TData, TItem, TKey, TFilter>,
        state?: ReduxListDataCacheState<TData, TFilter> | undefined | null
    ) {
        this.props = props;
        this.state = !TypeHelper.isNullOrEmpty(state) ? state : {};
    }

    public clear(): ReduxListDataCache<TData, TItem, TKey, TFilter> {
        return new ReduxListDataCache<TData, TItem, TKey, TFilter>(this.props);
    }

    /// <summary>
    /// Returns cached data. Calculates sub-sets, if getMatch and getSubSet are specified.
    /// Returns null otherways. DOES NOT call server.
    /// </summary>
    public getListData(filter: TFilter): TData | null {
        var filterStr = JSON.stringify(filter);
        var directHit = this.state[filterStr];

        if (!TypeHelper.isNullOrEmpty(directHit))
            return directHit.data;
        else if (this.props.supportsSubSets) {
            var partialHit = ArrayHelper.firstOrDefault(
                ArrayHelper.whereMax(
                    ArrayHelper.filterDict(this.state, (key, item) => this.props.isSubSet(item.filter, item.data, filter)),
                    t => t.key.length
                ));

            if (!TypeHelper.isNullOrEmpty(partialHit))
                // Should return null, if subset cannot be calculated. (for example: parentData is not complete set, contains only the first N rows)
                return this.props.getSubSet(partialHit.item.filter, partialHit.item.data, filter, this.props.getMatch);
            else
                return null;
        }
        else
            return null;
    }

    public getById(itemKey: TKey): TItem | null {
        return ArrayHelper.findByPredicateInDict(
            this.state,
            t => this.props.getItems(t.data),
            t => TypeHelper.shallowEquals(this.props.getKey(t), itemKey)
        );
    }

    /// <summary>
    /// Sets filtered data result. DOES NOT update calculated sub-sets.
    /// (According to normal process, this method is called when data was loaded from the server, after it was not possible to get that data from the cache.)
    /// </summary>
    public setListData(filter: TFilter, newData: TData): ReduxListDataCache<TData, TItem, TKey, TFilter> {
        var filterStr = JSON.stringify(filter);

        return new ReduxListDataCache<TData, TItem, TKey, TFilter>(
            this.props,
            ArrayHelper.addToDict(
                this.state,
                filterStr,
                // entities are immutable, clone the list
                {
                    filter: filter,
                    data: this.props.setItems(newData, ArrayHelper.clone(this.props.getItems(newData)))
                }
            ));
    }

    /// <summary>
    /// We can add the item to all matching sets.
    /// Does not assume that sets are already loaded.
    /// </summary>
    public postSuccess(newItem: TItem, lastFilter?: TFilter | undefined | null): ReduxListDataCache<TData, TItem, TKey, TFilter> {

        if (!TypeHelper.isNullOrEmpty(this.props.getMatch)) {
            // add to matching sets
            return new ReduxListDataCache<TData, TItem, TKey, TFilter>(
                this.props,
                ArrayHelper.updateDictByPredicate(
                    this.state,
                    (key, item) => this.props.getMatch(newItem, item.filter),
                    // entities are immutable, clone the list
                    (key, item) => {
                        return {
                            filter: item.filter,
                            data: this.props.setItems(item.data, ArrayHelper.add(this.props.getItems(item.data), newItem))
                        }
                    }
                ));
        } else {
            if (TypeHelper.isNullOrEmpty(lastFilter))
                lastFilter = this.EmptyFilter;

            var lastFilterKey = JSON.stringify(lastFilter);

            if (!TypeHelper.isNullOrEmpty(this.state[lastFilterKey])) {
                // add to last set
                return new ReduxListDataCache<TData, TItem, TKey, TFilter>(
                    this.props,
                    ArrayHelper.updateDictByPredicate(
                        this.state,
                        (key, item) => key === lastFilterKey,
                        // entities are immutable, clone the list
                        (key, item) => {
                            return {
                                filter: item.filter,
                                data: this.props.setItems(item.data, ArrayHelper.add(this.props.getItems(item.data), newItem))
                            }
                        }
                    ));
            }
            else {
                // add to new set
                return new ReduxListDataCache<TData, TItem, TKey, TFilter>(
                    this.props,
                    ArrayHelper.addToDict(
                        {},
                        lastFilterKey,
                        // entities are immutable, clone the list
                        {
                            filter: lastFilter,
                            data: this.props.setItems(null, [newItem])
                        }
                    ));
            }
        }
    }

    /// <summary>
    /// We can update in all sets by id.
    /// Assumes that sets are already loaded.
    /// </summary>
    public putSuccess(newItem: TItem): ReduxListDataCache<TData, TItem, TKey, TFilter> {
        var newKey = this.props.getKey(newItem);

        // update all
        return new ReduxListDataCache<TData, TItem, TKey, TFilter>(
            this.props,
            ArrayHelper.updateDictAll(
                this.state,
                // entities are immutable, clone the list
                (key, item) => {
                    return {
                        filter: item.filter,
                        data: this.props.setItems(item.data, ArrayHelper.update(this.props.getItems(item.data), newItem, t => TypeHelper.shallowEquals(this.props.getKey(t), newKey)))
                    }
                }
            ));
    }

    /// <summary>
    /// We can update in all sets by id.
    /// Assumes that sets are already loaded.
    /// </summary>
    public setFormData(item: TItem): ReduxListDataCache<TData, TItem, TKey, TFilter> {
        if (TypeHelper.isNullOrAllItemsAreEmpty(this.props.getKey(item)))
            return this; // new, don't add
        else
            return this.postSuccess(item);
    }

    /// <summary>
    /// We can remove from all sets.
    /// Assumes that sets are already loaded.
    /// </summary>
    public deleteSuccess(itemKey: TKey): ReduxListDataCache<TData, TItem, TKey, TFilter> {

        // delete from all
        return new ReduxListDataCache<TData, TItem, TKey, TFilter>(
            this.props,
            ArrayHelper.updateDictAll(
                this.state,
                // entities are immutable, clone the list
                (key, item) => {
                    return {
                        filter: item.filter,
                        data: this.props.setItems(item.data, ArrayHelper.remove(this.props.getItems(item.data), t => TypeHelper.shallowEquals(this.props.getKey(t), itemKey)))
                    }
                }
            ));
    }
}