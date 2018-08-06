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

    /// <summary>
    /// Compare the two values. Use only for comparing scalar values, strings or arrays. For objects, use shallowEquals.
    /// </summary>
    public static compare<T>(objA: T, objB: T, resultIfNonComparable: number, caseInsensitiveStringComparison?: boolean | undefined | null): number {
        // null/undefined ?
        if (TypeHelper.isNullOrEmpty(objA)) {
            if (TypeHelper.isNullOrEmpty(objB))
                return 0;
            else
                return -1;
        }
        else if (TypeHelper.isNullOrEmpty(objB))
            return 1;

        // string?
        else if (typeof objA === "string" && typeof objB === "string" && caseInsensitiveStringComparison === true) {
            var strA = (objA as String).toLowerCase();
            var strB = (objB as String).toLowerCase();

            if (strA < strB)
                return -1;
            else if (strA > strB)
                return 1;
            else
                return 0;
        }

        // array?
        else if (objA instanceof Array && objB instanceof Array) {
            return ArrayHelper.compare(objA as any[], objB as any[], resultIfNonComparable, caseInsensitiveStringComparison);
        }

        // other (scalar)
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

    /// <summary>
    /// Compare the two objects by their members. Use only for comparing objects!
    /// </summary>
    public static shallowEquals<T>(objA: T, objB: T, caseInsensitiveStringComparison?: boolean | undefined | null): boolean {
        // null/undefined?
        if (TypeHelper.isNullOrEmpty(objA))
            return TypeHelper.isNullOrEmpty(objB);
        else if (TypeHelper.isNullOrEmpty(objB))
            return false;

        // string?
        else if (typeof objA === "string" && typeof objB === "string" && caseInsensitiveStringComparison === true)
            return (objA as String).toLowerCase() === (objB as String).toLowerCase();

        // array?
        else if (objA instanceof Array && objB instanceof Array)
            return ArrayHelper.compare(objA as any as any[], objB as any as any[], -1, caseInsensitiveStringComparison) === 0;

        // other (object)
        else {
            var keys = [];

            for (var key in objA)
                keys.push(key);

            if (keys.length === 0)
                return TypeHelper.compare(objA, objB, -1, caseInsensitiveStringComparison) === 0;
            else {
                var i = 0;

                for (var key in objB)
                    if (key !== keys[i++] || TypeHelper.compare(objA[key], objB[key], -1, caseInsensitiveStringComparison) !== 0)
                        return false;

                return true;
            }
        }
    }


    public static isNullOrAllItemsAreEmpty(obj: any | undefined | null): boolean {
        if (obj instanceof Array)
            return ArrayHelper.isNullOrAllItemsAreEmpty(obj as any[]);
        else
            return TypeHelper.isNullOrEmpty(obj);
    }
}