import { BikesState } from "./bikeState";
import { BikeModel } from "./bikeModel";
import { Color } from "../master/color";
import { Location } from "../master/location";
import { TypeHelper } from "../../helpers/typeHelper";

export class Bike {

    public readonly BikeId: number;

    public readonly BikeState: BikesState;

    public readonly BikeModel: BikeModel;

    public readonly Color: Color;

    public readonly CurrentLocation: Location;

    public readonly CurrentLocationName: string;

    /// <summary>
    /// Can be available and this is a past date.
    /// Can be unavailable and this is a forecasted future date.
    /// </summary>
    public readonly AvailableFrom: string; // Date;

    public readonly CurrentlyAvailable: boolean;

    public readonly RateAverage: number;

    public readonly DistanceMiles: number | null | undefined;
}