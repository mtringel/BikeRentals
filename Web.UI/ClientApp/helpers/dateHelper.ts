import { TypeHelper } from "./typeHelper";
import { StringHelper } from "./stringHelper";

/// <summary>
/// Helper methods for dates
/// </summary>
export class DateHelper {

    /// <summary>
    /// Date + time
    /// </summary>
    public static now(): Date { return new Date(); }

    /// <summary>
    /// Date only
    /// </summary>
    public static today(): Date {
        return DateHelper.datePart(DateHelper.now());
    }

    public static datePart(d: Date | undefined | null): Date | undefined | null{
        return TypeHelper.isNullOrEmpty(d) ? d : new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    public static compateDate(d1: Date | undefined | null, d2: Date | undefined | null, dateOnly: boolean): boolean {
        if (TypeHelper.isNullOrEmpty(d1))
            return TypeHelper.isNullOrEmpty(d2);
        else
            return !TypeHelper.isNullOrEmpty(d2) &&
                d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate() &&
                (dateOnly || (
                    d1.getHours() === d2.getHours() &&
                    d1.getMinutes() === d2.getMinutes() &&
                    d1.getSeconds() === d2.getSeconds() &&
                    d1.getMilliseconds() === d2.getMilliseconds()
                ));
    }

    public static toISOString(
        d: Date | undefined | null,
        noTimeZoneConversion: boolean, // don't convert to UTC, just keep the hour as it is
        emptyOrNullValue?: string | undefined | null
    ): string {
        return TypeHelper.isNullOrEmpty(d) ?
            StringHelper.notNullOrEmpty(emptyOrNullValue, "") :
            (noTimeZoneConversion ? DateHelper.addMinutes(d, d.getTimezoneOffset() * (-1)) : d).toISOString();
    }

    public static parseISOString(value: string | undefined | null, dateOnly: boolean): Date | null {
        try {
            return StringHelper.isNullOrEmpty(value) ? null : dateOnly ? DateHelper.datePart(new Date(value)) : new Date(value);
        }
        catch (err) {
            return null;
        }
    }

    public static max(d1: Date | undefined | null, d2: Date | undefined | null): Date | null {
        if (TypeHelper.isNullOrEmpty(d1))
            return TypeHelper.notNullOrEmpty(d2, null);
        else if (TypeHelper.isNullOrEmpty(d2))
            return null;
        else
            return d1 >= d2 ? d1 : d2;
    }

    public static min(d1: Date | undefined | null, d2: Date | undefined | null): Date | null {
        if (TypeHelper.isNullOrEmpty(d1))
            return TypeHelper.notNullOrEmpty(d2, null);
        else if (TypeHelper.isNullOrEmpty(d2))
            return null;
        else
            return d1 <= d2 ? d1 : d2;
    }

    /// <summary>
    /// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
    /// </summary>
    public static addDays(date: Date, days: number): Date {
        date.setDate(date.getDate() + days);
        return date;
    }

    /// <summary>
    /// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
    /// </summary>
    public static addMinutes(date: Date, minutes: number): Date {
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    }

    /// <summary>
    /// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
    /// </summary>
    public static addHours(date: Date, hours: number): Date {
        date.setHours(date.getHours() + hours);
        return date;
    }

    /// <summary>
    /// https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
    /// a + result = b
    /// </summary>
    public static dateDiffInDays(a: Date, b: Date): number {
        // Discard the time and time-zone information.
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
    }
}