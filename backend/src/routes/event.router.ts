import { Router } from "express";
import { EventsController } from "../controllers/events.controller";
import { verifyToken, isManager, isAdmin } from "../middlewares/verifyToken";
import e from "cors";

const event_router = Router();
const eventController = new EventsController();

event_router.post('/createEvent',verifyToken, isManager, eventController.createEvent);
event_router.get('/getEvents', eventController.getEvents);
event_router.get('/getActiveEvents', eventController.getActiveEvents);
event_router.get('/getPendingEvents', eventController.getPendingEvents);
event_router.get('/getEvents/:id', eventController.getEventById);
event_router.put('/updateEvent/:id', verifyToken, isManager, eventController.updateEvent);
event_router.put('/cancelEvent/:id',verifyToken, isManager, eventController.cancelEvent);
event_router.put('/approveEvent/:id',verifyToken, isAdmin, eventController.approveEvent);
event_router.get('/getApprovedEvents', eventController.getApprovedEvents);
event_router.put('/addPromotion/:id',verifyToken, isManager, eventController.addPromotion);
event_router.put('/removePromotion/:id',verifyToken, isManager, eventController.removePromotion);
//reject event
event_router.put('/rejectEvent/:id',verifyToken, isAdmin, eventController.rejectEvent);

export default event_router;