using Newtonsoft.Json;
using System;
using Toptal.BikeRentals.BusinessEntities.Helpers;

namespace Toptal.BikeRentals.BusinessEntities.Master
{
    public struct Location
    {
        public const int DegMultiplier = 60 * 60 * 1000;
        public const int SecMultiplier = 60 * 1000;
        public const int ParSeccMultiplier = 1000;

        /// <summary>
        /// Each degree of latitude is approximately 69 miles (111 kilometers) apart.
        /// At the equator, the distance is 68.703 miles(110.567 kilometers)
        /// At the Tropic of Cancer and Tropic of Capricorn(23.5° north and south), the distance is 68.94 miles(110.948 kilometers)
        /// At each of the poles, the distance is 69.407 miles(111.699 kilometers).
        /// https://www.thoughtco.com/degree-of-latitude-and-longitude-distance-4070616
        /// </summary>
        public const double LatDistanceOfDeg = 68.555; // (68.407d + 68.703d) * 0.5d;

        public const double LngDistanceOfDegAtEquator = 69.172d;

        /// <summary>
        /// 1 degree of Longitude = cosine (latitude in decimal degrees) * length of degree (miles) at equator
        /// https://gis.stackexchange.com/questions/142326/calculating-longitude-length-in-miles
        /// </summary>
        public static double LngDistanceOfDegAtLat(double lat) { return Math.Cos(lat * Math.PI / 180d) * LngDistanceOfDegAtEquator; }

        /// <summary>
        /// Latitude, whele degree.
        /// </summary>
        public double Lat { get; set; }

        /// <summary>
        /// Longitude, degree.
        /// From +180(W) to -180(E).
        /// </summary>
        public double Lng { get; set; }

        [JsonIgnore]
        public char LatSuffix { get { return Lat >= 0 ? 'N' : 'S'; } }

        [JsonIgnore]
        public char LngSuffix { get { return Lng >= 0 ? 'E' : 'W'; } }

        public static string FormatDegSecParSec(double deg, char posSuffix, char negSuffix) {
            var x = Math.Abs((int)Math.Round(deg * DegMultiplier));
            return string.Format("{0}°{1:00}'{2:00}.{3:000}\"{4}",
                x / DegMultiplier,
                (x / SecMultiplier) % 60,
                (x / ParSeccMultiplier) % 60,
                x % ParSeccMultiplier,
                deg >= 0 ? posSuffix : negSuffix
                );
        }

        public static double? ParseDegSecParSec(string formatted)
        {
            if (string.IsNullOrEmpty(formatted)) return null;

            formatted = formatted.Trim();

            var d = formatted.IndexOf('°');
            if (d < 0) return null;

            var s = formatted.IndexOf('\'', d + 1);
            if (s < 0) return null;

            var psdot = formatted.IndexOf('.', s + 1);
            if (psdot < 0) return null;

            var ps = formatted.IndexOf('"', psdot + 1);
            if (ps < 0) return null;

            var suffix = formatted[formatted.Length - 1];

            return
                (suffix == 'S' || suffix == 'W' ? -1 : 1)
                *
                (double.Parse(formatted.Substring(0, d)) + // deg
                double.Parse(formatted.Substring(d + 1, s - d - 1)) * ((double)DegMultiplier / (double)SecMultiplier) + // sec
                double.Parse(formatted.Substring(s + 1, psdot - s - 1)) * ((double)DegMultiplier / (double)ParSeccMultiplier) + // parsec (whole)
                double.Parse(formatted.Substring(psdot + 1, ps - psdot - 1)) / (double)DegMultiplier // parse (fract)
                );
        }

        [JsonIgnore]
        public string LatFormatted
        {
            get { return FormatDegSecParSec(Lat, 'N', 'S'); }
        }

        [JsonIgnore]
        public string LngFormatted
        {
            get { return FormatDegSecParSec(Lng, 'E', 'W'); }
        }

        public Location(double lat, double lng)
        {
            if (lat < -90d || lat > 90d || lng < -180d || lng > 180d)
                throw new ArgumentException($"Invalid position Lat={lat}, Lng={lng}.");

            this.Lat = lat;
            this.Lng = lng;
        }

        public Location(string str)
        {
            var k = str.Split(' ');
            this.Lat = ParseDegSecParSec(k[0]).Value;
            this.Lng = ParseDegSecParSec(k[1]).Value;
        }

        public override string ToString()
        {
            return $"{LatFormatted} {LngFormatted}";
        }

        /// <summary>
        /// Implemented also in ufn_GeoDistanceMiles.
        /// </summary>
        public static double DistanceMiles(Location loc1, Location loc2)
        {
            var lngDiff = Math.Abs(loc1.Lng - loc2.Lng);
            if (lngDiff > 180d) lngDiff = 360d - lngDiff; // the other way around

            // arithmetic average is cheating, we should calculate fix integral below cosine from lat1 to lat2 for an airplane crossing many latitudes
            var lngDist = (LngDistanceOfDegAtLat(loc1.Lat) + LngDistanceOfDegAtLat(loc2.Lat)) * 0.5d * lngDiff;
            var latDist = LatDistanceOfDeg * Math.Abs(loc1.Lat - loc2.Lat);

            // calculate the diagonal
            return Math.Sqrt(lngDist * lngDist + latDist * latDist);
        }
    }
}