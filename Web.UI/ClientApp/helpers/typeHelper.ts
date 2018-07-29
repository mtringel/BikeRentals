import { ArrayHelper } from "./arrayHelper";

/// <summary>
/// Helper methods for objects
/// </summary>
export class TypeHelper {

    public static int = {
        minValue: -0x80000000,
        maxValue: 0x7fffffff
    };

    public static isNullOrEmpty<T>(value: T | undefined | null): boolean {
        return value === undefined || value === null;
    }

    public static notNullOrEmpty<T>(value: T | undefined | null, valueIfNull: T): T {
        return TypeHelper.isNullOrEmpty(value) ? valueIfNull : value;
    }

    public static toString(value: any | undefined | null, valueIfNull?: string | undefined | null): string {
        if (TypeHelper.isNullOrEmpty(value))
            return TypeHelper.isNullOrEmpty(valueIfNull) ? "" : valueIfNull;
        else
            return value.toString();
    }

    public static compare<T>(objA: T, objB: T, resultIfNonComparable: number, caseInsensitiveStringComparison?: boolean | undefined | null): number {
        if (TypeHelper.isNullOrEmpty(objA)) {
            if (TypeHelper.isNullOrEmpty(objB))
                return 0;
            else
                return -1;
        }
        else if (TypeHelper.isNullOrEmpty(objB))
            return 1;
        else {
            caseInsensitiveStringComparison = (caseInsensitiveStringComparison === true);

            if (caseInsensitiveStringComparison && typeof objA === "string" && typeof objB === "string") {
                var strA = (objA as String).toLowerCase();
                var strB = (objB as String).toLowerCase();

                if (strA < strB)
                    return -1;
                else if (strA > strB)
                    return 1;
                else
                    return 0;
            }
            else if (objA instanceof Array && objB instanceof Array) {
                return ArrayHelper.compare(objA as any[], objB as any[], resultIfNonComparable, caseInsensitiveStringComparison);
            }
            else {
                if (objA < objB)
                    return -1;
                else if (objA > objB)
                    return 1;
                else if (objA === objB)
                    return 0;
                else
                    return resultIfNonComparable;
            }
        }
    }

    public static shallowEquals<T>(obj1: T, obj2: T): boolean {
        var keys = [];

        for (var key in obj1)
            keys.push(key);

        var i = 0;

        for (var key in obj2)
            if (key !== keys[i++] || TypeHelper.compare(obj1[key], obj2[key], -1) !== 0)
                return false;

        return true;
    }


    public static isNullOrAllItemsAreEmpty(obj: any | undefined | null): boolean {
        if (obj instanceof Array)
            return ArrayHelper.isNullOrAllItemsAreEmpty(obj as any[]);
        else
            return TypeHelper.isNullOrEmpty(obj);
    }
}