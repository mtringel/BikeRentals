import { TypeHelper } from "./typeHelper";

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

    public static compateDate(d1: Date | undefined | null, d2: Date | undefined | null): boolean {
        if (TypeHelper.isNullOrEmpty(d1))
            return TypeHelper.isNullOrEmpty(d2);
        else
            return !TypeHelper.isNullOrEmpty(d2) &&
                d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate();
    }
}