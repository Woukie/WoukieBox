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
  const [messages, setMessages] = useState([]);
  const [loadingMessageHistory, setLoadingMessageHistory] = useState(false);

  // Example message array:
  // [
  //   {
  //     _id: "some id",
  //     sender_id: "some user id",
  //     channel_id: "some id",
  //     sent_at: new Date(),
  //     content: "some message",
  //   },
  //   {
  //     _id: "some id",
  //     sender_id: "some user id",
  //     channel_id: "some id",
  //     sent_at: new Date(),
  //     content: "some message",
  //   },
  //   {
  //     _id: "some id",
  //     sender_id: "some user id",
  //     channel_id: "some id",
  //     sent_at: new Date(),
  //     content: "some message",
  //   },
  // ];

  const [selectedServerID, setSelectedServerID] = useState("");
  const [selectedChannelID, setSelectedChannelID] = useState("");

  const { user } = useAuth();

  const fetchChannels = async () => {
    if (!user || !selectedServerID) return;

    await AxiosInstance.post("/channels/retrieve", {
      server_id: selectedServerID,
    })
      .then(function (res) {
        if (!res || !res.data || res.data.status === "error") {
          console.log(
            `Error occured when fetching channel data for ${channel_id}`
          );
          setChannels(null);
          return;
        }

        console.log("Got channels:");
        console.log(res.data);
        setChannels(res.data);
        if (res.data[0]) {
          setSelectedChannelID(res.data[0]._id);
        } else {
          setSelectedChannelID(null);
        }
      })
      .catch(function (error) {
        setChannels(null);
        console.log(error);
      });
  };

  const fetchServers = async () => {
    if (!user) return;
    await AxiosInstance.post("/servers/retrieve")
      .then(function (res) {
        if (!res || !res.data || res.data.status === "error") {
          console.log("Error occured when fetching servers");
          setServers(null);
          return;
        }

        console.log("Got servers:");
        console.log(res.data);
        setServers(res.data);
      })
      .catch(function (error) {
        setServers(null);
        console.log(error);
      });
  };

  useEffect(() => {
    fetchServers();
  }, [user]);

  // Fetch channel data when selecting a server
  useEffect(() => {
    fetchChannels();
  }, [selectedServerID]);

  // TEMP: continually loads message history until no more parent messages
  // TODO: Make this load x messages when having scrolled the entire screen, could even be a "load more" button for simplicity on my part
  // TODO: Load in batches of x messages (change on server as well)
  useEffect(() => {
    const originalChannel = selectedChannelID.toString(); // Just in case user has switched chjannels

    if (
      !loadingMessageHistory &&
      messages.length != 0 &&
      messages[0].parent_id
    ) {
      setLoadingMessageHistory(true);

      AxiosInstance.post("/messages/retrieve", {
        message_id: messages[messages.length - 1].parent_id,
      })
        .then((res) => {
          // triggers when loading final message, too drunk to fix rn, woirks anyway
          if (!res || !res.data || res.data.status === "error") {
            console.log(
              "Error occured when fetching message with ID " +
                messages[messages.length - 1].parent_id
            );
            return;
          }

          console.log("gAT");
          console.log(originalChannel);
          console.log(selectedChannelID);
          console.log(messages[messages.length - 1]._id);
          console.log(res.data.child_id);
          if (
            originalChannel != selectedChannelID ||
            messages.length == 0 ||
            messages[messages.length - 1]._id !== res.data.child_id
          )
            return;
          setMessages((messages) => [...messages, res.data]);
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(() => {
          setLoadingMessageHistory(false);
        });
    }
  }, [messages]);

  // TODO: Potential issue when user recieves message from socket before this returns
  useEffect(() => {
    const originalChannel = selectedChannelID;
    if (selectedChannelID) {
      setLoadingMessageHistory(true);
      setMessages([]);
      AxiosInstance.post("/messages/latest", { channel_id: selectedChannelID })
        .then(function (res) {
          if (!res || !res.data || res.data.status === "error") {
            console.log(
              "Error occured when fetching latest message from channel " +
                selectedChannelID.toString()
            );
            return;
          }

          if (originalChannel != selectedChannelID) return;

          setLoadingMessageHistory(false);
          setMessages((messages) => [...messages, res.data]);
        })
        .catch(function (error) {
          console.log(error);
          setLoadingMessageHistory(false);
        });
    }
  }, [selectedChannelID]);

  return (
    <WoukieContext.Provider
      value={{
        servers,
        channels,
        messages,
        selectedServerID,
        selectedChannelID,
        setMessages,
        setSelectedServerID,
        setSelectedChannelID,
        fetchServers,
        fetchChannels,
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
