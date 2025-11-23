export interface Review {
    id: string;
    avatar: string;
    bookId: string;
    createdAt: Date;
    finishedDate: Date;
    hasSpoilers: boolean;
    rating: number;
    reviewerName: string;
    reviewText: string;
    startedDate: Date;
    userId: string;
}