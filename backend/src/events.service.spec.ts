import { EventsService } from './services/events.service';
import { PrismaClient } from '@prisma/client';
import { EmailService } from './services/email.service';
import { Event } from '@/interfaces/events';

jest.mock('@prisma/client');
jest.mock('../services/email.service');

describe('EventsService', () => {
  let eventsService: EventsService;
  let mockPrisma: any;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    mockPrisma = {
      event: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn()
      },
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn()
      },
      reservation: {
        findMany: jest.fn(),
        count: jest.fn()
      }
    };
    (PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as unknown as PrismaClient);

    mockEmailService = {
      sendNewEventAdminNotification: jest.fn().mockResolvedValue(true),
      sendEventApprovalNotification: jest.fn().mockResolvedValue(true),
      sendNewEventNotification: jest.fn().mockResolvedValue(true),
      sendEventUpdateNotification: jest.fn().mockResolvedValue(true),
      sendEventCancellationNotification: jest.fn().mockResolvedValue(true), sendEventRejectionNotification: jest.fn().mockResolvedValue(true)
    } as unknown as jest.Mocked<EmailService>;



    eventsService = new EventsService();
    (eventsService as any).prisma = mockPrisma;
    (eventsService as any).emailService = mockEmailService;
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      const mockEvent = {
        managerId: "c6ab660a-bfaa-4fb4-90f6-2322981a6fd7",
        name: "Manager Marshal EMail black",
        description: "MarshalEvent",
        moreInfo: "Come to managers meeting, message to admin organized by marshal",
        location: "City Stadium",
        date: new Date("2024-10-03T00:00:00Z"),
        time: new Date("2024-10-03T19:00:00.000Z"),
        numberOfTickets: 100,
        remainingTickets: 100,
        image: "http://example.com/image.jpg",
        hasRegular: true,
        regularPrice: 50.0,
        hasVIP: true,
        vipPrice: 100.0,
        hasChildren: false,
        childrenPrice: 0,
        isPromoted: false,
        promoDetails: undefined,
        status: "ACTIVE",
        nature: "PENDING",

      };

      const mockCreatedEvent = {
        ...mockEvent,
        eventId: 'event-123',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.event.create.mockResolvedValue(mockCreatedEvent);
      mockPrisma.user.findMany.mockResolvedValue([{ email: 'admin@example.com' }]);

      const result = await eventsService.createEvent(mockEvent);

      expect(result).toEqual({
        message: "Event created successfully and admins notified",
        responseCode: 201,
        eventDetails: expect.objectContaining(mockCreatedEvent)
      });

      expect(mockPrisma.event.create).toHaveBeenCalledWith({
        data: expect.objectContaining(mockEvent)
      });
      expect(mockEmailService.sendNewEventAdminNotification).toHaveBeenCalled();
    });
  });



  describe('getEvents', () => {
    it('should fetch all events successfully', async () => {
      const mockEvents = [
        { eventId: 'event-1', name: 'Event 1' },
        { eventId: 'event-2', name: 'Event 2' }
      ];

      mockPrisma.event.findMany.mockResolvedValue(mockEvents);

      const result = await eventsService.getEvents();

      expect(result).toEqual({
        message: "Events retrieved successfully",
        responseCode: 200,
        data: mockEvents
      });
      expect(mockPrisma.event.findMany).toHaveBeenCalled();
    });
  });

  describe('getActiveEvents', () => {
    it('should fetch active and approved events', async () => {
      const mockActiveEvents = [
        { eventId: 'event-1', name: 'Active Event 1', nature: 'APPROVED', status: 'ACTIVE' }
      ];

      mockPrisma.event.findMany.mockResolvedValue(mockActiveEvents);

      const result = await eventsService.getActiveEvents();

      expect(result).toEqual({
        message: "Events retrieved successfully",
        responseCode: 200,
        data: mockActiveEvents
      });
      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        where: { nature: "APPROVED", status: "ACTIVE" }
      });
    });
  });

  describe('getEventById', () => {
    it('should fetch an event by its ID successfully', async () => {
      const mockEventId = 'event-123';
      const mockEvent = {
        eventId: mockEventId,
        name: 'Test Event',
        description: 'Test Description',
        date: new Date(),
        location: 'Test Location'
      };

      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);

      const result = await eventsService.getEventById(mockEventId);

      expect(result).toEqual({
        message: "Event retrieved successfully",
        responseCode: 200,
        data: mockEvent
      });
      expect(mockPrisma.event.findUnique).toHaveBeenCalledWith({
        where: { eventId: mockEventId }
      });
    });

    it('should handle errors when fetching an event', async () => {
      const mockEventId = 'non-existent-event';
      mockPrisma.event.findUnique.mockRejectedValue(new Error('Database error'));

      const result = await eventsService.getEventById(mockEventId);

      expect(result).toEqual({
        message: "Error occurred while fetching event.",
        responseCode: 500,
        error: expect.any(Error)
      });
    });
  });


  describe('updateEvent', () => {
    it('should update an event successfully', async () => {
      const mockEventId = 'event-123';
      const mockUpdatedEvent: Event = {
        name: 'Updated Event Name',
        description: 'Updated Description',
        moreInfo: 'Additional Info',
        location: 'New Location',
        date: new Date(),
        time: new Date(),
        numberOfTickets: 200,
        remainingTickets: 200,
        managerId: 'manager-123',
        image: 'http://example.com/updated-image.jpg',
        hasRegular: true,
        regularPrice: 50,
        hasVIP: true,
        vipPrice: 100,
        hasChildren: false,
        childrenPrice: 0,
        isPromoted: false,
        promoDetails: "fre events update",
        status: 'ACTIVE',
        nature: 'PENDING'
      };





      const mockExistingEvent = {
        ...mockUpdatedEvent,
        eventId: mockEventId,
        managerId: 'manager-123',

      };

      mockPrisma.event.update.mockResolvedValue({
        ...mockExistingEvent,
        ...mockUpdatedEvent,
        manager: { name: 'Manager Name', email: 'manager@example.com', phoneNumber: '1234567890' }
      });

      mockPrisma.user.findMany.mockResolvedValue([
        { userId: 'user-1', email: 'user1@example.com' },
        { userId: 'user-2', email: 'user2@example.com' }
      ]);

      const result = await eventsService.updateEvent(mockEventId, mockUpdatedEvent);

      expect(result).toEqual({
        message: "Event updated successfully and notifications sent",
        responseCode: 200,
        eventDetails: expect.objectContaining(mockUpdatedEvent)
      });

      expect(mockEmailService.sendEventUpdateNotification).toHaveBeenCalled();


      expect(mockEmailService.sendEventUpdateNotification).toHaveBeenCalledTimes(2);
    });

    it('should handle errors when updating an event', async () => {
      const mockEventId = 'non-existent-event';

      const mockUpdatedEvent: Event = {
        name: 'Updated Event Name',
        description: 'Updated Description',
        moreInfo: 'Additional Info',
        location: 'New Location',
        date: new Date(),
        time: new Date(),
        numberOfTickets: 200,
        remainingTickets: 200,
        managerId: 'manager-123',
        image: 'http://example.com/updated-image.jpg',
        hasRegular: true,
        regularPrice: 50,
        hasVIP: true,
        vipPrice: 100,
        hasChildren: false,
        childrenPrice: 0,
        isPromoted: false,
        promoDetails: "some promotio for free test",
        status: 'ACTIVE',
        nature: 'PENDING'
      };

      mockPrisma.event.update.mockRejectedValue(new Error('Database error'));

      const result = await eventsService.updateEvent(mockEventId, mockUpdatedEvent);


      expect(result).toEqual({
        message: "An unexpected error occurred.",
        responseCode: 500,
        error: expect.any(Error)
      });
    });
  });



  describe('cancelEvent', () => {
    it('should cancel an event successfully', async () => {
      const mockEventId = 'event-123';
      const mockCancelledEvent = {
        eventId: mockEventId,
        name: 'Event to Cancel',
        status: 'CANCELED',
        manager: {
          name: 'Manager Name',
          email: 'manager@example.com',
          phoneNumber: '1234567890'
        }
      };

      mockPrisma.event.update.mockResolvedValue(mockCancelledEvent);
      mockPrisma.user.findMany.mockResolvedValue([
        { email: 'user1@example.com' },
        { email: 'user2@example.com' }
      ]);

      const result = await eventsService.cancelEvent(mockEventId);

      expect(result).toEqual({
        message: "Event cancelled successfully and subscribers notified",
        responseCode: 200,
        eventDetails: expect.objectContaining(mockCancelledEvent)
      });

      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { eventId: mockEventId },
        data: { status: "CANCELED" },
        include: { manager: true }
      });

      expect(mockEmailService.sendEventCancellationNotification).toHaveBeenCalledTimes(2);

    });

    it('should handle errors when cancelling an event', async () => {
      const mockEventId = 'non-existent-event';

      mockPrisma.event.update.mockRejectedValue(new Error('Database error'));

      const result = await eventsService.cancelEvent(mockEventId);

      expect(result).toEqual({
        message: "An unexpected error occurred.",
        responseCode: 500,
        error: expect.any(Error)
      });
    });
  });


  describe('approveEvent', () => {
    it('should approve an event successfully', async () => {
      const mockEventId = 'event-123';
      const mockApprovedEvent = {
        eventId: mockEventId,
        name: 'Approved Event',
        nature: 'APPROVED',
        manager: {
          email: 'manager@example.com'
        }
      };

      mockPrisma.event.update.mockResolvedValue(mockApprovedEvent);
      mockPrisma.user.findMany.mockResolvedValue([
        { userId: 'user-1', email: 'user1@example.com' },
        { userId: 'user-2', email: 'user2@example.com' }
      ]);

      const result = await eventsService.approveEvent(mockEventId);

      expect(result).toEqual({
        message: "Event approved successfully, manager notified, and notifications sent to subscribers",
        responseCode: 200,
        eventDetails: expect.objectContaining(mockApprovedEvent)
      });

      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { eventId: mockEventId },
        data: { nature: "APPROVED" },
        include: { manager: true }
      });

      expect(mockEmailService.sendEventApprovalNotification).toHaveBeenCalledWith(
        mockApprovedEvent.manager.email,
        mockApprovedEvent.name
      );

      expect(mockEmailService.sendNewEventNotification).toHaveBeenCalledTimes(2);
    });

    it('should handle errors when approving an event', async () => {
      const mockEventId = 'non-existent-event';

      mockPrisma.event.update.mockRejectedValue(new Error('Database error'));

      const result = await eventsService.approveEvent(mockEventId);

      expect(result).toEqual({
        message: "An unexpected error occurred.",
        responseCode: 500,
        error: expect.any(Error)
      });
    });
  });


  describe('addPromotion', () => {
    it('should add promotion to an event successfully', async () => {
      const mockEventId = 'event-123';
      const mockPromoDetails = 'Special 20% discount for early birds!';

      mockPrisma.event.update.mockResolvedValue({
        eventId: mockEventId,
        isPromoted: true,
        promoDetails: mockPromoDetails
      });

      const result = await eventsService.addPromotion(mockEventId, mockPromoDetails);

      expect(result).toEqual({
        message: "Promotion added successfully",
        responseCode: 200
      });

      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { eventId: mockEventId },
        data: {
          isPromoted: true,
          promoDetails: mockPromoDetails
        }
      });
    });

    it('should handle errors when adding promotion', async () => {
      const mockEventId = 'non-existent-event';
      const mockPromoDetails = 'Invalid promotion';

      mockPrisma.event.update.mockRejectedValue(new Error('Database error'));

      const result = await eventsService.addPromotion(mockEventId, mockPromoDetails);

      expect(result).toEqual({
        message: "An unexpected error occurred.",
        responseCode: 500,
        error: expect.any(Error)
      });
    });
  });

  describe('removePromotion', () => {
    it('should remove promotion from an event successfully', async () => {
      const mockEventId = 'event-123';

      mockPrisma.event.update.mockResolvedValue({
        eventId: mockEventId,
        isPromoted: false,
        promoDetails: ""
      });

      const result = await eventsService.removePromotion(mockEventId);

      expect(result).toEqual({
        message: "Promotion removed successfully",
        responseCode: 200
      });

      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { eventId: mockEventId },
        data: {
          isPromoted: false,
          promoDetails: ""
        }
      });
    });

    it('should handle errors when removing promotion', async () => {
      const mockEventId = 'non-existent-event';

      mockPrisma.event.update.mockRejectedValue(new Error('Database error'));

      const result = await eventsService.removePromotion(mockEventId);

      expect(result).toEqual({
        message: "An unexpected error occurred.",
        responseCode: 500,
        error: expect.any(Error)
      });
    });
  });

  describe('rejectEvent', () => {
    it('should reject an event successfully', async () => {
      const mockEventId = 'event-123';
      const mockRejectedEvent = {
        eventId: mockEventId,
        name: 'Rejected Event',
        nature: 'REJECTED',
        manager: {
          email: 'manager@example.com'
        }
      };

      mockPrisma.event.update.mockResolvedValue(mockRejectedEvent);

      const result = await eventsService.rejectEvent(mockEventId);

      expect(result).toEqual({
        message: "Event rejected successfully and manager notified",
        responseCode: 200,
        eventDetails: expect.objectContaining(mockRejectedEvent)
      });

      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { eventId: mockEventId },
        data: { nature: "REJECTED" },
        include: { manager: true }
      });

      expect(mockEmailService.sendEventRejectionNotification).toHaveBeenCalledWith(
        mockRejectedEvent.manager.email,
        mockRejectedEvent.name
      );
    });

    it('should handle errors when rejecting an event', async () => {
      const mockEventId = 'non-existent-event';

      mockPrisma.event.update.mockRejectedValue(new Error('Database error'));

      const result = await eventsService.rejectEvent(mockEventId);

      expect(result).toEqual({
        message: "An unexpected error occurred.",
        responseCode: 500,
        error: expect.any(Error)
      });
    });
  });


  describe('getEventAttendees', () => {
    it('should fetch attendees for an event successfully', async () => {
      const mockEventId = 'event-123';
      const mockAttendees = [
        {
          user: { name: 'John Doe', email: 'john@example.com' },
          numberOfPeople: 2
        },
        {
          user: { name: 'Jane Smith', email: 'jane@example.com' },
          numberOfPeople: 1
        }
      ];

      mockPrisma.reservation.findMany.mockResolvedValue(mockAttendees);

      const result = await eventsService.getEventAttendees(mockEventId);

      expect(result).toEqual({
        message: "Attendees retrieved successfully",
        responseCode: 200,
        data: mockAttendees
      });

      expect(mockPrisma.reservation.findMany).toHaveBeenCalledWith({
        where: { eventId: mockEventId },
        include: { user: true }
      });
    });

    it('should handle errors when fetching attendees', async () => {
      const mockEventId = 'non-existent-event';

      mockPrisma.reservation.findMany.mockRejectedValue(new Error('Database error'));

      const result = await eventsService.getEventAttendees(mockEventId);

      expect(result).toEqual({
        message: "An unexpected error occurred.",
        responseCode: 500,
        error: expect.any(Error)
      });
    });
  });


  describe('getTotalReservationsForUser', () => {
    it('should return the total number of reservations', async () => {
      const mockTotalReservations = 10;

      mockPrisma.reservation.count.mockResolvedValue(mockTotalReservations);

      const result = await eventsService.getTotalReservationsForUser('user-123');

      expect(result).toBe(mockTotalReservations);
      expect(mockPrisma.reservation.count).toHaveBeenCalled();
    });

    it('should handle errors when fetching total reservations', async () => {
      mockPrisma.reservation.count.mockRejectedValue(new Error('Database error'));

      const result = await eventsService.getTotalReservationsForUser('user-123');

      expect(result).toEqual({
        message: "An unexpected error occurred.",
        responseCode: 500,
        error: expect.any(Error)
      });
    });
  });

  describe('getTotalReservationsForManager', () => {
    it('should return the total number of reservations for a manager', async () => {
      const mockManagerId = 'manager-123';
      const mockEvents = [
        { eventId: 'event-1' },
        { eventId: 'event-2' }
      ];
      const mockTotalReservations = 15;

      mockPrisma.event.findMany.mockResolvedValue(mockEvents);
      mockPrisma.reservation.count.mockResolvedValue(mockTotalReservations);

      const result = await eventsService.getTotalReservationsForManager(mockManagerId);

      expect(result).toBe(mockTotalReservations);
      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        where: { managerId: mockManagerId },
        select: { eventId: true }
      });
      expect(mockPrisma.reservation.count).toHaveBeenCalledWith({
        where: {
          eventId: {
            in: ['event-1', 'event-2']
          }
        }
      });
    });

    it('should return 0 if manager has no events', async () => {
      const mockManagerId = 'manager-no-events';
      mockPrisma.event.findMany.mockResolvedValue([]);

      const result = await eventsService.getTotalReservationsForManager(mockManagerId);

      expect(result).toBe(0);
    });

    it('should handle errors', async () => {
      const mockManagerId = 'manager-error';
      mockPrisma.event.findMany.mockRejectedValue(new Error('Database error'));

      await expect(eventsService.getTotalReservationsForManager(mockManagerId)).rejects.toThrow('Failed to get total reservations for manager');
    });
  });

  describe('getEventCountForManagers', () => {
    it('should return event count and details for all managers', async () => {
      const mockManagersWithEvents = [
        {
          userId: 'manager-1',
          name: 'John Doe',
          email: 'john@example.com',
          profilePicture: 'http://example.com/john.jpg',
          managedEvents: [
            { name: 'Event 1' },
            { name: 'Event 2' }
          ]
        },
        {
          userId: 'manager-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          profilePicture: null,
          managedEvents: [
            { name: 'Event 3' }
          ]
        }
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockManagersWithEvents);

      const result = await eventsService.getEventCountForManagers();

      expect(result).toEqual([
        {
          managerId: 'manager-1',
          name: 'John Doe',
          email: 'john@example.com',
          profilePicture: 'http://example.com/john.jpg',
          eventCount: 2,
          eventNames: ['Event 1', 'Event 2']
        },
        {
          managerId: 'manager-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          profilePicture: null,
          eventCount: 1,
          eventNames: ['Event 3']
        }
      ]);

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: { role: 'manager' },
        select: {
          userId: true,
          name: true,
          email: true,
          profilePicture: true,
          managedEvents: {
            select: { name: true }
          }
        }
      });
    });

    it('should handle errors when fetching event count for managers', async () => {
      mockPrisma.user.findMany.mockRejectedValue(new Error('Database error'));

      await expect(eventsService.getEventCountForManagers()).rejects.toThrow('Failed to get event count for managers');
    });
  });

  describe('getEventDetailsForManager', () => {
    it('should return event details for a specific manager', async () => {
      const mockManagerId = 'manager-123';
      const mockManagerWithEvents = {
        userId: mockManagerId,
        name: 'John Doe',
        email: 'john@example.com',
        profilePicture: 'http://example.com/john.jpg',
        managedEvents: [
          { name: 'Event 1' },
          { name: 'Event 2' },
          { name: 'Event 3' }
        ]
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockManagerWithEvents);

      const result = await eventsService.getEventDetailsForManager(mockManagerId);

      expect(result).toEqual({
        managerId: mockManagerId,
        name: 'John Doe',
        email: 'john@example.com',
        profilePicture: 'http://example.com/john.jpg',
        eventCount: 3,
        eventNames: ['Event 1', 'Event 2', 'Event 3']
      });

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          userId: mockManagerId,
          role: 'manager'
        },
        select: {
          userId: true,
          name: true,
          email: true,
          profilePicture: true,
          managedEvents: {
            select: { name: true }
          }
        }
      });
    });

    it('should throw an error if manager is not found', async () => {
      const mockManagerId = 'non-existent-manager';
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(eventsService.getEventDetailsForManager(mockManagerId)).rejects.toThrow('Manager not found');
    });

    it('should handle database errors', async () => {
      const mockManagerId = 'manager-error';
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(eventsService.getEventDetailsForManager(mockManagerId)).rejects.toThrow('Failed to get event details for manager');
    });
  });












});
