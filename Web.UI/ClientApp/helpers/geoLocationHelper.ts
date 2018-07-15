import { Location } from "../models/master/location";

export class GeoLocationHelper {

    /// <summary>
    /// https://www.w3schools.com/htmL/html5_geolocation.asp
    /// </summary>
    public static GetCurrentLocation(onSuccess: (location: Location) => void, onError: (error: PositionError)=> void) {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                result => onSuccess({ Lat: result.coords.latitude, Lng: result.coords.longitude }),
                error => onError(error)
            );
        } else {
            onError({
                code: PositionError.POSITION_UNAVAILABLE,
                message: "Geolocation is not supported by this browser.",
                PERMISSION_DENIED: PositionError.PERMISSION_DENIED,
                POSITION_UNAVAILABLE: PositionError.POSITION_UNAVAILABLE,
                TIMEOUT: PositionError.TIMEOUT
            });
        }
    }
}