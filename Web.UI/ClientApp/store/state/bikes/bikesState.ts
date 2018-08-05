import { BikeListFilter } from "../../../models/bikes/bikeListFilter";
import { BikeListData } from "../../../models/bikes/bikeListData";
import { PagingInfo } from "../../../models/shared/pagingInfo";
import { Bike } from "../../../models/bikes/bike";
import { Location } from "../../../models/master/location";
import { BikeListItem } from "../../../models/bikes/bikeListItem";
import { BikeFormData } from "../../../models/bikes/bikeFormData";
import { ReduxListDataCache, ReduxListDataCacheProps } from "../../../helpers/reduxListDataCache";
import { ReduxFormDataCache, ReduxFormDataCacheProps } from "../../../helpers/reduxFormDataCache";
import { TypeHelper } from "../../../helpers/typeHelper";

/// <summary>
/// DO NOT add instance properties and functions here.
/// DO initialize all members.
/// </summary>
export class BikesState {

    /// <summary>
    /// The filter we got the data for.
    /// List of bikes is completed for this filter. 
    /// </summary>
    public readonly listFilter: BikeListFilter | null | undefined = undefined;
    public readonly listPaging: PagingInfo | null | undefined = undefined;
    public readonly currentLocation: Location | null = null;

    public readonly timestamp: Date | null = null;

    // the key is the union of filter and paging
    public readonly listCache = new ReduxListDataCache<BikeListData, BikeListItem, number, BikeListFilter & PagingInfo>(
        new ReduxListDataCacheProps<BikeListData, BikeListItem, number, BikeListFilter & PagingInfo>(
            // getKey
            t => t.BikeId,
            // getItems
            t => t.List,
            // setItems (Bike and BikeListData are immutable)
            (data, items) => { return { ...data, List: items } },
            // newData
            () => new BikeListData()
        ));

    public readonly formCache = new ReduxFormDataCache<BikeFormData, Bike, number>(
        new ReduxFormDataCacheProps<BikeFormData, Bike, number>(
            // getKey
            t => t.BikeId,
            // getItem
            t => t.Bike,
            // setItem (Bike and BikeListData are immutable)
            (data, newItem) => { return { Bike: newItem } }
        ));
}