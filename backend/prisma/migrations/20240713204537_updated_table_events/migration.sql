BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Event] DROP CONSTRAINT [Event_updatedAt_df];
ALTER TABLE [dbo].[Event] ADD [childrenPrice] FLOAT(53) NOT NULL CONSTRAINT [Event_childrenPrice_df] DEFAULT 0,
[hasChildren] BIT NOT NULL CONSTRAINT [Event_hasChildren_df] DEFAULT 0,
[hasRegular] BIT NOT NULL CONSTRAINT [Event_hasRegular_df] DEFAULT 0,
[hasVIP] BIT NOT NULL CONSTRAINT [Event_hasVIP_df] DEFAULT 0,
[isPromoted] BIT NOT NULL CONSTRAINT [Event_isPromoted_df] DEFAULT 0,
[nature] NVARCHAR(1000) NOT NULL CONSTRAINT [Event_nature_df] DEFAULT 'PENDING',
[promoDetails] NVARCHAR(1000),
[regularPrice] FLOAT(53) NOT NULL CONSTRAINT [Event_regularPrice_df] DEFAULT 0,
[status] NVARCHAR(1000) NOT NULL CONSTRAINT [Event_status_df] DEFAULT 'ACTIVE',
[vipPrice] FLOAT(53) NOT NULL CONSTRAINT [Event_vipPrice_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
