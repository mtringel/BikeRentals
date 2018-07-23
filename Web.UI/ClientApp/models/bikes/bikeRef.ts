import { BikeModel } from "./bikeModel";
import { Model } from "../shared/model";
import { BikeModelRef } from "./bikeModelRef";
import { Color } from "../master/color";

export class BikeRef extends Model {

    public readonly BikeId: number;
    
    public readonly BikeModel: BikeModelRef;

    public readonly Color: Color;
}