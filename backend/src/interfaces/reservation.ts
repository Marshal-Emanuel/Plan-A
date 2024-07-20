export interface Reservation {
    user: any;
    paidAmmount: any;
    eventId: string;
    userId: string;
    isRegular: boolean;
    isVIP: boolean;
    isChildren: boolean;
    proxyName?: string;
    numberOfPeople: number;
    createdAt: Date;
    updatedAt: Date;
  }
  export interface CancellationReservation {
    user: { email: string; name: string };
    event: { name: string; manager: { email: string; name: string } };
  }
  
  