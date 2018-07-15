import { BikeListFilter } from "../../../models/bikes/bikeListFilter";
import { BikeListData } from "../../../models/bikes/bikeListData";
import { PagingInfo } from "../../../models/shared/pagingInfo";
import { Bike } from "../../../models/bikes/bike";
import { Location } from "../../../models/master/location";

/// <summary>
/// DO NOT add instance properties and functions here.
/// DO initialize all members.
/// </summary>
export class BikesState {

    /// <summary>
    /// The filter we got the data for.
    /// List of users is completed for this filter. 
    /// </summary>
    public readonly bikesFilter: BikeListFilter | undefined = undefined;
    public readonly bikesPaging: PagingInfo | undefined = undefined;
    public readonly currentLocation: Location | undefined = undefined;

    /// <summary>
    /// The filter we got the data for.
    /// List of users is completed for this filter. 
    /// Might contain holes (null), since we load pages and put items at absolute indexes here.
    /// </summary>
    public readonly bikes: (Bike | null | undefined)[] = [];

    public readonly totalRowCount: number | undefined = undefined;
}