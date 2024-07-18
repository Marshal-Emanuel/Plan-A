import { Reservation } from './../interfaces/reservation';
import { PrismaClient } from "@prisma/client";
import { EmailService } from './email.service';
import { Event as LocalEvent } from '../interfaces/events';


export class ReservationService {
    prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

    private emailService: EmailService = new EmailService();

    constructor() {
        this.emailService = new EmailService();
    }


    //create reservation
    async createReservation(reservation: Reservation) {
        try {
            const existingReservation = await this.prisma.reservation.findFirst({
                where: {
                    eventId: reservation.eventId,
                    userId: reservation.userId,
                },
            });

            if (existingReservation) {
                return {
                    message: "You have already purchased a ticket for this event.",
                    responseCode: 400,
                };
            }

            const event = await this.prisma.event.findUnique({
                where: { eventId: reservation.eventId },
                include: { manager: true }
            });

            if (!event) {
                return {
                    message: "Event not found.",
                    responseCode: 404,
                };
            }

            if (event.remainingTickets < reservation.numberOfPeople) {
                return {
                    message: "Not enough tickets available.",
                    responseCode: 400,
                };
            }

            let ticketPrice = 0;
            if (reservation.isRegular && event.hasRegular) {
                ticketPrice = event.regularPrice;
            } else if (reservation.isVIP && event.hasVIP) {
                ticketPrice = event.vipPrice;
            } else if (reservation.isChildren && event.hasChildren) {
                ticketPrice = event.childrenPrice;
            } else {
                return {
                    message: "Invalid ticket type selected.",
                    responseCode: 400,
                };
            }

            const paidAmount = ticketPrice * reservation.numberOfPeople;

            const updatedEvent = await this.prisma.event.update({
                where: { eventId: reservation.eventId },
                data: {
                    remainingTickets: event.remainingTickets - reservation.numberOfPeople,
                },
            });

            const createdReservation = await this.prisma.reservation.create({
                data: {
                    eventId: reservation.eventId,
                    userId: reservation.userId,
                    isRegular: reservation.isRegular,
                    isVIP: reservation.isVIP,
                    isChildren: reservation.isChildren,
                    proxyName: reservation.proxyName,
                    numberOfPeople: reservation.numberOfPeople,
                    paidAmmount: paidAmount,
                    ammountPaid: paidAmount,
                },
                include: { user: true }
            });

            console.log('Created reservation:', createdReservation);

            // Send confirmation email to user
            const emailSent = await this.emailService.sendReservationConfirmation(
                createdReservation.reservationId
            );

            console.log('Email sent status:', emailSent);

            // Notify admin and manager
            const adminUsers = await this.prisma.user.findMany({ where: { role: 'admin' } });

            // Then in your function:
            for (const adminUser of adminUsers) {
                await this.emailService.sendNewReservationNotification(
                    adminUser.email,
                    createdReservation as unknown as Reservation,
                    updatedEvent as unknown as LocalEvent
                );
            }

            await this.emailService.sendNewReservationNotification(
                event.manager.email,
                createdReservation as unknown as Reservation,
                updatedEvent as unknown as LocalEvent
            );

            return {
                message: "Reservation created successfully",
                responseCode: 201,
                emailSent: emailSent
            };
        } catch (error) {
            console.error("Error creating reservation:", error);
            return {
                message: "An unexpected error occurred.",
                responseCode: 500,
                error: error,
            };
        }
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
            const reservation = await this.prisma.reservation.findUnique({
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

            if (reservation) {
                return {
                    ...reservation,
                    event: {
                        ...reservation.event,
                        managerName: reservation.event.manager.name,
                        managerPhoneNumber: reservation.event.manager.phoneNumber
                    },
                    totalPrice: this.calculatePrice(reservation)
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

    async cancelReservation(reservationId: string) {
        try {
            await this.prisma.reservation.update({
                where: {
                    reservationId: reservationId
                },
                data: {
                    status: "CANCELLED"
                }
            });

            return {
                message: "Reservation cancelled successfully",
                responseCode: 200
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

    async calculatePrice(reservation: any): Promise<number> {
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
    
    
    
}