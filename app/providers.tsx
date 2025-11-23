"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import  AuthProvider  from "../providers/AuthProvider"
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
        new QueryClient({
            defaultOptions: {
            queries: {
                staleTime: 60 * 1000, 
            },
            },
        })
    );

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </AuthProvider>
    );
}