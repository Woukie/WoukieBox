import AxiosInstance from "../AxiosInstance";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useSpinner } from "./Spinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setShowSpinner } = useSpinner();

  const login = async (username, password) => {
    try {
      setShowSpinner(true);
      const response = await AxiosInstance.post("/auth/login", {
        username,
        password,
      });

      if (!response || !response.data) {
        throw new Error("Unknown error...");
      }

      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }

      checkAuth();
    } catch (error) {
      throw error;
    } finally {
      setShowSpinner(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const register = async (username, email, password) => {
    try {
      setShowSpinner(true);
      const response = await AxiosInstance.post("/auth/register", {
        username,
        email,
        password,
      });

      if (!response || !response.data) {
        throw new Error("Unknown error...");
      }

      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }

      checkAuth();
    } catch (error) {
      throw error;
    } finally {
      setShowSpinner(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await AxiosInstance.post("/auth/user");

      if (!response || !response.data || response.data.status === "error") {
        setUser(null);
      } else {
        console.log("Got user:");
        console.log(response.data);
        setUser(response.data);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, register, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
