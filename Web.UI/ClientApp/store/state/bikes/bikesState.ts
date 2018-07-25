import { BikeListFilter } from "../../../models/bikes/bikeListFilter";
import { BikeListData } from "../../../models/bikes/bikeListData";
import { PagingInfo } from "../../../models/shared/pagingInfo";
import { Bike } from "../../../models/bikes/bike";
import { Location } from "../../../models/master/location";
import { BikeListItem } from "../../../models/bikes/bikeListItem";
import { BikeFormData } from "../../../models/bikes/bikeFormData";

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

    /// <summary>
    /// The filter we got the data for.
    /// List of users is completed for this filter. 
    /// Might contain holes (null), since we load pages and put items at absolute indexes here.
    /// </summary>
    public readonly listItems: (BikeListItem | null | undefined)[] = [];

    public readonly formData: { [bikeId: string]: BikeFormData } = {}; 

    public readonly totalRowCount: number | null = null;
}