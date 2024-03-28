import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthenticationContext";
import { useWoukie } from "./WoukieContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const { user } = useAuth();

  const {
    servers,
    channels,
    messages,
    selectedServerID,
    selectedChannelID,
    setSelectedServerID,
    setSelectedChannelID,
  } = useWoukie();

  const connect = async () => {
    const token = await AsyncStorage.getItem("chat-token");
    if (!token || isConnecting) return;

    setIsConnecting(true);
    if (socket) socket.disconnect();

    const newSocket = io(process.env.EXPO_PUBLIC_API_URL, {
      autoConnect: false,
      auth: {
        token,
      },
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      setIsConnecting(false);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("message", ({ message, sender }) => {
      console.log(message, sender);
    });

    setSocket(newSocket);
    newSocket.connect();
  };

  useEffect(() => {
    if (user && !(isConnected || isConnecting)) connect();
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        connecting: isConnecting,
        connected: isConnected,
        connect,
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
