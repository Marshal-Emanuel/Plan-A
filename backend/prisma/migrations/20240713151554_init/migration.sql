BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Event] (
    [eventId] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [moreInfo] NVARCHAR(1000) NOT NULL,
    [location] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL,
    [time] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Event_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Event_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [image] VARCHAR(max),
    CONSTRAINT [Event_pkey] PRIMARY KEY CLUSTERED ([eventId])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [userId] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [phoneNumber] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'user',
    [accountStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [User_accountStatus_df] DEFAULT 'active',
    [password] NVARCHAR(1000) NOT NULL,
    [profilePicture] VARCHAR(max),
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([userId]),
    CONSTRAINT [User_phoneNumber_key] UNIQUE NONCLUSTERED ([phoneNumber]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Ticket] (
    [ticketId] NVARCHAR(1000) NOT NULL,
    [eventId] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [ticketType] NVARCHAR(1000) NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [quantity] INT NOT NULL CONSTRAINT [Ticket_quantity_df] DEFAULT 1,
    [isGroupTicket] BIT NOT NULL CONSTRAINT [Ticket_isGroupTicket_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ticket_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Ticket_pkey] PRIMARY KEY CLUSTERED ([ticketId])
);

-- CreateTable
CREATE TABLE [dbo].[Review] (
    [reviewId] NVARCHAR(1000) NOT NULL,
    [comment] NVARCHAR(1000) NOT NULL,
    [rating] INT NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Review_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Review_pkey] PRIMARY KEY CLUSTERED ([reviewId])
);

-- CreateTable
CREATE TABLE [dbo].[Wishlist] (
    [wishlistId] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [eventId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Wishlist_pkey] PRIMARY KEY CLUSTERED ([wishlistId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([eventId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([userId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Review] ADD CONSTRAINT [Review_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([userId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Wishlist] ADD CONSTRAINT [Wishlist_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([userId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Wishlist] ADD CONSTRAINT [Wishlist_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([eventId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
