import { TypeHelper } from "./typeHelper";

/// <summary>
/// Helper functions for working with arrays
/// </summary>
export class ArrayHelper {

    public static isNullOrEmpty(array: any[] | undefined | null): boolean {
        return array === undefined || array === null || array.length === 0;
    }

    public static isNullOrAllItemsAreEmpty(array: any[] | undefined | null): boolean {
        return ArrayHelper.isNullOrEmpty(array) || ArrayHelper.all(array, t => TypeHelper.isNullOrEmpty(t));
    }

    public static notNullOrEmpty<T>(array: T[] | undefined | null, valueIfNullOrEmpty: T[] | undefined | null): T[] | undefined | null {
        return ArrayHelper.isNullOrEmpty(array) ? valueIfNullOrEmpty : array;
    }

    /// <summary>
    /// Removes first occurence. Removes in-place.
    /// </summary1>
    public static removeInPlace<T>(array: T[] | null, item: T | null): boolean {
        if (ArrayHelper.isNullOrEmpty(array))
            return false;
        
        var i = array.indexOf(item);

        if (i >= 0) {
            array.splice(i, 1);
            return true;
        }
        else
            return false;
    };

    /// <summary>
    /// Removes all occurences. Removes in-place.
    /// </summary>
    public static removeInPlaceAll<T>(array: T[] | null, item: T | null): number {
        if (ArrayHelper.isNullOrEmpty(array))
            return 0;

        var cnt = 0;
        var i = array.length - 1;

        while (i >= 0) {
            i = array.lastIndexOf(item, i);

            if (i >= 0) {
                array.splice(i, 1);
                cnt++;
                i--;
            } else
                break;
        }

        return cnt;
    };

    /// <summary>
    /// Sorts array in-place
    /// </summary>
    public static sortByProperties<T>(array: T[], propertyNames: string[], descending?: undefined | null | boolean) {
        if (ArrayHelper.isNullOrEmpty(array) || ArrayHelper.isNullOrEmpty(propertyNames))
            return;

        var order = descending === true ? -1 : 1;
        var length = propertyNames.length;

        array.sort((item1, item2) => {
            for (var i = 0; i < length; i++) {
                var name = propertyNames[i];
                var res = TypeHelper.compare(item1[name], item2[name], 0, true);

                if (res != 0)
                    return res * order;
            }
            return 0;
        });
    }

    /// <summary>
    /// Sorts array in-place
    /// Values returned by getValue() are compared.
    /// Support comparing arrays, if getValue() returns Array.
    /// </summary>
    public static sortByPredicate<T>(array: T[], getValue: (item: T) => any, descending?: undefined | null | boolean) {
        if (ArrayHelper.isNullOrEmpty(array))
            return;

        var order = descending === true ? -1 : 1;

        array.sort((item1, item2) => {
            var val1 = getValue(item1);
            var val2 = getValue(item2);

            if (val1 instanceof Array && val2 instanceof Array)
                return ArrayHelper.compare(val1 as any, val2 as any, 0, true) * order;
            else
                return TypeHelper.compare(val1, val2, 0, true) * order;
        });
    }

    /// <summary>
    /// Sorts array in-place
    /// Members of getObject() results are iterated over.
    /// </summary>
    public static sortByObject<T>(array: T[], getObject: (item: T) => any, descending?: undefined | null | boolean) {
        if (ArrayHelper.isNullOrEmpty(array))
            return;

        var order = descending === true ? -1 : 1;

        array.sort((item1, item2) => {
            var obj1 = getObject(item1);
            var obj2 = getObject(item2);

            for (var member in obj1) {
                var res = TypeHelper.compare(item1[member], item2[member], 0, true);

                if (res != 0)
                    return res * order;
            }

            return 0;
        });
    }

    public static compare<T>(array1: T[], array2: T[], resultIfNonComparable: number, caseInsensitiveStringComparison?: boolean | undefined | null): number {
        if (array1 === undefined || array2 === undefined) {
            if (array2 === undefined || array2 === null)
                return 0;
            else
                return -1;
        }
        else if (array2 === undefined || array2 === null)
            return 1;
        else {
            var len1 = array1.length;
            var len2 = array2.length;

            if (len1 < len2)
                return -1;
            else if (len2 < len1)
                return 1;
            else {
                for (var i = 0; i < len1; i++) {
                    var res = TypeHelper.compare(array1[i], array2[i], resultIfNonComparable, caseInsensitiveStringComparison);

                    if (res != 0)
                        return res;
                }

                return 0;
            }
        }
    }

    public static indexByPredicate<T>(array: T[], predicate: (item: T) => boolean): number {

        if (!ArrayHelper.isNullOrEmpty(array)) {
            var length = array.length;

            for (var i = 0; i < length; i++)
                if (predicate(array[i])) return i;
        }

        return -1;
    }

    public static findByPredicate<T>(array: T[], predicate: (item: T) => boolean): T | null {
        if (TypeHelper.isNullOrEmpty(array))
            return null;
        else {
            var i = ArrayHelper.indexByPredicate(array, predicate);
            return i < 0 ? null : array[i];
        }
    }

    public static findByPredicateInDict<T, T2>(dict: { [key: string]: T }, getArray: (item: T) => T2[], predicate: (item: T2) => boolean): T2 | null {

        if (TypeHelper.isNullOrEmpty(dict))
            return null;
        else {
            var result: T2 = null;

            for (var key in dict) {
                var array = getArray(dict[key]);
                var i = ArrayHelper.indexByPredicate(array, predicate);

                if (i >= 0) {
                    result = array[i];
                    break;
                }
            }

            return result;
        }
    }

    public static clone<T>(array: T[]) {
        return array === undefined || array === null ? array : array.slice(0);
    }

    public static cloneDict<T>(
        dict: { [key: string]: T },
        clone?: ((key: string, item: T) => T) | undefined | null,
        predicate?: ((key: string, item: T) => boolean) | undefined | null
    ): { [key: string]: T } {

        if (dict === undefined || dict === null)
            return dict;
        else {
            var result: { [key: string]: T } = {};

            if (TypeHelper.isNullOrEmpty(clone))
                clone = (key, item) => item;

            if (TypeHelper.isNullOrEmpty(predicate))
                predicate = (tkey, titem) => true;

            for (var key in dict) {
                var item = dict[key];

                if (predicate(key, item))
                    result[key] = clone(key, item);
            }

            return result;
        }
    }

    public static add<T>(array: T[], item: T): T[] {
        return !ArrayHelper.isNullOrEmpty(array) ? array.concat([item]) : [item];
    }

    public static insert<T>(array: T[], index: number, item: T): T[] {
        if (ArrayHelper.isNullOrEmpty(array))
            return [item];
        else if (index >= array.length)
            return array.concat([item]);
        else if (index <= 0)
            return [item].concat(array);
        else
            return array.slice(0, index - 1).concat([item]).concat(array.slice(index, array.length - 1));
    }

    public static remove<T>(array: T[], predicate: (item: T) => boolean): T[] {
        return !ArrayHelper.isNullOrEmpty(array) ? array.filter(t => !predicate(t)) : [];
    }

    public static update<T>(array: T[], item: T, predicate: (item: T) => boolean): T[] {
        if (ArrayHelper.isNullOrEmpty(array))
            return [];
        else {
            var i = ArrayHelper.indexByPredicate(array, predicate);

            if (i < 0)
                return ArrayHelper.add(array, item);
            else {
                var res = ArrayHelper.clone(array);
                res[i] = item;
                return res;
            }
        }
    }


    /// <summary>
    /// Items in the array should be sorted.
    /// </summary>
    public static equals<T>(arr1: T[], arr2: T[], predicate?: ((item1: T, item2: T) => boolean) | undefined | null): boolean {
        if (ArrayHelper.isNullOrEmpty(arr1))
            return ArrayHelper.isNullOrEmpty(arr2);
        else if (ArrayHelper.isNullOrEmpty(arr2))
            return false;
        else if (arr1.length !== arr2.length)
            return false;
        else {
            var length = arr1.length;

            if (TypeHelper.isNullOrEmpty(predicate))
                predicate = (t1, t2) => t1 === t2;

            for (var i = 0; i < length; i++)
                if (!predicate(arr1[i], arr2[i]))
                    return false;

            return true;
        }
    }

    /// <summary>
    /// Returns resized array. Filled with undefined.
    /// </summary>
    public static resize<T>(array: T[], newSize: number): T[] {
        if (ArrayHelper.isNullOrEmpty(array))
            return new Array(newSize);
        else if (newSize <= array.length)
            return array.slice(0, newSize);
        else
            return ArrayHelper.clone(array).concat(new Array(newSize - array.length));
    }

    /// <summary>
    /// Copies into dest array. Resizes dest array, if necessary. Fills with undefined. Returns new array.
    /// </summary>
    public static copyTo<T>(destArray: T[], destPos: number, srcArray: T[], srcPos: number, length: number): T[] {
        var result: T[];
        
        if (ArrayHelper.isNullOrEmpty(srcArray) || length <= 0)
            result = ArrayHelper.clone(destArray);
        else {
            var endPos = destPos + length;

            if (ArrayHelper.isNullOrEmpty(destArray))
                result = new Array(destPos + length);
            else if (endPos > destArray.length)
                result = ArrayHelper.resize(destArray, endPos);
            else
                result = ArrayHelper.clone(destArray);

            while (destPos < endPos)
                result[destPos++] = srcArray[srcPos++];
        }

        return result;
    }

    /// <summary>
    /// Returns clone of dict.
    /// </summary>
    public static addToDict<T>(dict: { [key: string]: T }, key: string, item: T): { [key: string]: T } {
        var res = TypeHelper.isNullOrEmpty(dict) ? {} : ArrayHelper.cloneDict(dict);
        res[key] = item;
        return res;
    }

    /// <summary>
    /// Returns clone of dict.
    /// </summary>
    public static addOrUpdateDict<T>(dict: { [key: string]: T }, key: string, add: (oldItemIfExists: T | undefined | null) => T): { [key: string]: T } {
        var res = TypeHelper.isNullOrEmpty(dict) ? {} : ArrayHelper.cloneDict(dict);
        res[key] = add(res[key]);
        return res;
    }

    /// <summary>
    /// Returns clone of dict.
    /// </summary>
    public static removeFromDict<T>(dict: { [key: string]: T }, key: string): { [key: string]: T } {
        return !TypeHelper.isNullOrEmpty(dict) ? ArrayHelper.cloneDict(dict, null, (tkey, tvalue) => tkey !== key) : {};
    }

    /// <summary>
    /// Returns clone of dict.
    /// </summary>
    public static updateDict<T>(dict: { [key: string]: T }, key: string, update: (olditem: T) => T): { [key: string]: T } {
        return !TypeHelper.isNullOrEmpty(dict) ? ArrayHelper.cloneDict(dict, (tkey, titem) => tkey === key ? update(titem) : titem) : {};
    }

    /// <summary>
    /// Returns clone of dict.
    /// </summary>
    public static updateDictAll<T>(dict: { [key: string]: T }, update: (key: string, olditem: T) => T): { [key: string]: T } {
        return !TypeHelper.isNullOrEmpty(dict) ? ArrayHelper.cloneDict(dict, (tkey, titem) => update(tkey, titem)) : {};
    }

    /// <summary>
    /// Returns clone of dict.
    /// </summary>
    public static updateDictByPredicate<T>(dict: { [key: string]: T }, predicate: (key: string, item: T) => boolean, update: (key: string, olditem: T) => T): { [key: string]: T } {
        return !TypeHelper.isNullOrEmpty(dict) ? ArrayHelper.cloneDict(dict, (tkey, titem) => predicate(tkey, titem) ? update(tkey, titem) : titem) : {};
    }

    public static all<T>(array: T[], predicate: (item: T) => boolean, from?: number | undefined | null, to?: number | undefined | null) {
        return !ArrayHelper.any(array, t => !predicate(t), from, to);
    }

    public static any<T>(array: T[], predicate: (item: T) => boolean, from?: number | undefined | null, to?: number | undefined | null) {
        if (TypeHelper.isNullOrEmpty(from))
            from = 0;

        if (TypeHelper.isNullOrEmpty(to))
            to = array.length - 1;

        var result = false;

        for (var i = from; i <= to; i++)
            if (predicate(array[i])) {
                result = true;
                break;
            }

        return result;
    }

    public static select<T, T2>(array: T[], select: (item: T) => T2): T2[] {
        if (ArrayHelper.isNullOrEmpty(array))
            return [];
        else {
            var length = array.length;
            var res = new Array(length);

            for (var i = 0; i < length; i++)
                res[i] = select(array[i]);

            return res;
        }
    }

    public static filterDict<T>(dict: { [key: string]: T }, predicate: (key: string, item: T) => boolean): { key: string, item: T }[] {
        if (TypeHelper.isNullOrEmpty(dict))
            return [];
        else {
            var res = [];

            for (var key in dict) {
                var item = dict[key];

                if (predicate(key, item))
                    res.push({ key: key, item: item });
            }

            return res;
        }
    }

    public static firstOrDefault<T>(array: T[]): T | null{
        return ArrayHelper.isNullOrEmpty(array) ? null : array[0];
    }

    public static lastOrDefault<T>(array: T[]): T | null {
        return ArrayHelper.isNullOrEmpty(array) ? null : array[array.length - 1];
    }

    public static min<T>(array: T[], caseInsensitiveStringComparison?: boolean | undefined | null): T | null {
        if (ArrayHelper.isNullOrEmpty(array))
            return null;

        var length = array.length;
        var min = array[0];

        for (var i = 1; i < length; i++) {
            var value = array[i];

            if (TypeHelper.compare(value, min, 0, caseInsensitiveStringComparison) < 0)
                min = value;
        }

        return min;
    }

    public static minSelect<T, T2>(array: T[], select: (item: T) => T2, caseInsensitiveStringComparison?: boolean | undefined | null): T2 | null {
        if (ArrayHelper.isNullOrEmpty(array))
            return null;

        var length = array.length;
        var min = select(array[0]);

        for (var i = 1; i < length; i++) {
            var value = select(array[i]);

            if (TypeHelper.compare(value, min, 0, caseInsensitiveStringComparison) < 0)
                min = value;
        }

        return min;
    }

    public static max<T>(array: T[], caseInsensitiveStringComparison?: boolean | undefined | null): T | null {
        if (ArrayHelper.isNullOrEmpty(array))
            return null;

        var length = array.length;
        var max = array[0];

        for (var i = 1; i < length; i++) {
            var value = array[i];

            if (TypeHelper.compare(value, max, 0, caseInsensitiveStringComparison) > 0)
                max = value;
        }

        return max;
    }

    public static maxSelect<T, T2>(array: T[], select: (item: T) => T2, caseInsensitiveStringComparison?: boolean | undefined | null): T2 | null {
        if (ArrayHelper.isNullOrEmpty(array))
            return null;

        var length = array.length;
        var max = select(array[0]);

        for (var i = 1; i < length; i++) {
            var value = select(array[i]);

            if (TypeHelper.compare(value, max, 0, caseInsensitiveStringComparison) > 0)
                max = value;
        }

        return max;
    }

    public static whereMin<T, T2>(array: T[], select: (item: T) => T2, caseInsensitiveStringComparison ?: boolean | undefined | null): T[] {
        if (ArrayHelper.isNullOrEmpty(array))
            return [];

        var min = ArrayHelper.minSelect(array, select);
        return array.filter(t => TypeHelper.compare(select(t), min, -1, caseInsensitiveStringComparison) === 0);
    }

    public static whereMax<T, T2>(array: T[], select: (item: T) => T2, caseInsensitiveStringComparison?: boolean | undefined | null): T[] {
        if (ArrayHelper.isNullOrEmpty(array))
            return [];

        var max = ArrayHelper.maxSelect(array, select);
        return array.filter(t => TypeHelper.compare(select(t), max, -1, caseInsensitiveStringComparison) === 0);
    }
}