import Cookies from "js-cookie";
export interface User {
  id: string;
  username: string; 
  email: string;
  role: string;      
  preferences: string[];
  dateRegister?: Date; 
  lastConection?: Date;
  profileImgURL?: string | null;
}

/**
 * Set authentication cookie (client-side)
 * In production, this should be done server-side with httpOnly, secure, sameSite flags
 */
export function setAuthCookie(
  token: string, 
  user: User,
  expirationTime?: string | Date,
  refreshToken?: string
) {
  const expires = expirationTime ? new Date(expirationTime) : 1/24;

  Cookies.set("clankers_token", token, { 
    expires: expires, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict" 
  });

  Cookies.set("clankers_user", JSON.stringify(user), { 
    expires: expires, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" 
  });

  if (refreshToken) {
    Cookies.set("clankers_refresh", refreshToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
  }
}

/**
 * Elimina la sesión (Logout)
 */
export function removeAuthCookie() {
  Cookies.remove("clankers_token");
  Cookies.remove("clankers_user");
  Cookies.remove("clankers_refresh");
}

export function getRefreshToken(): string | undefined {
  return Cookies.get("clankers_refresh");
}

/**
 * Verifica si hay un token guardado (para proteger rutas en el cliente)
 */
export function isAuthenticated(): boolean {
  return !!Cookies.get("clankers_token");
}

/**
 * Obtiene el Token actual (Para enviarlo en el Header 'Authorization')
 */
export function getToken(): string | undefined {
  return Cookies.get("clankers_token");
}

/**
 * Obtiene los datos del usuario parseados desde la cookie
 */
export function getCurrentUser(): User | null {
  const userStr = Cookies.get("clankers_user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error("Error parsing user cookie:", error);
    return null;
  }
}