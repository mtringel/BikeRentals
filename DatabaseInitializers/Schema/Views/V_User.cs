using Microsoft.EntityFrameworkCore;
using System;
using Toptal.BikeRentals.CallContext;
using Toptal.BikeRentals.Configuration;
using Toptal.BikeRentals.DataAccess;
using Toptal.BikeRentals.DatabaseInitializers.Helpers;

namespace Toptal.BikeRentals.DatabaseInitializers.Schema.Views
{
    internal class V_User : DatabaseInitializerBase
    {
        internal V_User(
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
                -- drop foreign keys
                ALTER TABLE dbo.Bikes               DROP CONSTRAINT [FK_Bikes_V_User_CreatedByUserId]
                ALTER TABLE dbo.BikeRates           DROP CONSTRAINT [FK_BikeRates_V_User_UserId]
                ALTER TABLE dbo.BikeRents           DROP CONSTRAINT [FK_BikeRents_V_User_UserId]
                ALTER TABLE dbo.BikeRents           DROP CONSTRAINT [FK_BikeRents_V_User_CreatedByUserId]

                -- drop EF generated table
                DROP TABLE [dbo].[V_User]

                -- re-create foreign keys to AspNetUsers table
                ALTER TABLE dbo.Bikes               ADD CONSTRAINT FK_Bikes_AspNetUsers_CreatedByUserId     FOREIGN KEY (CreatedByUserId)   REFERENCES dbo.AspNetUsers (Id) ON UPDATE NO ACTION ON DELETE NO ACTION
                ALTER TABLE dbo.BikeRates           ADD CONSTRAINT FK_BikeRates_AspNetUsers_UserId          FOREIGN KEY (UserId)            REFERENCES dbo.AspNetUsers (Id) ON UPDATE NO ACTION ON DELETE NO ACTION
                ALTER TABLE dbo.BikeRents           ADD CONSTRAINT FK_BikeRents_AspNetUsers_UserId          FOREIGN KEY (UserId)            REFERENCES dbo.AspNetUsers (Id) ON UPDATE NO ACTION ON DELETE NO ACTION
                ALTER TABLE dbo.BikeRents           ADD CONSTRAINT FK_BikeRents_AspNetUsers_CreatedByUserId FOREIGN KEY (CreatedByUserId)   REFERENCES dbo.AspNetUsers (Id) ON UPDATE NO ACTION ON DELETE NO ACTION
                ");

            // 2) Create V_User view
            // EF cannot be told to not create table for V_User, but we need to map it for reading.
            // We create V_User_Temp view, EF creates V_User table, which we will drop and rename our view.
            AppDbContext.Database.ExecuteSqlCommand(@"
CREATE VIEW [dbo].[V_User] 
AS
SELECT
    [User].Id AS UserId,
    [User].FirstName,
    [User].LastName,
    [User].Email,
    [User].UserName,
    RoleName =
        (SELECT TOP 1
            [Role].Name
        FROM
            [dbo].[AspNetRoles] AS [Role] WITH (NOLOCK) 

            INNER JOIN [dbo].[AspNetUserRoles] AS [UserRole] WITH (NOLOCK) ON 
				[UserRole].RoleId = [Role].Id
        WHERE
            [UserRole].UserId = [User].Id
        )
FROM
    [dbo].[AspNetUsers] AS [User] WITH (NOLOCK) -- do not conflict with ASP Net Identity
                ");
        }
    }
}
