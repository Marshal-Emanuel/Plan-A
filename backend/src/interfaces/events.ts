export interface Event {
  name: string;
  description: string;
  moreInfo: string;
  location: string;
  date: Date;
  time: Date;
  numberofTickets: number;
  remainingTickets: number;
  image?: string;
  managerId: string;
  
  hasRegular: boolean;
  regularPrice: number;
  
  hasVIP: boolean;
  vipPrice: number;
  
  hasChildren: boolean;
  childrenPrice: number;
  
  isPromoted: boolean;
  promoDetails?: string;
  
  status: string;
  nature: string;
}
