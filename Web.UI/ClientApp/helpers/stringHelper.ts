import { TypeHelper } from "./typeHelper";
import { ArrayHelper } from "./arrayHelper";
import { MathHelper } from "./mathHelper";

/// <summary>
/// Helper functions for working with strings
/// </summary>
export class StringHelper {

    public static replaceAll(str: string | null, search: string | null, replace: string | null): string {
        if (StringHelper.isNullOrEmpty(str) || StringHelper.isNullOrEmpty(search) || replace === undefined || replace === null)
            return str;
        else
            return str.split(search).join(replace);
    }

    public static contains(str: string | null, search: string | null, ignoreCase?: boolean | undefined | null): boolean {
        if (str === undefined || str === null || search === undefined || search === null)
            return false;
        else if (ignoreCase === true)
            return str.toLowerCase().indexOf(search.toLowerCase()) >= 0;
        else
            return str.indexOf(search) >= 0;
    }

    public static capitalize(str: string | null, allWords?: boolean | undefined | null): string {

        if (StringHelper.isNullOrEmpty(str))
            return str;

        var length = str.length;

        if (allWords) {
            var res = "";
            var start = 0;

            for (var i = 0; i < length; i++)
                if (str.charAt(i) === ' ') {
                    res += StringHelper.capitalize(str.substring(start, i));
                    start = i + 1;
                }

            if (start < length)
                res += StringHelper.capitalize(str.substr(start));

            else
                return str.substr(0, 1).toUpperCase() + (length > 1 ? str.substr(1) : "");
        }
    }

    public static parseBool(str: string | null, valueIfError?: boolean | undefined | null): boolean {

        if (StringHelper.isNullOrEmpty(str))
            return valueIfError === true;
        else {
            var s = str.toLowerCase();
            return s === "true" || s === "yes" || s === "on" || s === "1" || s === "y";
        }
    }

    public static equals(str1: string | null, str2: string | null, ignoreCase?: boolean | undefined | null): boolean {

        if (StringHelper.isNullOrEmpty(str1))
            return StringHelper.isNullOrEmpty(str2);
        else if (StringHelper.isNullOrEmpty(str2))
            return false;
        else if (ignoreCase === true)
            return str1.toLowerCase() === str2.toLowerCase();
        else
            return str1 === str2;
    }

    public static join<T>(items: T[], separator: string, select?: ((item: T) => any) | undefined | null): string {

        if (items === null)
            return "";
        else {
            var length = items.length;

            if (length === 0)
                return "";
            else {
                var result = "";

                if (select === null)
                    select = t => t;

                for (var i = 0; i < length; i++) {
                    if (i > 0)
                        result += separator;

                    var obj = select(items[i]);

                    if (obj !== null)
                        result += obj.toString();
                }

                return result;
            }
        }
    }

    public static notNullOrEmpty(value: string | undefined | null, valueIfNullOrEmpty: string | undefined | null): string | undefined | null {
        return StringHelper.isNullOrEmpty(value) ? valueIfNullOrEmpty : value;
    }

    public static isNullOrEmpty(value: string | undefined | null): boolean {
        return value === undefined || value === null || value === "";
    }

    public static formatNumber(value: number | undefined | null, leadingZeros: number, digits: number, suffix?: string | undefined | null): string {
        if (TypeHelper.isNullOrEmpty(value))
            return "";
        else {
            var whole = Math.floor(Math.abs(value)).toString();

            if (whole.length >= leadingZeros)
                return value.toFixed(digits) + StringHelper.notNullOrEmpty(suffix, "");
            else
                return "00000000000000000000000000000000000".substr(0, leadingZeros - whole.length) + value.toFixed(digits) + StringHelper.notNullOrEmpty(suffix, "");
        }
    }

    public static formatDate(value: Date | undefined | null, format: string): string {
        if (TypeHelper.isNullOrEmpty(value))
            return "";
        else {
            var year = value.getFullYear();
            var month = value.getMonth();
            var day = value.getDate();
            var hour = value.getHours();
            var minute = value.getMinutes();

            // AM/PM
            var hourResolved: number;
            var amPm: string;

            if (StringHelper.contains(format, "a")) {
                if (hour === 0) {
                    hourResolved = 12;
                    amPm = "AM";
                }
                else if (hour < 12) {
                    hourResolved = hour;
                    amPm = "AM";
                }
                else if (hour === 12) {
                    hourResolved = hour;
                    amPm = "PM";
                }
                else {
                    hourResolved = hour - 12;
                    amPm = "PM";
                }
            }
            else {
                hourResolved = hour;
                amPm = "";
            }

            return format
                .replace("yyyy", StringHelper.formatNumber(year, 4, 0))
                .replace("yy", StringHelper.formatNumber(year % 100, 2, 0))
                .replace("MM", StringHelper.formatNumber(month, 2, 0))
                .replace("M", month.toString())
                .replace("dd", StringHelper.formatNumber(day, 2, 0))
                .replace("d", day.toString())
                .replace("hh", StringHelper.formatNumber(hourResolved, 2, 0))
                .replace("h", hourResolved.toString())
                .replace("mm", StringHelper.formatNumber(minute, 2, 0))
                .replace("m", minute.toString())
                .replace("a", amPm)
        }
    }

    public static arrayContains(array: string[], value: string, ignoreCase?: boolean | undefined | null): boolean {
        return ArrayHelper.any(array, t => StringHelper.equals(t, value, ignoreCase));
    }


    public static parseNumber(
        str: string,
        allowEmpty: boolean,
        returnOnError?: number | undefined | null,
        roundToDigits?: number | undefined | null,
        min?: number | undefined | null,
        max?: number | undefined | null
    ): number | null {

        if (StringHelper.isNullOrEmpty(str))
            return allowEmpty ? null : returnOnError !== undefined ? returnOnError : NaN;

        var value = parseFloat(str);

        if (isNaN(value))
            return returnOnError !== undefined ? returnOnError : NaN;
        else {
            if (!TypeHelper.isNullOrEmpty(roundToDigits))
                value = MathHelper.roundNumber(value, roundToDigits);

            if (!TypeHelper.isNullOrEmpty(min) && value < min)
                return min;
            else if (!TypeHelper.isNullOrEmpty(max) && value > max)
                return max;
            else
                return value;
        }
    }

    public static startsWith(str: string, suffix: string, ignoreCase?: boolean | undefined | null): boolean {
        return str !== undefined &&
            str !== null &&
            suffix !== undefined &&
            suffix !== null &&
            str.length >= suffix.length &&
            StringHelper.equals(str.substr(0, suffix.length), suffix, ignoreCase);
    }

    public static endsWith(str: string, suffix: string, ignoreCase?: boolean | undefined | null): boolean {
        return str !== undefined &&
            str !== null &&
            suffix !== undefined &&
            suffix !== null &&
            str.length >= suffix.length &&
            StringHelper.equals(str.substr(str.length - suffix.length, suffix.length), suffix, ignoreCase);
    }

    public static formatBool(value: boolean | undefined | null, ifTrue: string, ifFalse: string, ifNull?: string | undefined | null) {
        if (TypeHelper.isNullOrEmpty(value))
            return StringHelper.notNullOrEmpty(ifNull, "");
        else
            return value === true ? ifTrue : ifFalse;
    }

    public static removeSuffix(str: string, suffix: string, trim: boolean, ignoreCase?: boolean | undefined | null): string {
        return !StringHelper.endsWith(str, suffix, ignoreCase) ? str :
            trim ? str.substr(0, str.length - suffix.length).trim() :
                str.substr(0, str.length - suffix.length);
    }
}