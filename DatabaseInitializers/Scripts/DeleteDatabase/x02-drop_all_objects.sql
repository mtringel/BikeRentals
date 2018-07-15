ALTER TABLE [dbo].[Bikes] DROP CONSTRAINT [FK_Bikes_Colors_ColorId]
GO
ALTER TABLE [dbo].[Bikes] DROP CONSTRAINT [FK_Bikes_BikeModels_BikeModelId]
GO
ALTER TABLE [dbo].[Bikes] DROP CONSTRAINT [FK_Bikes_AspNetUsers]
GO
ALTER TABLE [dbo].[BikeReservations] DROP CONSTRAINT [FK_BikeReservations_Bikes_BikeId]
GO
ALTER TABLE [dbo].[BikeReservations] DROP CONSTRAINT [FK_BikeReservations_AspNetUsers]
GO
ALTER TABLE [dbo].[BikeRates] DROP CONSTRAINT [FK_BikeRates_Bikes_BikeId]
GO
ALTER TABLE [dbo].[BikeRates] DROP CONSTRAINT [FK_BikeRates_AspNetUsers]
GO
ALTER TABLE [dbo].[AspNetUserTokens] DROP CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles] DROP CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles] DROP CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserLogins] DROP CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserClaims] DROP CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetRoleClaims] DROP CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId]
GO
/****** Object:  View [dbo].[V_User]    Script Date: 2018.06.30. 16:15:08 ******/
DROP VIEW [dbo].[V_User]
GO
/****** Object:  Table [dbo].[Colors]    Script Date: 2018.06.30. 16:15:08 ******/
DROP TABLE [dbo].[Colors]
GO
/****** Object:  Table [dbo].[Bikes]    Script Date: 2018.06.30. 16:15:08 ******/
DROP TABLE [dbo].[Bikes]
GO
/****** Object:  Table [dbo].[BikeReservations]    Script Date: 2018.06.30. 16:15:08 ******/
DROP TABLE [dbo].[BikeReservations]
GO
/****** Object:  Table [dbo].[BikeRates]    Script Date: 2018.06.30. 16:15:08 ******/
DROP TABLE [dbo].[BikeRates]
GO
/****** Object:  Table [dbo].[BikeModels]    Script Date: 2018.06.30. 16:15:08 ******/
DROP TABLE [dbo].[BikeModels]
GO
/****** Object:  Table [dbo].[AspNetUserTokens]    Script Date: 2018.06.30. 16:15:08 ******/
DROP TABLE [dbo].[AspNetUserTokens]
GO
/****** Object:  Table [dbo].[AspNetUsers]    Script Date: 2018.06.30. 16:15:08 ******/
DROP TABLE [dbo].[AspNetUsers]
GO
/****** Object:  Table [dbo].[AspNetUserRoles]    Script Date: 2018.06.30. 16:15:08 ******/
DROP TABLE [dbo].[AspNetUserRoles]
GO
/****** Object:  Table [dbo].[AspNetUserLogins]    Script Date: 2018.06.30. 16:15:08 ******/
DROP TABLE [dbo].[AspNetUserLogins]
GO
/****** Object:  Table [dbo].[AspNetUserClaims]    Script Date: 2018.06.30. 16:15:08 ******/
DROP TABLE [dbo].[AspNetUserClaims]
GO
/****** Object:  Table [dbo].[AspNetRoles]    Script Date: 2018.06.30. 16:15:08 ******/
DROP TABLE [dbo].[AspNetRoles]
GO
/****** Object:  Table [dbo].[AspNetRoleClaims]    Script Date: 2018.06.30. 16:15:08 ******/
DROP TABLE [dbo].[AspNetRoleClaims]
GO
