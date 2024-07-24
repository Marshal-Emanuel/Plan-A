import { PrismaClient } from "@prisma/client";
import { Event } from "../interfaces/events";
import fs from 'fs';
import path from 'path';
import { EmailService } from "./email.service";
export class EventsService {
    prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

    private emailService: EmailService = new EmailService();

    constructor() {
        this.emailService = new EmailService();
    }

    //for running the update of time incase server wanst runnign at midnight :)
    lastRunFilePath = path.join(__dirname, 'lastRunTime.txt');

    async createEvent(event: Event) {
        try {
            const [createdEvent, adminUsers] = await Promise.all([
                this.prisma.event.create({
                    data: {
                        name: event.name,
                        description: event.description,
                        moreInfo: event.moreInfo,
                        location: event.location,
                        date: event.date,
                        time: event.time,
                        image: event.image,
                        hasRegular: event.hasRegular,
                        regularPrice: event.regularPrice,
                        hasVIP: event.hasVIP,
                        vipPrice: event.vipPrice,
                        hasChildren: event.hasChildren,
                        childrenPrice: event.childrenPrice,
                        isPromoted: event.isPromoted,
                        promoDetails: event.promoDetails,
                        status: event.status,
                        nature: event.nature,
                        managerId: event.managerId,
                        numberOfTickets: event.numberOfTickets,
                        remainingTickets: event.numberOfTickets
                    }
                }),
                this.prisma.user.findMany({
                    where: { role: 'admin' },
                    select: { email: true }
                })
            ]);
    
            // Send notifications to admins asynchronously
            const notificationPromises = adminUsers.map(admin =>
                this.emailService.sendNewEventAdminNotification(
                    admin.email,
                    createdEvent.eventId,
                    createdEvent.name
                )
            );
            Promise.all(notificationPromises).catch(console.error);
    
            return {
                message: "Event created successfully and admins notified",
                responseCode: 201,
                eventDetails: createdEvent
            };
        } catch (error) {
            console.error("Error creating event:", error);
            return {
                message: "An unexpected error occurred.",
                responseCode: 500,
                error: error
            };
        }
    }


    //get events by managerId
    async getEventsByManager(managerId: string) {
        try {
            let events = await this.prisma.event.findMany({
                where: {
                    managerId: managerId
                }
            });
            return { message: "Events retrieved successfully", responseCode: 200, data: events };
        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }}
    


    async getEvents() {
        try {
            let events = await this.prisma.event.findMany();
            return { message: "Events retrieved successfully", responseCode: 200, data: events };
        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

    //events where nature is APPROVED and status ACTIVE
    async getActiveEvents() {
        try {
            let events = await this.prisma.event.findMany({
                where: {
                    nature: "APPROVED",
                    status: "ACTIVE"
                },
                include: {
                    manager: {
                        select: {
                            name: true,
                            phoneNumber: true,
                            email: true
                        }
                    }
                }
            });
            console.log("Active AND APPROVED EVENTS events", events);
            return { message: "Events retrieved successfully", responseCode: 200, data: events };
        } catch (error) {
            console.error("Error retrieving events:", error);
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }
    


    //EVENTS THAT ARE ACTIVE BUT UNAPPROVED
    async getPendingEvents() {
        try {
            let events = await this.prisma.event.findMany({
                where: {
                    nature: "PENDING",
                    status: "ACTIVE"
                }
            });
            return { message: "Events retrieved successfully", responseCode: 200, data: events };
        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

    //events where nature is canccelled



    async getEventById(eventId: string) {
        try {
            let event = await this.prisma.event.findUnique({
                where: { eventId: eventId },
                
                include: {
                    manager: {
                        select: {
                            name: true,
                            phoneNumber: true,
                            email: true
                        }
                    }
                }
            });
            return { message: "Event retrieved successfully", responseCode: 200, data: event };
        } catch (error) {
            return { message: "Error occurred while fetching event.", responseCode: 500, error: error };
        }
    }

    async updateEvent(eventId: string, event: Event) {
        try {
            const [updatedEvent, usersToNotify] = await Promise.all([
                this.prisma.event.update({
                    where: { eventId: eventId },
                    data: {
                        name: event.name,
                        description: event.description,
                        moreInfo: event.moreInfo,
                        location: event.location,
                        date: event.date,
                        time: event.time.toString(),
                        image: event.image || undefined,
                        hasRegular: event.hasRegular,
                        regularPrice: event.regularPrice,
                        hasVIP: event.hasVIP,
                        vipPrice: event.vipPrice,
                        hasChildren: event.hasChildren,
                        childrenPrice: event.childrenPrice,
                        isPromoted: event.isPromoted,
                        promoDetails: event.promoDetails || undefined,
                        status: event.status,
                        nature: event.nature,
                        numberOfTickets: event.numberOfTickets,
                        remainingTickets: event.remainingTickets
                    },
                    include: { manager: true }
                }),
                this.prisma.user.findMany({
                    where: {
                        OR: [
                            { isSubscribedToMails: true },
                            { reservations: { some: { eventId: eventId } } }
                        ]
                    },
                    select: { email: true, userId: true },
                    distinct: ['userId']
                })
            ]);
    
            const eventDetails: Event = {
                name: updatedEvent.name,
                description: updatedEvent.description,
                moreInfo: updatedEvent.moreInfo,
                location: updatedEvent.location,
                date: updatedEvent.date,
                time: updatedEvent.time,
                numberOfTickets: updatedEvent.numberOfTickets,
                remainingTickets: updatedEvent.remainingTickets,
                image: updatedEvent.image || undefined,
                managerId: updatedEvent.managerId,
                hasRegular: updatedEvent.hasRegular ?? false,
                regularPrice: updatedEvent.regularPrice ?? 0,
                hasVIP: updatedEvent.hasVIP ?? false,
                vipPrice: updatedEvent.vipPrice ?? 0,
                hasChildren: updatedEvent.hasChildren ?? false,
                childrenPrice: updatedEvent.childrenPrice ?? 0,
                isPromoted: updatedEvent.isPromoted ?? false,
                promoDetails: updatedEvent.promoDetails || undefined,
                status: updatedEvent.status,
                nature: updatedEvent.nature
            };
    
            // Send notifications asynchronously
            const notificationPromises = usersToNotify.map(user =>
                this.emailService.sendEventUpdateNotification(
                    user.email,
                    updatedEvent.name,
                    updatedEvent.manager.name,
                    updatedEvent.manager.email,
                    updatedEvent.manager.phoneNumber,
                    eventDetails
                )
            );
            Promise.all(notificationPromises).catch(console.error);
    
            return {
                message: "Event updated successfully and notifications sent",
                responseCode: 200,
                eventDetails: updatedEvent
            };
        } catch (error) {
            console.error("Error updating event:", error);
            return {
                message: "An unexpected error occurred.",
                responseCode: 500,
                error: error
            };
        }
    }
    

    async cancelEvent(eventId: string) {
        try {
            const cancelledEvent = await this.prisma.event.update({
                where: { eventId: eventId },
                data: {
                    status: "CANCELED"
                },
                include: {
                    manager: true
                }
            });

            // Fetch all subscribed users
            const subscribedUsers = await this.prisma.user.findMany({
                where: {
                    isSubscribedToMails: true
                }
            });

            // Send cancellation notification emails to subscribed users asynchronously
            const notificationPromises = subscribedUsers.map(user =>
                this.emailService.sendEventCancellationNotification(
                    user.email,
                    cancelledEvent.name,
                    cancelledEvent.manager.name,
                    cancelledEvent.manager.email,
                    cancelledEvent.manager.phoneNumber
                )
            );

            // Return the response immediately
            const response = {
                message: "Event cancelled successfully and subscribers notified",
                responseCode: 200,
                eventDetails: cancelledEvent
            };

            // Use setImmediate to ensure the emails are sent after the response is returned
            setImmediate(async () => {
                try {
                    await Promise.all(notificationPromises);
                } catch (error) {
                    console.error("Error sending cancellation notifications:", error);
                }
            });

            return response;
        } catch (error) {
            console.error("Error cancelling event:", error);
            return {
                message: "An unexpected error occurred.",
                responseCode: 500,
                error: error
            };
        }
    }


    async approveEvent(eventId: string) {
        try {
            const [approvedEvent, subscribedUsers] = await Promise.all([
                this.prisma.event.update({
                    where: { eventId: eventId },
                    data: {
                        nature: "APPROVED"
                    },
                    include: {
                        manager: true
                    }
                }),
                this.prisma.user.findMany({
                    where: {
                        isSubscribedToMails: true
                    }
                })
            ]);
    
            // Notify the event manager asynchronously
            const managerNotification = this.emailService.sendEventApprovalNotification(
                approvedEvent.manager.email,
                approvedEvent.name
            );
    
            // Send notification emails to subscribed users asynchronously
            const userNotifications = subscribedUsers.map(user =>
                this.emailService.sendNewEventNotification(user.userId, eventId)
            );
    
            // Return the response immediately
            const response = {
                message: "Event approved successfully, manager notified, and notifications sent to subscribers",
                responseCode: 200,
                eventDetails: approvedEvent
            };
    
            // Use setImmediate to ensure the emails are sent after the response is returned
            setImmediate(async () => {
                try {
                    await Promise.all([managerNotification, ...userNotifications]);
                } catch (error) {
                    console.error("Error sending notifications:", error);
                }
            });
    
            return response;
        } catch (error) {
            console.error("Error approving event:", error);
            return {
                message: "An unexpected error occurred.",
                responseCode: 500,
                error: error
            };
        }
    }
    



    async updateEventNature() {
        try {
            let currentDate = new Date();
            const updatedEvents = await this.prisma.event.updateMany({
                where: {
                    date: {
                        lt: currentDate
                    },
                    nature: {
                        not: "PAST"
                    }
                },
                data: {
                    nature: "PAST"
                }
            });
            console.log(`Updated ${updatedEvents.count} events to PAST`);
            return { message: "Event nature updated successfully", responseCode: 200, updatedCount: updatedEvents.count };
        } catch (error) {
            console.error("Error updating event nature:", error);
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

    getLastRunTime(): Date | null {
        try {
            if (fs.existsSync(this.lastRunFilePath)) {
                const lastRunTime = fs.readFileSync(this.lastRunFilePath, 'utf8');
                return new Date(lastRunTime);
            }
        } catch (error) {
            console.error("Error reading last run time:", error);
        }
        return null;
    }

    setLastRunTime(date: Date) {
        try {
            fs.writeFileSync(this.lastRunFilePath, date.toISOString(), 'utf8');
        } catch (error) {
            console.error("Error writing last run time:", error);
        }
    }
    scheduleUpdateEventNature() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);

        const timeUntilMidnight = midnight.getTime() - now.getTime();

        console.log(`Scheduling next updateEventNature for ${midnight.toISOString()}`);

        setTimeout(() => {
            console.log("Running updateEventNature at:", new Date().toISOString());
            this.updateEventNature().then(() => {
                this.setLastRunTime(new Date());
                this.scheduleUpdateEventNature();
            }).catch(error => {
                console.error("Error in scheduled updateEventNature:", error);
            });
        }, timeUntilMidnight);

        // Check if the function was missed
        const lastRun = this.getLastRunTime();
        if (lastRun && now.getTime() - lastRun.getTime() > 24 * 60 * 60 * 1000) {
            console.log("Missed update detected, running updateEventNature now");
            this.updateEventNature();
        }
    }

    //get approved events where natire is approved
    async getApprovedEvents() {
        try {
            let events = await this.prisma.event.findMany({
                where: {
                    nature: "APPROVED"
                }
            });
            return {
                message: "Events retrieved successfully", responseCode: 200, data: events
            };
        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

    //add promotion
    async addPromotion(eventId: string, promoDetails: string) {
        try {
            await this.prisma.event.update({
                where: { eventId: eventId },
                data: {
                    isPromoted: true,
                    promoDetails: promoDetails
                }
            });
            return { message: "Promotion added successfully", responseCode: 200 };
        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

    //remove promotion
    async removePromotion(eventId: string) {
        try {
            await this.prisma.event.update({
                where: { eventId: eventId },
                data: {
                    isPromoted: false,
                    promoDetails: ""
                }
            });
            return { message: "Promotion removed successfully", responseCode: 200 };
        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

    //set nature to rejected
    async rejectEvent(eventId: string) {
        try {
            const rejectedEvent = await this.prisma.event.update({
                where: { eventId: eventId },
                data: {
                    nature: "REJECTED"
                },
                include: {
                    manager: true
                }
            });

            // Notify the event manager
            await this.emailService.sendEventRejectionNotification(
                rejectedEvent.manager.email,
                rejectedEvent.name
            );

            return {
                message: "Event rejected successfully and manager notified",
                responseCode: 200,
                eventDetails: rejectedEvent
            };
        } catch (error) {
            console.error("Error rejecting event:", error);
            return {
                message: "An unexpected error occurred.",
                responseCode: 500,
                error: error
            };
        }
    }


    //peaople attemding an event
    async getEventAttendees(eventId: string) {
        try {
            let attendees = await this.prisma.reservation.findMany({
                where: {
                    eventId: eventId
                },
                include: {
                    user: true
                }
            });
            return { message: "Attendees retrieved successfully", responseCode: 200, data: attendees };
        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

    //METRICS START HERE




    //GET number of RSVPs IN SYSTEMS
    async getTotalReservationsForUser(userId: string) {
        try {
            const totalReservations = await this.prisma.reservation.count({

            });
            return totalReservations;
        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }


    //GET number of RSVPs IN SYSTEMS

    async getTotalReservationsForManager(managerId: string): Promise<number> {
        if (!managerId) {
          console.error('Manager ID is undefined');
          throw new Error('Manager ID is required');
        }
      
        try {
          console.log(`Fetching total reservations for manager: ${managerId}`);
      
          // First, let's check if the manager exists and has any events
          const managerWithEvents = await this.prisma.user.findUnique({
            where: { userId: managerId },
            include: {
              _count: {
                select: { managedEvents: true }
              }
            }
          });
      
          if (!managerWithEvents) {
            console.log(`No manager found with ID: ${managerId}`);
            return 0;
          }
      
          console.log(`Manager ${managerId} has ${managerWithEvents._count.managedEvents} events`);
      
          if (managerWithEvents._count.managedEvents === 0) {
            console.log(`Manager ${managerId} has no events, thus no reservations`);
            return 0;
          }
      
          // Now, let's count the reservations
          const totalReservations = await this.prisma.reservation.count({
            where: {
              event: {
                managerId: managerId
              }
            }
          });
      
          console.log(`Total reservations for manager ${managerId}: ${totalReservations}`);
      
          // Let's also log the details of these reservations for verification
          const reservationDetails = await this.prisma.reservation.findMany({
            where: {
              event: {
                managerId: managerId
              }
            },
            select: {
              reservationId: true,
              eventId: true,
              userId: true,
              status: true
            }
          });
      
          console.log('Reservation details:', JSON.stringify(reservationDetails, null, 2));
      
          return totalReservations;
        } catch (error) {
          console.error(`Error fetching reservations for manager ${managerId}:`, error);
          throw new Error('Failed to fetch total reservations');
        }
      }



    //events count fot managers
    async getEventCountForManagers(): Promise<{
        managerId: string;
        name: string;
        email: string;
        profilePicture: string | null;
        eventCount: number;
        eventNames: string[];
    }[]> {
        try {
            const managersWithEvents = await this.prisma.user.findMany({
                where: {
                    role: 'manager' // Assuming you have a 'manager' role
                },
                select: {
                    userId: true,
                    name: true,
                    email: true,
                    profilePicture: true,
                    managedEvents: {
                        select: {
                            name: true
                        }
                    }
                }
            });

            return managersWithEvents.map(manager => ({
                managerId: manager.userId,
                name: manager.name,
                email: manager.email,
                profilePicture: manager.profilePicture,
                eventCount: manager.managedEvents.length,
                eventNames: manager.managedEvents.map(event => event.name)
            }));
        } catch (error) {
            console.error('Error getting event count for managers:', error);
            throw new Error(`Failed to get event count for managers: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    //manaer events based on id
    async getEventDetailsForManager(managerId: string): Promise<{
        managerId: string;
        name: string;
        email: string;
        profilePicture: string | null;
        eventCount: number;
        eventNames: string[];
    }> {
        try {
            const managerWithEvents = await this.prisma.user.findUnique({
                where: {
                    userId: managerId,
                    role: 'manager'
                },
                select: {
                    userId: true,
                    name: true,
                    email: true,
                    profilePicture: true,
                    managedEvents: {
                        select: {
                            name: true
                        }
                    }
                }
            });

            if (!managerWithEvents) {
                throw new Error('Manager not found');
            }

            return {
                managerId: managerWithEvents.userId,
                name: managerWithEvents.name,
                email: managerWithEvents.email,
                profilePicture: managerWithEvents.profilePicture,
                eventCount: managerWithEvents.managedEvents.length,
                eventNames: managerWithEvents.managedEvents.map(event => event.name)
                
            };
        } catch (error) {
            console.error('Error getting event details for manager:', error);
            throw new Error(`Failed to get event details for manager: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }











}