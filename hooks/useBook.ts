"use client";

import { useQuery } from "@tanstack/react-query";
import { getToken } from "../lib/auth"; 
import { Book } from "../types/book"; 

const API_URL = process.env.NEXT_PUBLIC_API_ROUTE_CLANKERS_BOOKS;


const fetchBookById = async (id: string): Promise<Book> => {
    const token = getToken();
    console.log(`${API_URL}/${id}`)
    const res = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
        },
    });

    if (!res.ok) {
        if (res.status === 404) throw new Error("Book not found");
        if (res.status === 403) throw new Error("Unauthorized");
        throw new Error("Error fetching book details");
    }

    return res.json();
};

export const useBook = (id: string) => {
    return useQuery({
        queryKey: ["book", id], 
        queryFn: () => fetchBookById(id),
        enabled: !!id, 
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};