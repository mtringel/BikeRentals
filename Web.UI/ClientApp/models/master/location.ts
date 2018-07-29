import { Model } from "../shared/model";
import { StringHelper } from "../../helpers/stringHelper";
import { TypeHelper } from "../../helpers/typeHelper";

export class Location extends Model {

    public static readonly DegMultiplier = 60 * 60 * 1000;
    public static readonly SecMultiplier = 60 * 1000;
    public static readonly ParSecMultiplier = 1000;

    /// <summary>
    /// Latitude, degree.
    /// From +90(N) to -90(S).
    /// </summary>
    public readonly Lat: number;

    /// <summary>
    /// Longitude, degree.
    /// From +180(E) to -180(W).
    /// </summary>
    public readonly Lng: number;

    public static latSuffix(loc: Location): string { return loc.Lat >= 0 ? 'N' : 'S'; }

    public static lngSuffix(loc: Location): string { return loc.Lat >= 0 ? 'E' : 'W'; }

    public static degSecParSecFormatted(value: number, posSuffix: string, negSuffix: string): string {
        var x = Math.abs(Math.round(value * Location.DegMultiplier));
        // format: {0}°{1:00}'{2:00}.{3:000}"{4}
        return StringHelper.formatNumber(x / Location.DegMultiplier, 0, 0, "°") +
            StringHelper.formatNumber((x / Location.SecMultiplier) % 60, 2, 0, "'") +
            StringHelper.formatNumber((x / Location.ParSecMultiplier) % 60, 2, 0, ".") +
            StringHelper.formatNumber(x % Location.ParSecMultiplier, 3, 0, "\"") +
            (value >= 0 ? posSuffix : negSuffix);
    }

    public static latFormatted(loc: Location): string { return Location.degSecParSecFormatted(loc.Lat, 'N', 'S'); }

    public static lngFormatted(loc: Location): string { return Location.degSecParSecFormatted(loc.Lng, 'E', 'W'); }

    public static format(loc: Location) {
        return Location.latFormatted(loc) + " " + Location.lngFormatted(loc);
    }

    public static compare(l1: Location, l2: Location): boolean {
        if (TypeHelper.isNullOrEmpty(l1))
            return TypeHelper.isNullOrEmpty(l2);
        else
            return !TypeHelper.isNullOrEmpty(l2) && l1.Lat === l2.Lat && l1.Lng === l2.Lng;
    }
}