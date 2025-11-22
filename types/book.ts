export interface Book {
    id: string;
    title: string;
    author: string;
    rating: number;
    reviewCount: number;
    coverImage: string;
    coverAlt: string;
    description: string;
    reviews: {
        reviewerName: string;
        timeAgo: string;
        rating: number;
        reviewText: string;
        avatar?: string;
    }[];
}