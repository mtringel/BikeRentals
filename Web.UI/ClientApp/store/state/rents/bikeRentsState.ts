import { PagingInfo } from "../../../models/shared/pagingInfo";
import { Location } from "../../../models/master/location";
import { BikeFormData } from "../../../models/bikes/bikeFormData";
import { BikeRentListFilter } from "../../../models/rents/bikeRentListFilter";
import { BikeRentListItem } from "../../../models/rents/bikeRentListItem";
import { BikeRentFormData } from "../../../models/rents/bikeRentFormData";
import { ReduxListDataCache, ReduxListDataCacheProps } from "../../../helpers/reduxListDataCache";
import { ReduxFormDataCache, ReduxFormDataCacheProps } from "../../../helpers/reduxFormDataCache";
import { BikeRentListData } from "../../../models/rents/bikeRentListData";
import { BikeRent } from "../../../models/rents/bikeRent";

/// <summary>
/// DO NOT add instance properties and functions here.
/// DO initialize all members.
/// </summary>
export class BikeRentsState {

    /// <summary>
    /// The filter we got the data for.
    /// List of bikes is completed for this filter. 
    /// </summary>
    public readonly listFilter: BikeRentListFilter | null | undefined = undefined;
    public readonly listPaging: PagingInfo | null | undefined = undefined;

    public readonly timestamp: Date | null = null;

    // the key is the union of filter and paging
    public readonly listCache = new ReduxListDataCache<BikeRentListData, BikeRentListItem, string, BikeRentListFilter & PagingInfo>(
        new ReduxListDataCacheProps<BikeRentListData, BikeRentListItem, string, BikeRentListFilter & PagingInfo>(
            // getKey
            t => t.BikeRentId,
            // getItems
            t => t.List,
            // setItems (Bike and BikeListData are immutable)
            (data, items) => { return { ...data, List: items } },
            // newData
            () => new BikeRentListData()
        ));

    public readonly formCache = new ReduxFormDataCache<BikeRentFormData, BikeRent, string>(
        new ReduxFormDataCacheProps<BikeRentFormData, BikeRent, string>(
            // getKey
            t => t.BikeRentId,
            // getItem
            t => t.BikeRent,
            // setItems (Bike and BikeListData are immutable)
            (data, newItem) => { return { BikeRent: newItem } }
        ));

    public readonly param_BikeId: number | null = null;
}