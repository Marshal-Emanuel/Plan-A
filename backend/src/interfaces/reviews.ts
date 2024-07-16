export interface Review {
    reviewId: string;
    eventId: string;
    userId: string;
    comment: string;
    rating: number;
    createdAt: Date;
}

export interface SystemReview{
    reviewId: string;
    userId: string;
    comment: string;
    rating: number;
    createdAt: Date;
}