import { TypeHelper } from "./typeHelper";
import { StringHelper } from "./stringHelper";

/// <summary>
/// Helper methods for dates
/// </summary>
export class DateHelper {

    /// <summary>
    /// Returns timezone offset in minutes.
    /// </summary>
    public static timezoneOffset() {
        return new Date().getTimezoneOffset();
    }

    /// <summary>
    /// Date + time. Time is zero in client's timezone.
    /// </summary>
    public static now(): Date { return new Date(); }

    /// <summary>
    /// Date only
    /// </summary>
    public static today(): Date {
        return DateHelper.datePart(DateHelper.now(), true);
    }


    /// <summary>
    /// We keep our dates on client side "timezone shifted", which means, hours are set so, that Utc Hour is zero.
    /// Time is zero in UTC, which means, the returned date will contain Hour = timezoneOffset / 60 * (-1).
    /// </summary>
    public static todayUtc(): Date {
        return DateHelper.datePart(DateHelper.now(), false);
    }

    /// <summary>
    /// We keep our dates on client side "timezone shifted", which means, hours are set so, that Utc Hour is zero.
    /// Is it possible, that local date is one day ahead of or late from Utc day. We prefer the local day here.
    /// </summary>
    public static datePart(d: Date | undefined | null, preferLocalDayOverUtcDay: boolean): Date | undefined | null {
        if (!preferLocalDayOverUtcDay)
            d = DateHelper.addMinutes(d, d.getTimezoneOffset());

        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, d.getTimezoneOffset() * (-1), 0, 0);
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
        emptyOrNullValue?: string | undefined | null
    ): string | null {
        return TypeHelper.isNullOrEmpty(d) ? StringHelper.notNullOrEmpty(emptyOrNullValue, "") : d.toISOString();
    }

    public static parseISOString(value: string | undefined | null, dateOnly: boolean): Date | null {
        try {
            return StringHelper.isNullOrEmpty(value) ? null : dateOnly ? DateHelper.datePart(new Date(value), true) : new Date(value);
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

    public static addDays(date: Date, days: number): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }

    public static addMinutes(date: Date, minutes: number): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + minutes, date.getSeconds(), date.getMilliseconds());
    }

    public static addHours(date: Date, hours: number): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + hours, date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }

    public static addDaysInPlace(date: Date, days: number) {
        date.setDate(date.getDate() + days);
    }

    public static addMinutesInPlance(date: Date, minutes: number) {
        date.setMinutes(date.getMinutes() + minutes);
    }

    public static addHoursInPlace(date: Date, hours: number) {
        date.setHours(date.getHours() + hours);
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

    /// <summary>
    /// https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
    /// a + result = b
    /// </summary>
    public static dateDiffInMinutes(a: Date, b: Date): number {
        // Discard the time and time-zone information.
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / (1000 * 60));
    }

    public static parseDateMilliseconds(str: string | number | null | undefined, valueOnError?: Date | null | undefined): Date | null {
        var s = TypeHelper.toString(str);

        if (s === "")
            return TypeHelper.notNullOrEmpty(valueOnError, null);
        else
            try {
                var ms = StringHelper.parseNumber(s, null);
                return ms === null ? TypeHelper.notNullOrEmpty(valueOnError, null) : new Date(ms);
            }
            catch (err) {
            }
    }

    public static setDateParts(
        d: Date,
        options: Partial<{ year: number, month: number, day: number, hours: number, minutes: number, seconds: number, milliseconds: number }>
    ): Date {
        return new Date(
            TypeHelper.notNullOrEmpty(options.year, d.getFullYear()),
            TypeHelper.notNullOrEmpty(options.month, d.getMonth()),
            TypeHelper.notNullOrEmpty(options.day, d.getDate()),
            TypeHelper.notNullOrEmpty(options.hours, d.getHours()),
            TypeHelper.notNullOrEmpty(options.minutes, d.getMinutes()),
            TypeHelper.notNullOrEmpty(options.seconds, d.getSeconds()),
            TypeHelper.notNullOrEmpty(options.milliseconds, d.getMilliseconds())
        );
    }
}