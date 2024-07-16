import { Request, Response } from "express";
import { ReservationService } from "../services/reservations.service";
import { Reservation } from "../interfaces/reservation";

let service = new ReservationService();

//create reservation
export class ReservationController {
    async createReservation(req: Request, res: Response) {
        try {
            let reservation: Reservation = req.body;
            let response = await service.createReservation(reservation);
            return res.json(response);
        } catch (error) {
            const err = res.json({ error });
            return err;
            console.log(err);
        }
    }

    //get all reservations
    async getAllReservations(req: Request, res: Response) {
        try {
            let response = await service.getAllReservations();
            return res.json(response);
        } catch (error) {
            const err = res.json({ error });
            return err;
            console.log(err);
        }
    }

    // get one reservation
    async getOneReservation(req: Request, res: Response) {
        try {
            let reservationId = req.params.reservationId;
            let response = await service.getOneReservation(reservationId);
            return res.json(response);
        } catch (error) {
            const err = res.json({ error });
            return err;
            console.log(err);
        }
    }

    //cancel reservation
    async cancelReservation(req: Request, res: Response) {
        try {
            let reservationId = req.params.reservationId;
            let response = await service.cancelReservation(reservationId);
            return res.json(response);
        } catch (error) {
            const err = res.json({ error });
            return err;
            console.log(err);
        }
    }
}

