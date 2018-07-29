import { AutoCompleteItem } from "../../../models/shared/autoCompleteItem";
import { ReduxListDataCache, ReduxListDataCacheProps } from "../../../helpers/reduxListDataCache";
import { AutoCompleteListData } from "../../../models/shared/autoCompleteListData";
import { StringHelper } from "../../../helpers/stringHelper";
import { AutoCompleteType } from "../../../models/shared/autoCompleteType";
import { TypeHelper } from "../../../helpers/typeHelper";

/// <summary>
/// DO NOT add instance properties and functions here.
/// DO initialize all members.
/// </summary>
export class AutoCompleteState {

    /// <summary>
    /// Age of the oldest record cached. Re-loading rows frequently. See AppConfig.WebApplication.ClientCacheDuration.
    /// </summary>
    public readonly timestamp: Date | null = null;

    public readonly cache: { [type: string]: ReduxListDataCache<AutoCompleteListData, AutoCompleteItem, string, string> } = {};

    public static getCache(cache: ReduxListDataCache<AutoCompleteListData, AutoCompleteItem, string, string>)
        : ReduxListDataCache<AutoCompleteListData, AutoCompleteItem, string, string> {

        if (!TypeHelper.isNullOrEmpty(cache))
            return cache;
        else
            return new ReduxListDataCache<AutoCompleteListData, AutoCompleteItem, string, string>(
                new ReduxListDataCacheProps<AutoCompleteListData, AutoCompleteItem, string, string>(
                    // getKey
                    t => t.Key,
                    // getItems
                    t => t.List,
                    // setItems
                    (data, items) => { return { List: items, TooMuchData: data.TooMuchData } },
                    // getMatch
                    (item, filter) => StringHelper.contains(item.Value, filter, true),
                    // isSubSet
                    (parentFilter, parentData, subFilter) => !parentData.TooMuchData && StringHelper.contains(subFilter, parentFilter, true),
                    // getSubSet
                    (parentFilter, parentData, subFilter, getMatch) => parentData.TooMuchData ? null :
                        {
                            List: parentData.List.filter(t => getMatch(t, subFilter)),
                            TooMuchData: false
                        }
                ));
    }
}