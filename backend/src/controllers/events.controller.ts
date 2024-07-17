import { Request, Response } from "express";
import { EventsService } from "../services/events.service";
import { Event } from "../interfaces/events";

let service = new EventsService();

//create event
export class EventsController {
    async createEvent(req: Request, res: Response) {
        try {
            let event: Event = req.body;
            let response = await service.createEvent(event);
            return res.json(response);
        } catch (error) {
            const err = res.json({ error });
            return err;
            console.log(err);
        }
    }

    //get all events
    async getEvents(req: Request, res: Response) {
        try {
            let response = await service.getEvents();
            return res.json(response);
        } catch (error) {
            const err = res.json({ error });
            return err;
            console.log(err);
        }
    }

    //GET events where nature is APPROVED and status ACTIVE
    async getActiveEvents(req: Request, res: Response) {
        try {
            let response = await service.getActiveEvents();
            return res.json(response);
        } catch (error) {
            return res.json({ error });
        }
    }

    //unapproved but active getPending
    async getPendingEvents(req: Request, res: Response) {
        try {
            let response = await service.getPendingEvents();
            return res.json(response);
        } catch (error) {
            return res.json({ error });
        }
    }

    //get Event by id
    async getEventById(req: Request, res: Response) {
        try {
            let eventId = req.params.id;
            let response = await service.getEventById(eventId);
            return res.json(response);
        } catch (error) {
            return res.json({ error });
        }
    }

    //update event
    async updateEvent(req: Request, res: Response) {
        try {
            let eventId = req.params.id;
            let event: Event = req.body;
            let response = await service.updateEvent(eventId, event);
            return res.json(response);
        } catch (error) {
            const err = res.json({ error });
            return err;
            console.log(err);
        }
    }

    //cancle event
    async cancelEvent(req: Request, res: Response) {
        try {
            let eventId = req.params.id;
            let response = await service.cancelEvent(eventId);
            return res.json(response);
        } catch (error) {
            return res.json({ error });
        }
    }

    //approve event
    async approveEvent(req: Request, res: Response) {
        try {
            let eventId = req.params.id;
            let response = await service.approveEvent(eventId);
            return res.json(response);
        } catch (error) {
            return res.json({ error });
        }
    }

    //get approved events
    async getApprovedEvents(req: Request, res: Response) {
        try {
            let response = await service.getApprovedEvents();
            return res.json(response);
        } catch (error) {
            return res.json({ error });
        }
    }

    //add promo details
    async addPromotion(req: Request, res: Response) {
        try {
            let eventId = req.params.id;
            let promoDetails = req.body.promoDetails;
            let response = await service.addPromotion(eventId, promoDetails);
            return res.json(response);
        } catch (error) {
            return res.json({ error });
        }
    }

    //remove promotion
    async removePromotion(req: Request, res: Response) {
        try {
            let eventId = req.params.id;
            let response = await service.removePromotion(eventId);
            return res.json(response);
        } catch (error) {
            return res.json({ error });
        }
    }

    //set event nature to rejected
    async rejectEvent(req: Request, res: Response) {
        try {
            let eventId = req.params.id;
            let response = await service.rejectEvent(eventId);
            return res.json(response);
        } catch (error) {
            return res.json({ error });
        }
    }

    //peaople attneding event
    async peopleAttending(req: Request, res: Response) {
        try {
            let eventId = req.params.id;
            let response = await service.getEventAttendees(eventId);
            return res.json(response);
        } catch (error) {
            return res.json({ error });
        }
    }

   

    //get number of reservations for user
    async getTotalReservationsForUser(req: Request, res: Response) {
        try {
            let userId = req.params.userId;
            let response = await service.getTotalReservationsForUser(userId);
            return res.json(response);
        } catch (error) {
            return res.json({ error });
        }
    }

    //get all reservations based on manager
    /**
     * use this //GET number of RSVPs IN SYSTEMS
async getTotalReservationsForUser(userId: string) {
    try {
        // Step 1: Find all events created by the manager
        const events = await this.prisma.event.findMany({
            where: {
                managerId: userId
            },
            select: {
                eventId: true
            }
        });

        // Step 2: Extract event IDs
        const eventIds = events.map(event => event.eventId);

        // Step 3: Count reservations for these events
        const totalReservations = await this.prisma.reservation.count({
            where: {
                eventId: {
                    in: eventIds
                }
            }
        });

        // Step 4: Return the total count
        return totalReservations;
    } catch (error) {
        return { message: "An unexpected error occurred.", responseCode: 500, error: error };
    }
}
     */

    //get all reservations based on manager
    async getReservationsForManager(req: Request, res: Response) {
        try {
            let managerId = req.params.id;  // Change this from req.params.managerId to req.params.id
            console.log("Manager ID received:", managerId);  // Add this log
            let response = await service.getTotalReservationsForManager(managerId);
            return res.json(response);
        } catch (error) {
            return res.json({ error });
        }
    }

    //get events count for manager
    async getEventCountForManagers(req: Request, res: Response) {
  try {
    const eventCounts = await service.getEventCountForManagers();
    return res.json(eventCounts);
  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({ error: 'Failed to get event count for managers' });
  }
}

//manager events absed on id
async getEventCountForManager(req: Request, res: Response) {
    try {
      const managerId = req.params.managerId;
      if (!managerId) {
        return res.status(400).json({ error: 'Manager ID is required' });
      }
  
      const eventCount = await service.getEventDetailsForManager(managerId);
      return res.json({ managerId, eventCount });
    } catch (error) {
      console.error('Controller error:', error);
      return res.status(500).json({ error: 'Failed to get event count for manager' });
    }
  }
}

  