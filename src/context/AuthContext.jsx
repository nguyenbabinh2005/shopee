// src/context/AuthContext.js hoặc src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";
import authAPI from "../services/authAPI";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login(username, password);

      if (res.success) {
        setUser({ username });
        return { success: true };
      } else {
        return { success: false, message: res.message };
      }
    } catch (error) {
      return {
        success: false,
        message: "Không thể kết nối đến server",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};