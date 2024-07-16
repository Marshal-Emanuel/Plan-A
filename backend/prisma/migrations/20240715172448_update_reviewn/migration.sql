/*
  Warnings:

  - Added the required column `eventId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Review] DROP CONSTRAINT [Review_userId_key];

-- AlterTable
ALTER TABLE [dbo].[Review] ADD [eventId] NVARCHAR(1000) NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[SystemReview] (
    [systemReviewId] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [comment] NVARCHAR(1000) NOT NULL,
    [rating] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [SystemReview_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [SystemReview_pkey] PRIMARY KEY CLUSTERED ([systemReviewId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Review] ADD CONSTRAINT [Review_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([eventId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SystemReview] ADD CONSTRAINT [SystemReview_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([userId]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
