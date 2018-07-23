import { BikeListItem } from "./bikeListItem";
import { UserRef } from "../users/userRef";

export class Bike extends BikeListItem {

    public readonly Created: Date;

    public readonly CreatedBy: UserRef;
}