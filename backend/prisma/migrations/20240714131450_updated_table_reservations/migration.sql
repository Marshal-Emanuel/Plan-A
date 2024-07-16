/*
  Warnings:

  - You are about to drop the `Ticket` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ticket] DROP CONSTRAINT [Ticket_eventId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ticket] DROP CONSTRAINT [Ticket_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Event] ADD [discount] FLOAT(53) CONSTRAINT [Event_discount_df] DEFAULT 0;

-- DropTable
DROP TABLE [dbo].[Ticket];

-- CreateTable
CREATE TABLE [dbo].[Reservation] (
    [reservationId] NVARCHAR(1000) NOT NULL,
    [eventId] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [isRegular] BIT NOT NULL CONSTRAINT [Reservation_isRegular_df] DEFAULT 0,
    [isVIP] BIT NOT NULL CONSTRAINT [Reservation_isVIP_df] DEFAULT 0,
    [isChildren] BIT NOT NULL CONSTRAINT [Reservation_isChildren_df] DEFAULT 0,
    [proxyName] NVARCHAR(1000),
    [numberOfPeople] INT NOT NULL CONSTRAINT [Reservation_numberOfPeople_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Reservation_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Reservation_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Reservation_pkey] PRIMARY KEY CLUSTERED ([reservationId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Reservation] ADD CONSTRAINT [Reservation_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([eventId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Reservation] ADD CONSTRAINT [Reservation_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([userId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
