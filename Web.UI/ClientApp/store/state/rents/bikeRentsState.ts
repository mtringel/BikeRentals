import { PagingInfo } from "../../../models/shared/pagingInfo";
import { Location } from "../../../models/master/location";
import { BikeFormData } from "../../../models/bikes/bikeFormData";
import { BikeRentListFilter } from "../../../models/rents/bikeRentListFilter";
import { BikeRentListItem } from "../../../models/rents/bikeRentListItem";
import { BikeRentFormData } from "../../../models/rents/bikeRentFormData";

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

    /// <summary>
    /// The filter we got the data for.
    /// List of users is completed for this filter. 
    /// Might contain holes (null), since we load pages and put items at absolute indexes here.
    /// </summary>
    public readonly listItems: (BikeRentListItem | null | undefined)[] = [];

    public readonly formData: { [bikeRentId: string]: BikeRentFormData } = {};

    public readonly totalRowCount: number | null = null;

    public readonly useBikeId: number | null = null;
}