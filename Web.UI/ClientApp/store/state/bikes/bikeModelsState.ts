import { BikeModel } from "../../../models/bikes/bikeModel";
import { ReduxListDataCache, ReduxListDataCacheProps } from '../../../helpers/reduxListDataCache';
import { BikeModelListData } from "../../../models/bikes/bikeModelListData";
import { StringHelper } from "../../../helpers/stringHelper";

/// <summary>
/// DO NOT add instance properties and functions here.
/// DO initialize all members.
/// </summary>
export class BikeModelsState {

    public readonly timestamp: Date | null = null;

    // no filter
    public readonly cache = new ReduxListDataCache<BikeModelListData, BikeModel, number, any>(
        new ReduxListDataCacheProps<BikeModelListData, BikeModel, number, any>(
            // getId
            t => t.BikeModelId,
            // getItems
            t => t.List,
            // setItems
            (data, items) => { return { List: items } }
        ));
}