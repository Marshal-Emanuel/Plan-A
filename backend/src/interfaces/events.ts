export interface Event {
    name: string;            // Name of the event
    description: string;     // Description of the event
    moreInfo: string;        // Additional information about the event
    location: string;        // Location of the event
    date: Date;              // Date of the event
    time: Date;              // Time of the event
    image?: string;          // URL or path to the event image
  
    hasRegular: boolean;     // Indicates if Regular tickets are available
    regularPrice: number;    // Price for Regular tickets
  
    hasVIP: boolean;         // Indicates if VIP tickets are available
    vipPrice: number;        // Price for VIP tickets
  
    hasChildren: boolean;    // Indicates if Children tickets are available
    childrenPrice: number;   // Price for Children tickets
  
    isPromoted: boolean;     // Indicates if the event is under promotion
    promoDetails?: string;    // Details of the promotion
  
    status: string;          // Status of the event (e.g., "ACTIVE", "CANCELED")
    nature: string;          // Nature of the event (e.g., "APPROVED", "PENDING")
  }
  