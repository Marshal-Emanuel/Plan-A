/*
  Warnings:

  - Made the column `moreInfo` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `time` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `childrenPrice` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `regularPrice` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vipPrice` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Event] ALTER COLUMN [moreInfo] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Event] ALTER COLUMN [date] DATETIME2 NOT NULL;
ALTER TABLE [dbo].[Event] ALTER COLUMN [time] DATETIME2 NOT NULL;
ALTER TABLE [dbo].[Event] ALTER COLUMN [updatedAt] DATETIME2 NOT NULL;
ALTER TABLE [dbo].[Event] ALTER COLUMN [childrenPrice] FLOAT(53) NOT NULL;
ALTER TABLE [dbo].[Event] ALTER COLUMN [regularPrice] FLOAT(53) NOT NULL;
ALTER TABLE [dbo].[Event] ALTER COLUMN [vipPrice] FLOAT(53) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
