
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

    /**
     *  //reservaton calculate price
    async calculatePrice(req: Request, res: Response) {
        try {
            let reservation: Reservation = req.body;
            let response = await service.calculatePrice(reservation);
            return res.json(response);
        } catch (error) {
            const err = res.json({ error });
            return err;
            console.log(err);
        }
    }
     */
    reservation_router.get('/calculatePrice', reservationController.calculatePrice);

    // Get sum of paid amounts for reservations based on event and manager
reservation_router.get('/getSumOfPaidAmounts/:id', verifyToken, (req: ExtendedRequest, res, next) => {
    if (req.info?.role === 'admin' || req.info?.role === 'manager') {
        next();
    } else {
        res.status(403).json({ error: 'You are not authorized to perform this operation.' });
    }
}, reservationController.getSumOfPaidAmounts);

reservation_router.get('/getTotalPaidAmountForAllEvents', verifyToken, (req: ExtendedRequest, res, next) => {
    if (req.info?.role === 'admin' || req.info?.role === 'manager') {
        next();
    } else {
        res.status(403).json({ error: 'You are not authorized to perform this operation.' });
    }
}, reservationController.getTotalPaidAmountForAllEvents);





    export default reservation_router;