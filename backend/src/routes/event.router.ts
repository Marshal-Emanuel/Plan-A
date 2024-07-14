import { Router } from "express";
import { EventsController } from "../controllers/events.controller";

const event_router = Router();
const eventController = new EventsController();

event_router.post('/createEvent', eventController.createEvent);
event_router.get('/getEvents', eventController.getEvents);
event_router.get('/getEvents/:id', eventController.getEventById);
event_router.put('/updateEvent/:id', eventController.updateEvent);
event_router.put('/cancelEvent/:id', eventController.cancelEvent);
event_router.put('/approveEvent/:id', eventController.approveEvent);
event_router.get('/getApprovedEvents', eventController.getApprovedEvents);
event_router.put('/addPromotion/:id', eventController.addPromotion);

export default event_router;