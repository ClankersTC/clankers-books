"use client"
import { useQuery } from "@tanstack/react-query";
import { getToken } from "../lib/auth"; 
import { Book } from "../types/book"; 

const API_URL = process.env.NEXT_PUBLIC_API_ROUTE_CLANKERS_BOOKS;

const fetchBooks = async (): Promise<Book[]> => {
    const token = getToken();

    const res = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Error fetching books");
    }

    return res.json();
};

export const useBooks = () => {
    return useQuery({
        queryKey: ["books"], 
        queryFn: fetchBooks,
        staleTime: 1000 * 60 * 10, 
        retry: 1, 
    });
};