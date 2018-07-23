import { Model } from "./model";
import { AutoCompleteItem } from "./autoCompleteItem";

export class AutoCompleteListData extends Model
{
    public readonly List: AutoCompleteItem[];
    }