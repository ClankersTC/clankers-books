"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_ROUTE_CLANKERS_REVIEWS;

export function useCreateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookId, payload }: { bookId: string; payload: any }) => {
        const token = getToken();
        if (!token) throw new Error("No autenticado");

        const res = await fetch(`${API_URL}/${bookId}/reviews`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Error al crear review");
        }

        return res.json();
        },

        onSuccess: (newReviewFromServer, variables) => {
        const { bookId } = variables;

        
        queryClient.setQueryData<any[]>(["reviews", bookId], (oldReviews) => {
            if (!oldReviews) return [newReviewFromServer];

            
            return [newReviewFromServer, ...oldReviews];
        });

        queryClient.invalidateQueries({ queryKey: ["books", bookId] });
        queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
}