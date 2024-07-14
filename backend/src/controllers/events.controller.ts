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
}

  