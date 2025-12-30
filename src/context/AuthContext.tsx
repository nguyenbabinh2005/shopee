"use client";

import { createContext, useContext, useState } from "react";

interface User {
  userId: number;
  username: string;
  cartId?: number;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer: load user từ localStorage ngay khi khởi tạo state
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") { // đảm bảo code chạy trên client
      const stored = localStorage.getItem("userInfo");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("userInfo", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
