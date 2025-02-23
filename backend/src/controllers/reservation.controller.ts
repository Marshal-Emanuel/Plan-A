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

    /**private calculatePrice(reservation: any): number {
        let totalPrice = 0;
        if (reservation.isRegular) {
            totalPrice += reservation.event.regularPrice * reservation.numberOfPeople;
        }
        if (reservation.isVIP) {
            totalPrice += reservation.event.vipPrice * reservation.numberOfPeople;
        }
        if (reservation.isChildren) {
            totalPrice += reservation.event.childrenPrice * reservation.numberOfPeople;
        }
        return totalPrice;
    }
     */

    //reservaton calculate price
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

     // Get sum of paid amounts for reservations based on event and manager
     async getSumOfPaidAmounts(req: Request, res: Response) {
        try {
            let eventId = req.query.eventId as string;
            let managerId = req.query.managerId as string;
            let response = await service.getSumOfPaidAmounts(eventId);
            return res.json(response);
        } catch (error) {
            const err = res.json({ error });
            return err;
            console.log(err);
        }
    }
    
    async getTotalPaidAmountForAllEvents(req: Request, res: Response) {
        try {
            let response = await service.getTotalPaidAmountForAllEvents();
            return res.json(response);
        } catch (error) {
            const err = res.json({ error });
            return err;
            console.log(err);
        }
    }

    // Get sum of paid amounts for reservations based on event and manager
    async getSumOfPaidAmountsForManager(req: Request, res: Response) {
        try {
          const managerId = req.params.id as string; // Retrieve managerId from req.params
          console.log('Manager ID:', managerId); // Log the managerId to check its value
    
          if (!managerId) {
            return res.status(400).json({ message: 'Manager ID is required' });
          }
    
          const response = await service.getTotalPaidAmountForManager(managerId);
          return res.json(response);
        } catch (error) {
          console.error('Error fetching total paid amount for manager:', error);
          return res.status(500).json({ message: 'An unexpected error occurred.'});
        }
      }


    // get reservations for one user
    async getReservationsForUser(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const reservations = await service.getReservationsForUser(userId);
            return res.json(reservations);
        } catch (error) {
            console.error("Error fetching reservations for user:", error);
            return res.status(500).json({ message: "An unexpected error occurred." });
        }
    }

      
    


}

