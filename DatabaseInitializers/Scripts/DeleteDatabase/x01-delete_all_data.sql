-- Tx
DELETE FROM dbo.CloudIDRequest
GO

DELETE FROM dbo.SubscriptionRequest
GO

DELETE FROM dbo.WorkflowInstance
GO

-- Master
DELETE FROM dbo.[User]
GO

DELETE FROM dbo.UserSession
GO

DELETE FROM dbo.Environment
GO
