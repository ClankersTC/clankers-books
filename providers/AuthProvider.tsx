"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { 
    getToken, 
    getRefreshToken, 
    setAuthCookie, 
    removeAuthCookie, 
    getCurrentUser, 
    User 
} from "../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_ROUTE_CLANKERS_AUTH;

const AuthContext = createContext<{ loading: boolean }>({ loading: true });

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const refreshSession = async () => {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            removeAuthCookie();
            return false;
        }

        try {
        const res = await fetch(`${API_URL}/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) throw new Error("Falló el refresh");

        const data = await res.json();
        
        const expiresInSeconds = parseInt(data.expiresIn, 10);
        const expirationDate = new Date(new Date().getTime() + expiresInSeconds * 1000);
        
        const currentUser = getCurrentUser();
        
        if (currentUser) {
            setAuthCookie(data.idToken, currentUser, expirationDate, data.refreshToken);
            console.log("Token renovado con éxito");
            return true;
        }
        } catch (error) {
        console.error("Error renovando sesión:", error);
        removeAuthCookie();
        router.push("/login"); 
        return false;
        }
    };

    useEffect(() => {
        const initAuth = async () => {
        const token = getToken();
        const refreshToken = getRefreshToken();

        if (!token && refreshToken) {
            await refreshSession();
        }
        
        setLoading(false);
        };

        initAuth();

        
        const intervalId = setInterval(() => {
            if(getRefreshToken()) {
                refreshSession();
            }
        }, 50 * 60 * 1000); 

        return () => clearInterval(intervalId);
    }, []);

    return (
        <AuthContext.Provider value={{ loading }}>
        {children}
        </AuthContext.Provider>
    );
}