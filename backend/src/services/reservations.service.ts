import { PrismaClient } from "@prisma/client";
import { EmailService } from './email.service';
import { Event as LocalEvent } from '../interfaces/events';
import { Reservation, CancellationReservation } from '../interfaces/reservation';


export class ReservationService {
    prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

    private emailService: EmailService = new EmailService();

    constructor() {
        this.emailService = new EmailService();
    }


    //create reservation
    async createReservation(reservation: Reservation) {
        let createdReservation;
        let event;
    
        try {
            await this.prisma.$transaction(async (prisma) => {
                const user = await prisma.user.findUnique({
                    where: { userId: reservation.userId }
                });
    
                if (!user) {
                    throw new Error("User not found.");
                }
    
                event = await prisma.event.findUnique({
                    where: { eventId: reservation.eventId },
                    include: { manager: true }
                });
    
                if (!event) {
                    throw new Error("Event not found.");
                }
    
                const existingReservation = await prisma.reservation.findFirst({
                    where: {
                        eventId: reservation.eventId,
                        userId: reservation.userId,
                    },
                });
    
                if (existingReservation) {
                    throw new Error("You have already made a reservation for this event.");
                }
    
                if (event.remainingTickets < reservation.numberOfPeople) {
                    throw new Error("Not enough tickets available.");
                }
    
                if (reservation.isRegular && !event.hasRegular) {
                    throw new Error("Regular tickets are not available for this event.");
                }
                if (reservation.isVIP && !event.hasVIP) {
                    throw new Error("VIP tickets are not available for this event.");
                }
                if (reservation.isChildren && !event.hasChildren) {
                    throw new Error("Children tickets are not available for this event.");
                }
    
                let ticketPrice = 0;
                if (reservation.isRegular) {
                    ticketPrice = event.regularPrice ?? 0;
                } else if (reservation.isVIP) {
                    ticketPrice = event.vipPrice ?? 0;
                } else if (reservation.isChildren) {
                    ticketPrice = event.childrenPrice ?? 0;
                } else {
                    throw new Error("Invalid ticket type selected.");
                }
    
                const totalCost = ticketPrice * reservation.numberOfPeople;
    
                if (user.wallet < totalCost) {
                    throw new Error(`Insufficient funds. Your balance is ${user.wallet}. Required amount is ${totalCost}.`);
                }
    
                createdReservation = await prisma.reservation.create({
                    data: {
                        eventId: reservation.eventId,
                        userId: reservation.userId,
                        isRegular: reservation.isRegular,
                        isVIP: reservation.isVIP,
                        isChildren: reservation.isChildren,
                        proxyName: reservation.proxyName,
                        numberOfPeople: reservation.numberOfPeople,
                        paidAmmount: totalCost,
                        ammountPaid: totalCost,
                    },
                });
    
                await prisma.user.update({
                    where: { userId: user.userId },
                    data: { wallet: { decrement: totalCost } }
                });
    
                await prisma.event.update({
                    where: { eventId: reservation.eventId },
                    data: {
                        remainingTickets: {
                            decrement: reservation.numberOfPeople
                        },
                    },
                });
            });
    
            this.sendReservationEmails(reservation.eventId, reservation.userId, event).catch(console.error);
    
            return {
                message: `Reservation created successfully for ${reservation.numberOfPeople} people`,
                responseCode: 201,
                reservation: createdReservation
            };
        } catch (error) {
            if (error instanceof Error) {
                return {
                    message: error.message,
                    responseCode: 400
                };
            }
            return {
                message: "An unexpected error occurred.",
                responseCode: 500
            };
        }
    }
    
    
    
    private async sendReservationEmails(eventId: string, userId: string, event: any) {
        const reservations = await this.prisma.reservation.findMany({
            where: { eventId, userId },
            include: { user: true }
        });
    
        for (const reservation of reservations) {
            const emailSent = await this.emailService.sendReservationConfirmation(reservation.reservationId);
            console.log('Email sent status:', emailSent);
        }
    
        const adminUsers = await this.prisma.user.findMany({ where: { role: 'admin' } });
        for (const adminUser of adminUsers) {
            await this.emailService.sendNewReservationNotification(
                adminUser.email,
                reservations[0] as unknown as Reservation,
                event as unknown as LocalEvent
            );
        }
    
        await this.emailService.sendNewReservationNotification(
            event.manager.email,
            reservations[0] as unknown as Reservation,
            event as unknown as LocalEvent
        );
    }
    
    
    
    

    async getAllReservations() {
        try {
            const reservations = await this.prisma.reservation.findMany({
                include: {
                    event: {
                        include: {
                            manager: true
                        }
                    },
                    user: true
                }
            });

            return reservations.map(reservation => ({
                ...reservation,
                event: {
                    ...reservation.event,
                    managerName: reservation.event.manager.name,
                    managerPhoneNumber: reservation.event.manager.phoneNumber
                },
                totalPrice: this.calculatePrice(reservation)
            }));

        } catch (error) {
            console.error("Error fetching reservations:", error);
            return {
                message: "An unexpected error occurred.",
                responseCode: 500,
                error: error
            };
        }
    }

    async getOneReservation(reservationId: string) {
        try {
            const result = await this.prisma.reservation.findUnique({
                where: {
                    reservationId: reservationId
                },
                include: {
                    event: {
                        include: {
                            manager: true
                        }
                    },
                    user: true
                }
            });

            if (result) {
                return {
                    ...result,
                    event: {
                        ...result.event,
                        managerName: result.event.manager.name,
                        managerPhoneNumber: result.event.manager.phoneNumber
                    },
                    totalPrice: this.calculatePrice(result)
                };
            }

            return null;

        } catch (error) {
            console.error("Error fetching reservation:", error);
            return {
                message: "An unexpected error occurred.",
                responseCode: 500,
                error: error
            };
        }
    }


    //get reservations for one user
    async getReservationsForUser(userId: string) {
        try {
            const reservations = await this.prisma.reservation.findMany({
                where: { userId },
                include: {
                    event: {
                        include: {
                            manager: true
                        }
                    },
                    user: true
                }
            });

            return reservations.map(reservation => ({
                ...reservation,
                event: {
                    ...reservation.event,
                    managerName: reservation.event.manager.name,
                    managerPhoneNumber: reservation.event.manager.phoneNumber
                },
                totalPrice: this.calculatePrice(reservation)
            }));

        } catch (error) {
            console.error("Error fetching reservations for user:", error);
            return {
                message: "An unexpected error occurred.",
                responseCode: 500,
                error: error
            };
        }
    }



    async cancelReservation(reservationId: string) {
        try {
            const reservation = await this.prisma.reservation.findUnique({
                where: { reservationId },
                include: { 
                    user: true, 
                    event: { 
                        include: { manager: true } 
                    } 
                }
            });
    
            if (!reservation) {
                return { message: "Reservation not found", responseCode: 404 };
            }
    
            const refundAmount = reservation.ammountPaid * 0.95;
            const feeAmount = reservation.ammountPaid * 0.05;
    
            const result = await this.prisma.$transaction(async (prisma) => {
                await prisma.reservation.update({
                    where: { reservationId },
                    data: { status: "CANCELLED" }
                });
    
                await prisma.user.update({
                    where: { userId: reservation.userId },
                    data: { wallet: { increment: refundAmount } }
                });
    
                await prisma.transaction.create({
                    data: {
                        userId: reservation.userId,
                        eventId: reservation.eventId,
                        amount: feeAmount,
                        type: "CANCELLATION_FEE"
                    }
                });
    
                return prisma.event.update({
                    where: { eventId: reservation.eventId },
                    data: { remainingTickets: { increment: reservation.numberOfPeople } }
                });
            });
    
            // Send emails asynchronously
            this.sendCancellationEmails(reservation, refundAmount, feeAmount).catch(console.error);
    
            return {
                message: "Reservation cancelled successfully",
                responseCode: 200,
                updatedEvent: result
            };
        } catch (error) {
            console.error("Error cancelling reservation:", error);
            return {
                message: "An unexpected error occurred.",
                responseCode: 500,
                error: error
            };
        }
    }

   
    
    private async sendCancellationEmails(reservation: CancellationReservation, refundAmount: number, feeAmount: number) {
        await Promise.all([
            this.emailService.sendCancellationEmail(
                reservation.user.email,
                reservation.user.name,
                reservation.event.name,
                refundAmount,
                feeAmount
            ),
            this.emailService.sendCancellationNotificationToManager(
                reservation.event.manager.email,
                reservation.event.manager.name,
                reservation.event.name,
                reservation.user.name
            )
        ]);
    }
    
    
    

   calculatePrice(reservation: any): number {
    let totalPrice = 0;
    if (reservation.isRegular) {
        totalPrice += reservation.event.regularPrice * reservation.numberOfPeople;
    }
    if (reservation.isVIP) {
        totalPrice += reservation.event.vipPrice * reservation.numberOfPeople;
    }
    if (reservation.isChildren) {
        totalPrice += reservation.event.childrenPrice * reservation.numberOfPeople;
    }
    return totalPrice;
}


    async getSumOfPaidAmounts(eventId: string) {
        try {
            console.log(`Fetching reservations for eventId: ${eventId} and managerId:`);
            const reservations = await this.prisma.reservation.findMany({
                where: {
                    eventId: eventId,
                  
                },
                include: {
                    event: true
                }
            });
    
            console.log('Reservations found:', JSON.stringify(reservations, null, 2));
    
            const totalPaidAmount = reservations.reduce((sum, reservation) => {
                console.log(`Reservation ${reservation.reservationId}: ammountPaid = ${reservation.ammountPaid}`);
                return sum + reservation.ammountPaid;
            }, 0);
    
            console.log(`Total paid amount calculated: ${totalPaidAmount}`);
    
            return {
                totalPaidAmount: totalPaidAmount,
                responseCode: 200
            };
        } catch (error) {
            console.error("Error fetching reservations:", error);
            return {
                message: "An unexpected error occurred.",
                responseCode: 500,
                error: error
            };
        }
    }


    async getTotalPaidAmountForAllEvents() {
        try {
            const events = await this.prisma.event.findMany({
                include: {
                    reservations: true
                }
            });
    
            const totalPaidAmount = events.reduce((sum, event) => {
                const eventTotal = event.reservations.reduce((eventSum, reservation) => {
                    return eventSum + reservation.ammountPaid;
                }, 0);
                return sum + eventTotal;
            }, 0);
    
            console.log(`Total paid amount for all events: ${totalPaidAmount}`);
    
            return {
                totalPaidAmount: totalPaidAmount,
                responseCode: 200
            };
        } catch (error) {
            console.error("Error calculating total paid amount for all events:", error);
            return {
                message: "An unexpected error occurred.",
                responseCode: 500,
                error: error
            };
        }
    }

    //total ammount earned by manager per manager id(sum of all ammount paid for all events under given manaer id)
    
  async getTotalPaidAmountForManager(managerId: string): Promise<{ totalPaidAmount: number; responseCode: number; message?: string }> {
    try {
      console.log('Received Manager ID:', managerId); // Log the managerId to check its value

      const events = await this.prisma.event.findMany({
        where: {
          managerId: managerId
        },
        include: {
          reservations: true
        }
      });

      const totalPaidAmount = events.reduce((sum, event) => {
        const eventTotal = event.reservations.reduce((eventSum, reservation) => {
          return eventSum + reservation.ammountPaid;
        }, 0);
        return sum + eventTotal;
      }, 0);

      console.log(`Total paid amount for manager ${managerId}: ${totalPaidAmount}`);

      return {
        totalPaidAmount: totalPaidAmount,
        responseCode: 200
      };
    } catch (error) {
      console.error("Error calculating total paid amount for manager:", error);
      return {
        totalPaidAmount: 0,
        responseCode: 500,
        message: "An unexpected error occurred."
      };
    }
  }   
    
    
}