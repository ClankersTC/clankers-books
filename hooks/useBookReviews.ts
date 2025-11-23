import { useQuery } from "@tanstack/react-query";
import { getToken } from "@/lib/auth";
import { Review } from "@/types/reviews";

const API_URL = process.env.NEXT_PUBLIC_API_ROUTE_CLANKERS_REVIEWS;

const fetchReviews = async (bookId: string): Promise<Review[]> => {
    const token = getToken();

    if (!token) {
        throw new Error("No token found");
    }

    const res = await fetch(`${API_URL}/${bookId}/reviews`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al cargar reviews");
    }

    return res.json();
};

export function useBookReviews(bookId: string) {
    return useQuery({
        queryKey: ["reviews", bookId], 
        queryFn: () => fetchReviews(bookId),
        enabled: !!bookId, 
        staleTime: 1000 * 60 * 5, 
        retry: (failureCount, error: any) => {
            if (error.message.includes("403") || error.message.includes("401")) return false;
            return failureCount < 2;
        }
    });
}