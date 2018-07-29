import { Color } from '../../../models/master/color';
import { ReduxListDataCache, ReduxListDataCacheProps } from '../../../helpers/reduxListDataCache';
import { ColorListData } from '../../../models/master/colorListData';
import { StringHelper } from '../../../helpers/stringHelper';

/// <summary>
/// DO NOT add instance properties and functions here.
/// DO initialize all members.
/// </summary>
export class ColorsState {

    public readonly timestamp: Date | null = null;

    // no filter
    public readonly cache = new ReduxListDataCache<ColorListData, Color, string, any>(
        new ReduxListDataCacheProps<ColorListData, Color, string, any>(
            // getId
            t => t.ColorId,
            // getItems
            t => t.List,
            // setItems
            (data, items) => { return { List: items } }
        ));
}