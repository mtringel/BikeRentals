import { Model } from "../shared/model";
import { PagingInfo } from "../shared/pagingInfo";
import { Color } from "../master/color";
import { Interval } from "../shared/interval";
import { BikeModel } from "./bikeModel";
import { ArrayHelper } from "../../helpers/arrayHelper";
import { StringHelper } from "../../helpers/stringHelper";
import { Filter } from "../shared/filter";
import { TypeHelper } from "../../helpers/typeHelper";
import { Location } from "../master/location";
import { BikeState } from "../../models/bikes/bikeState";

/// <summary>
/// Must be immutable. No need for covering constructor, React will be able to fill instances.
/// DO NOT add instance properties or methods here.
/// DO add static methods for logic.
/// </summary>
export class BikeListFilter extends Filter
{
    /// <summary>
    /// When filtering for Available, only bikes available on Availability (or current day) will be listed. This is the only accessible option by users.
    /// When filtering for any other states, all bikes are listed.
    /// </summary>
    public readonly State: BikeState | null = null;

    /// <summary>
    /// Filters only is State is set to Available.
    /// Dates only.
    /// We don't plan for hours. A bike is either available now (brought back at 10am and now it's 1pm) or has a planned end date, which can be exceeded.
    /// If a bike is _planned_ to be brought back at 3rd, it's only available for rent from 4th.
    /// </summary>
    public readonly AvailableWhen = new Interval<Date | null>();

    public readonly Colors: string[] = [];

    public readonly RateAverage = new Interval<number | null>();

    public readonly WeightLbs = new Interval<number | null>();

    public readonly BikeModels: number[] = [];

    public readonly MaxDistanceMiles: number | null = null;

    public readonly BikeId: number | null = null;
}