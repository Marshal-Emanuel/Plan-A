import { PrismaClient } from "@prisma/client";
import { Event } from "../interfaces/events";
import fs from 'fs';
import path from 'path';

export class EventsService {
    prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

    //for running the update of time incase server wanst runnign at midnight :)
    lastRunFilePath = path.join(__dirname, 'lastRunTime.txt');

    async createEvent(event: Event) {
        try {
            await this.prisma.event.create({
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
                    numberOfTickets: event.numberofTickets,
                    remainingTickets: event.remainingTickets
                }
            });
            return { message: "Event created successfully", responseCode: 201 };
        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

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
                }
            });
            console.log("Active AND APPROVED EVENTS events", events);
            return { message: "Events retrieved successfully", responseCode: 200, data: events };
        } catch (error) {
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
                where: { eventId: eventId }
            });
            return { message: "Event retrieved successfully", responseCode: 200, data: event };
        } catch (error) {
            return { message: "Error occurred while fetching event.", responseCode: 500, error: error };
        }
    }

    async updateEvent(eventId: string, event: Event) {
        try {
            await this.prisma.event.update({
                where: { eventId: eventId },
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
                    nature: event.nature
                }
            });
            return { message: "Event updated successfully", responseCode: 200 };
        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

    async cancelEvent(eventId: string) {
        try {
            await this.prisma.event.update({
                where: { eventId: eventId },
                data: {
                    status: "CANCELED"
                }
            });
            return { message: "Event canceled successfully", responseCode: 200 };
        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

    async approveEvent(eventId: string) {
        try {
            await this.prisma.event.update({
                where: { eventId: eventId },
                data: {
                    nature: "APPROVED"
                }
            });
            return { message: "Event approved successfully", responseCode: 200 };
        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
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
            await this.prisma.event.update({
                where: { eventId: eventId },
                data: {
                    nature: "REJECTED"
                }
            });
            return { message: "Event rejected successfully", responseCode: 200 };
        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

}