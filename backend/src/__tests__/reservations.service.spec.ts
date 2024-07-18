import { ReservationService } from '../services/reservations.service';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/email.service';
import { Reservation } from '../interfaces/reservation';

jest.mock('@prisma/client');
jest.mock('../services/email.service');

describe('ReservationService', () => {
  let reservationService: ReservationService;
  let mockPrisma: any;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    mockPrisma = {
      reservation: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      event: {
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      user: {
        findMany: jest.fn(),
      },
    };
    (PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as unknown as PrismaClient);

    mockEmailService = {
      sendReservationConfirmation: jest.fn().mockResolvedValue(true),
      sendNewReservationNotification: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<EmailService>;

    reservationService = new ReservationService();
    (reservationService as any).prisma = mockPrisma;
    (reservationService as any).emailService = mockEmailService;
  });

  describe('createReservation', () => {
    it('should create a reservation successfully', async () => {
      const mockEvent = {
        eventId: 'event-123',
        remainingTickets: 100,
        hasRegular: true,
        regularPrice: 50,
        hasVIP: false,
        vipPrice: 0,
        hasChildren: false,
        childrenPrice: 0,
        manager: { email: 'manager@example.com' },
      };

      const mockReservation: Reservation = {
        eventId: 'event-123',
        userId: 'user-123',
        isRegular: true,
        isVIP: false,
        isChildren: false,
        proxyName: '',
        numberOfPeople: 2,
        paidAmmount: 100,
        user: { name: 'Test User' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.reservation.findFirst.mockResolvedValue(null);
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);
      mockPrisma.event.update.mockResolvedValue({ ...mockEvent, remainingTickets: 98 });
      mockPrisma.reservation.create.mockResolvedValue({ ...mockReservation, reservationId: 'res-123' });
      mockPrisma.user.findMany.mockResolvedValue([{ email: 'admin@example.com' }]);

      const result = await reservationService.createReservation(mockReservation);

      expect(result).toEqual({
        message: "Reservation created successfully",
        responseCode: 201,
        emailSent: true
      });

      expect(mockPrisma.reservation.create).toHaveBeenCalled();
      expect(mockEmailService.sendReservationConfirmation).toHaveBeenCalled();
      expect(mockEmailService.sendNewReservationNotification).toHaveBeenCalledTimes(2);
    });

    it('should return an error if the user already has a reservation', async () => {
      mockPrisma.reservation.findFirst.mockResolvedValue({ reservationId: 'existing-res' });

      const mockReservation: Reservation = {
        eventId: 'event-123',
        userId: 'user-123',
        isRegular: true,
        isVIP: false,
        isChildren: false,
        proxyName: '',
        numberOfPeople: 2,
        paidAmmount: 100,
        user: { name: 'Test User' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await reservationService.createReservation(mockReservation);

      expect(result).toEqual({
        message: "You have already purchased a ticket for this event.",
        responseCode: 400,
      });
    });
  });

  describe('getAllReservations', () => {
    it('should fetch all reservations', async () => {
      const mockReservations = [
        {
          reservationId: 'res-1',
          event: {
            name: 'Event 1',
            manager: { name: 'Manager 1', phoneNumber: '1234567890' }
          },
          user: { name: 'User 1' },
          isRegular: true,
          numberOfPeople: 2,
        },
      ];

      mockPrisma.reservation.findMany.mockResolvedValue(mockReservations);
      (reservationService as any).calculatePrice = jest.fn().mockReturnValue(100);

      const result = await reservationService.getAllReservations();

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          reservationId: 'res-1',
          event: expect.objectContaining({
            name: 'Event 1',
            managerName: 'Manager 1',
            managerPhoneNumber: '1234567890'
          }),
          totalPrice: 100
        })
      ]));
    });
  });

  describe('getOneReservation', () => {
    it('should fetch a single reservation', async () => {
      const mockReservation = {
        reservationId: 'res-1',
        event: {
          name: 'Event 1',
          manager: { name: 'Manager 1', phoneNumber: '1234567890' },
          regularPrice: 50
        },
        user: { name: 'User 1' },
        isRegular: true,
        numberOfPeople: 2,
      };

      mockPrisma.reservation.findUnique.mockResolvedValue(mockReservation);
      (reservationService as any).calculatePrice = jest.fn().mockReturnValue(100);

      const result = await reservationService.getOneReservation('res-1');

      expect(result).toEqual(expect.objectContaining({
        reservationId: 'res-1',
        event: expect.objectContaining({
          name: 'Event 1',
          managerName: 'Manager 1',
          managerPhoneNumber: '1234567890'
        }),
        totalPrice: 100
      }));
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation', async () => {
      mockPrisma.reservation.update.mockResolvedValue({ status: 'CANCELLED' });

      const result = await reservationService.cancelReservation('res-1');

      expect(result).toEqual({
        message: "Reservation cancelled successfully",
        responseCode: 200
      });
    });
  });

  describe('getSumOfPaidAmounts', () => {
    it('should calculate the sum of paid amounts for an event', async () => {
      const mockReservations = [
        { ammountPaid: 100 },
        { ammountPaid: 150 },
      ];

      mockPrisma.reservation.findMany.mockResolvedValue(mockReservations);

      const result = await reservationService.getSumOfPaidAmounts('event-123');

      expect(result).toEqual({
        totalPaidAmount: 250,
        responseCode: 200
      });
    });
  });

  describe('getTotalPaidAmountForAllEvents', () => {
    it('should calculate the total paid amount for all events', async () => {
      const mockEvents = [
        { reservations: [{ ammountPaid: 100 }, { ammountPaid: 150 }] },
        { reservations: [{ ammountPaid: 200 }] },
      ];

      mockPrisma.event.findMany.mockResolvedValue(mockEvents);

      const result = await reservationService.getTotalPaidAmountForAllEvents();

      expect(result).toEqual({
        totalPaidAmount: 450,
        responseCode: 200
      });
    });
  });
});
