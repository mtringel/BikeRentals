import { BikeListItem } from "./bikeListItem";
import { UserRef } from "../users/userRef";

export class Bike extends BikeListItem {

    public readonly ImageToUploadContentBase64: Uint8Array;

    public readonly ImageToUploadFileName: string;

    public readonly Created: Date;

    public readonly CreatedBy: UserRef;
}
