import { AutoCompleteItem } from "../../../models/shared/autoCompleteItem";

/// <summary>
/// DO NOT add instance properties and functions here.
/// DO initialize all members.
/// </summary>
export class AutoCompleteState {

    public readonly data: { [autoCompleteType: string]: { listFilter: string, items: AutoCompleteItem[] } } = {};
}