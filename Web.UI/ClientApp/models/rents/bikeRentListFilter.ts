import { Interval } from "../shared/interval";
import { BikeRentState } from "./bikeRentState";

export class BikeRentListFilter {

    public readonly State: BikeRentState | null = null;

    public readonly Colors: string[] = [];

    public readonly BikeModels: number[] = [];

    /// <summary>
    /// Dates only.
    /// We don't plan for hours. A bike is either available now (brought back at 10am and now it's 1pm) or has a planned end date, which can be exceeded.
    /// If a bike is _planned_ to be brought back at 3rd, it's only available for rent from 4th.
    /// </summary>
    public readonly StartDate = new Interval<Date | null>();

    /// <summary>
    /// Until planned (not returned or lost), this is only planned end date.
    /// </summary>
    public readonly EndDate = new Interval<Date | null>();

    public readonly Users: string[] = [];

    public readonly UserNameFreeTextFilter: string;

    /// <summary>
    /// Not returned until planned End Date. (Maybe lost?)
    /// Only used if State is Reserved.
    /// </summary>
    public readonly Late: boolean | null = null;

    public readonly BikeId: number | null = null;

    public readonly BikeRentId: string | null = null;
}