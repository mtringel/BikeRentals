SET IDENTITY_INSERT [dbo].[Environment] ON 
GO

IF NOT EXISTS (SELECT * FROM [dbo].[Environment])
BEGIN
    INSERT [dbo].[Environment] ([EnvironmentId], [EnvironmentCode], [EnvironmentName]) VALUES (1, N'DEV', N'DEV')
    INSERT [dbo].[Environment] ([EnvironmentId], [EnvironmentCode], [EnvironmentName]) VALUES (2, N'TST', N'TST')
    INSERT [dbo].[Environment] ([EnvironmentId], [EnvironmentCode], [EnvironmentName]) VALUES (3, N'PRD', N'PRD')
END
GO

SET IDENTITY_INSERT [dbo].[Environment] OFF
GO