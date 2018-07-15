import { TypeHelper } from "../../helpers/typeHelper";
import { StringHelper } from "../../helpers/stringHelper";

export class Interval<T> {
    public readonly From: T;

    public readonly To: T;

    public static compare<T>(int1: Interval<T>, int2: Interval<T>): boolean {
        return int1.From === int2.From && int1.To === int2.To;
    }

    public static format<T>(
        interval: Interval<T>,
        formatValue: (value: T) => string,
        compactIfEquals?: ((from: T, to: T) => boolean) | undefined | null,
        empty?: string | undefined | null,
        emptyFrom?: string | undefined | null,
        emptyTo?: string | undefined | null,
        separator?: string | undefined | null
    ): string {
        if (TypeHelper.isNullOrEmpty(interval.From)) {
            if (TypeHelper.isNullOrEmpty(interval.To))
                return StringHelper.notNullOrEmpty(empty, "");
            else if (!StringHelper.isNullOrEmpty(emptyFrom))
                return emptyFrom + StringHelper.notNullOrEmpty(separator, " - ") + formatValue(interval.To);
            else
                return formatValue(interval.To);
        } else if (TypeHelper.isNullOrEmpty(interval.To)) {
            if (!StringHelper.isNullOrEmpty(emptyTo))
                return formatValue(interval.From) + StringHelper.notNullOrEmpty(separator, " - ") + emptyTo;
            else
                return formatValue(interval.From);
        } else if (!TypeHelper.isNullOrEmpty(compactIfEquals) && compactIfEquals(interval.From, interval.To))
            return formatValue(interval.From);
        else 
            return formatValue(interval.From) + StringHelper.notNullOrEmpty(separator, " - ") + formatValue(interval.To);
    }
}