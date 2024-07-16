
// reservation_router.ts
import { Router } from "express";
import { ReservationController } from "../controllers/reservation.controller";
import { verifyToken, isUser, isManager, isAdmin, ExtendedRequest } from "../middlewares/verifyToken"; // Import ExtendedRequest

const reservation_router = Router();
const reservationController = new ReservationController();

reservation_router.post('/createReservation', verifyToken, isUser, reservationController.createReservation);
reservation_router.put('/cancelReservation/:reservationId', verifyToken, isUser, reservationController.cancelReservation);
reservation_router.get('/getAllReservations', verifyToken, (req: ExtendedRequest, res, next) => {
    if (req.info?.role === 'admin' || req.info?.role === 'manager') {
        next();
    } else {
        res.status(403).json({ error: 'You are not authorized to perform this operation.' });
    }
}, reservationController.getAllReservations);
reservation_router.get('/getOneReservation/:reservationId', verifyToken, (req: ExtendedRequest, res, next) => {
    if (req.info?.role === 'admin' || req.info?.role === 'manager' || req.info?.role === 'user') {
        next();
    } else {
        res.status(403).json({ error: 'You are not authorized to perform this operation.' });
    }
}, reservationController.getOneReservation);
export default reservation_router;















// import { Router } from "express";
// import { ReservationController } from "../controllers/reservation.controller";
// import { verifyToken, isUser, isManager, isAdmin } from "../middlewares/verifyToken";

// const reservation_router = Router();
// const reservationController = new ReservationController();

// reservation_router.post('/createReservation', verifyToken, isUser, reservationController.createReservation);
// reservation_router.put('/cancelReservation/:reservationId', verifyToken, isUser, reservationController.cancelReservation);

// // Use an array to apply multiple middleware functions conditionally
// reservation_router.get('/getAllReservations', verifyToken, (req, res, next) => {
//     if (isManager(req) || isAdmin(req)) {
//         next();
//     } else {
//         res.status(403).json({ error: 'You are not authorized to perform this operation.' });
//     }
// }, reservationController.getAllReservations);

// reservation_router.get('/getOneReservation/:reservationId', verifyToken, (req, res, next) => {
//     if (isManager(req) || isAdmin(req) || isUser(req)) {
//         next();
//     } else {
//         res.status(403).json({ error: 'You are not authorized to perform this operation.' });
//     }
// }, reservationController.getOneReservation);

// export default reservation_router;
