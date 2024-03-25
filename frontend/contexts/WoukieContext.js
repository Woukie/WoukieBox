import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthenticationContext";
import AxiosInstance from "../AxiosInstance";

const WoukieContext = createContext();

// Server:
// name: { type: String, require: true },
// channel_ids: [{ type: Schema.Types.ObjectId }],
// owner_id: { type: Schema.Types.ObjectId, require: true },
// user_ids: [{ type: Schema.Types.ObjectId }],

// Channel:
// name: { type: String, require: true },
// last_message_id: { type: Schema.Types.ObjectId },
// server_id: { type: Schema.Types.ObjectId },

// Message:
// parent_id: { type: Schema.Types.ObjectId },
// sender_id: { type: Schema.Types.ObjectId, require: true },
// channel_id: { type: Schema.Types.ObjectId, require: true },
// sent_at: { type: Date, default: () => Date.now(), require: true },
// content: { type: String, require: true },

export const WoukieProvider = ({ children }) => {
  const [servers, setServers] = useState(null);
  const [channels, setChannels] = useState(null);
  const [messages, setMessages] = useState(null);

  const [selectedServerID, setSelectedServerID] = useState("");
  const [selectedChannelID, setSelectedChannelID] = useState("");

  const { user } = useAuth();

  const fetchServers = () => {
    if (user) {
      AxiosInstance.post("/servers/retrieve")
        .then(function (res) {
          if (!res || !res.data || res.data.status === "error") {
            setServers(null);
          }

          console.log("Got servers:");
          console.log(res.data);
          setServers(res.data);
        })
        .catch(function (error) {
          setServers(null);
          console.log(error);
        });
    }
  };

  useEffect(() => {
    fetchServers();
  }, [user]);

  useEffect(() => {
    // console.log(servers[selectedServerID]);
  }, [selectedServerID]);

  useEffect(() => {
    console.log(selectedChannelID);
  }, [selectedChannelID]);

  return (
    <WoukieContext.Provider
      value={{
        servers,
        channels,
        messages,
        selectedServerID,
        selectedChannelID,
        setSelectedServerID,
        setSelectedChannelID,
      }}
    >
      {children}
    </WoukieContext.Provider>
  );
};

export const useWoukie = () => {
  const context = useContext(WoukieContext);
  if (!context) {
    throw new Error("useWoukie must be used within a WoukieProvider");
  }
  return context;
};
