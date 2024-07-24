import { Router } from "express";
import { EventsController } from "../controllers/events.controller";
import { verifyToken, isManager, isAdmin } from "../middlewares/verifyToken";
import e from "cors";

const event_router = Router();
const eventController = new EventsController();

event_router.post('/createEvent',verifyToken, isManager, eventController.createEvent);

event_router.get('/getEvents',verifyToken,isAdmin, eventController.getEvents);

event_router.get('/getActiveEvents', eventController.getActiveEvents);

event_router.get('/getPendingEvents',verifyToken,isAdmin, eventController.getPendingEvents);

event_router.get('/getEvent/:id', eventController.getEventById);

event_router.put('/updateEvent/:id', verifyToken, isManager, eventController.updateEvent);
event_router.put('/cancelEvent/:id',verifyToken, isManager, eventController.cancelEvent);
event_router.put('/approveEvent/:id',verifyToken, isAdmin, eventController.approveEvent);
event_router.get('/getApprovedEvents', eventController.getApprovedEvents);
event_router.put('/addPromotion/:id',verifyToken, isManager, eventController.addPromotion);
event_router.put('/removePromotion/:id',verifyToken, isManager, eventController.removePromotion);
event_router.put('/rejectEvent/:id',verifyToken, isAdmin, eventController.rejectEvent);
//peaople attnding event
event_router.get('/getPeopleAttending/:id', eventController.peopleAttending);
event_router.get('/getTotalReservations',verifyToken, isAdmin, eventController.getTotalReservationsForUser);
//EVENT managers total reservarions made
event_router.get('/totalRSVPsManager/:id',verifyToken,isManager, eventController.getReservationsForManager);
event_router.get('/managerEventCounts',verifyToken,isAdmin,eventController.getEventCountForManagers);
event_router.get('/managerEventCount/:managerId', eventController.getEventCountForManager);
//getEventsByManagerId
event_router.get('/managerEvents/:id',verifyToken,isManager,eventController.getEventsByManagerId)


export default event_router;