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
  