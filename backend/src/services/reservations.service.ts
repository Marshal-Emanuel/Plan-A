import { Reservation } from './../interfaces/reservation';
import { PrismaClient } from "@prisma/client";

export class ReservationService {
    prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

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
    
            await this.prisma.event.update({
                where: { eventId: reservation.eventId },
                data: {
                    remainingTickets: event.remainingTickets - reservation.numberOfPeople,
                },
            });
    
            await this.prisma.reservation.create({
                data: {
                    eventId: reservation.eventId,
                    userId: reservation.userId,
                    isRegular: reservation.isRegular,
                    isVIP: reservation.isVIP,
                    isChildren: reservation.isChildren,
                    proxyName: reservation.proxyName,
                    numberOfPeople: reservation.numberOfPeople,
                },
            });
    
            return {
                message: "Reservation created successfully",
                responseCode: 201,
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

        


    //get all reservations
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


    //cancel reservation BY setting   status         String    @default("ACTIVE") to cancelled
    async cancelReservation(reservationId: string){
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

    private calculatePrice(reservation: any): number {
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
    
}
