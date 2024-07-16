export interface Reservation {
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
  