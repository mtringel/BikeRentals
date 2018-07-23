import { BikeRentListItem } from "./bikeRentListItem";
import { UserRef } from "../users/userRef";

export class BikeRent extends BikeRentListItem {

    public readonly Created: Date;

    public readonly CreatedBy: UserRef;
}