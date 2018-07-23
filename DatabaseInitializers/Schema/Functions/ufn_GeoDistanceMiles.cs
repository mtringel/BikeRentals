using Microsoft.EntityFrameworkCore;
using System;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess;
using Toptal.BikeRentals.DatabaseInitializers.Helpers;

namespace Toptal.BikeRentals.DatabaseInitializers.Schema.Functions
{
    internal class ufn_GeoDistanceMiles : DatabaseInitializerBase
    {
        internal ufn_GeoDistanceMiles(
            ICallContext callContext,
            AppDbContext appDbContext,
            AppConfig appConfig
            )
            : base(callContext, appDbContext, appConfig)
        {
        }

        public override void InitializeDatabase()
        {
        }

        public override void AfterDatabaseInitialized()
        {
            // EF cannot be told to not create table for V_User, but we need to map it for reading.
            // We create V_User_Temp view, EF creates V_User table, which we will drop and rename our view.

            // 1) Drop V_User table and foreign keys. Re-create foreign keys to AspNetUsers table.
            AppDbContext.Database.ExecuteSqlCommand(@"
-- <summary>
-- Implemented also in Location.DistanceMiles
-- Precision is secondary (uses FLOAT instead of DECIMAL)
-- </summary>
CREATE FUNCTION dbo.ufn_GeoDistanceMiles
(
	@Lat1Deg	FLOAT,
	@Lng1Deg	FLOAT,

	@Lat2Deg	FLOAT,
	@Lng2Deg	FLOAT
)
RETURNS FLOAT
AS
BEGIN
    DECLARE @LngDiff FLOAT 
	SET @LngDiff = ABS(@Lng1Deg - @Lng2Deg)

    IF @LngDiff > 180 SET @LngDiff = 360 - @LngDiff -- the other way around

    DECLARE 
        @LngDist FLOAT,
        @LatDist FLOAT

    -- arithmetic average is cheating, we should calculate fix integral below cosine from lat1 to lat2 for an airplane crossing many latitudes
	-- 68.555 is the distance of 1 deg Lat in miles (average)
	-- 69.172 is the distance of 1 deg Lng in miles on the equator
    SELECT
        @LngDist = (COS(@Lat1Deg * PI() / 180) + COS(@Lat2Deg * PI() / 180)) * 0.5 * 69.172 * @LngDiff,
        @LatDist = 68.555 * ABS(@Lat1Deg - @Lat2Deg)

    RETURN SQRT(@LngDist * @LngDist + @LatDist * @LatDist)

END
                ");
        }
    }
}
