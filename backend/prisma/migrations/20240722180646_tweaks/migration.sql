BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Event] ALTER COLUMN [childrenPrice] FLOAT(53) NULL;
ALTER TABLE [dbo].[Event] ALTER COLUMN [hasChildren] BIT NULL;
ALTER TABLE [dbo].[Event] ALTER COLUMN [hasRegular] BIT NULL;
ALTER TABLE [dbo].[Event] ALTER COLUMN [hasVIP] BIT NULL;
ALTER TABLE [dbo].[Event] ALTER COLUMN [isPromoted] BIT NULL;
ALTER TABLE [dbo].[Event] ALTER COLUMN [regularPrice] FLOAT(53) NULL;
ALTER TABLE [dbo].[Event] ALTER COLUMN [vipPrice] FLOAT(53) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
