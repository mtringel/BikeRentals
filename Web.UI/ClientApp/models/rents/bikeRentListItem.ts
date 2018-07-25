import { Model } from "../shared/model";
import { BikeRentState } from "./bikeRentState";
import { BikeRef } from "../bikes/bikeRef";
import { UserRef } from "../users/userRef";
import { Location } from "../master/location";

export class BikeRentListItem extends Model {

    public readonly BikeRentId: string;

    public readonly BikeRentState: BikeRentState;

    public readonly Bike: BikeRef;

    public readonly User: UserRef;

    public readonly StartDateUtc: Date;

    /// <summary>
    /// Until planned (not returned or lost), this is only planned end date.
    /// </summary>
    public readonly EndDateUtc: Date;

    public readonly PickUpLocation: Location;

    public readonly PickUpLocationName: string;

    public readonly ReturnLocation: Location | undefined | null;

    public readonly ReturnLocationName: string | undefined | null;
}