-- =================================================
-- Create User as DBO template for SQL Azure Database
-- =================================================

IF NOT EXISTS (SELECT * FROM sys.sysusers WHERE Name = N'$userName')
BEGIN
    CREATE USER [$userName]
	WITH PASSWORD = N'$password'

    -- Add user to the database owner role
    EXEC sp_addrolemember N'db_datareader', N'$userName'
    EXEC sp_addrolemember N'db_datawriter', N'$userName'
END

GO
