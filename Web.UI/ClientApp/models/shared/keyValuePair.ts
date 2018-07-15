/// <summary>
/// Immutable
/// </summary>
export class KeyValuePair<TKey, TValue> {

    public readonly Key: TKey;

    public readonly Value: TValue;

    public constructor(key: TKey, value: TValue) {
        this.Key = key;
        this.Value = value;
    }
}