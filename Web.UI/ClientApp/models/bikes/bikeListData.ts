import { BikeListItem } from "./bikeListItem";

export class BikeListData {

    /// <summary>
    /// Top 100 items only
    /// </summary>
    public readonly List: BikeListItem[] = [];

    /// <summary>
    /// If there are more than 100 returned items
    /// </summary>
    public readonly TotalRowCount: number = 0;
}