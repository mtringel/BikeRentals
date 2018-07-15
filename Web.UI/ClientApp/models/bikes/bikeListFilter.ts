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

/// <summary>
/// Must be immutable. No need for covering constructor, React will be able to fill instances.
/// DO NOT add instance properties or methods here.
/// DO add static methods for logic.
/// </summary>
export class BikeListFilter extends Filter
{
    public readonly Colors: string[] = [];

    public readonly RateAverage = new Interval<number | null>();

    public readonly WeightLbs = new Interval<number | null>();

    public readonly Availability = new Interval<Date | null>();

    public readonly BikeModels: number[] = [];

    public readonly MaxDistanceMiles: number | null = null;

    public readonly BikeId: number | null = null;
}