BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Reservation] DROP CONSTRAINT [Reservation_eventId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Reservation] DROP CONSTRAINT [Reservation_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Review] DROP CONSTRAINT [Review_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Wishlist] DROP CONSTRAINT [Wishlist_eventId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Wishlist] DROP CONSTRAINT [Wishlist_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Event] DROP CONSTRAINT [Event_managerId_df];

-- AddForeignKey
ALTER TABLE [dbo].[Event] ADD CONSTRAINT [Event_managerId_fkey] FOREIGN KEY ([managerId]) REFERENCES [dbo].[User]([userId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Review] ADD CONSTRAINT [Review_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([userId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Wishlist] ADD CONSTRAINT [Wishlist_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([userId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Wishlist] ADD CONSTRAINT [Wishlist_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([eventId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Reservation] ADD CONSTRAINT [Reservation_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([eventId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Reservation] ADD CONSTRAINT [Reservation_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([userId]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
