import React, { createContext, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  HelperText,
  Modal,
  Portal,
  Surface,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";
import AxiosInstance from "../AxiosInstance";
import { useSpinner } from "./Spinner";
import { useWoukie } from "./WoukieContext";
import { useSocket } from "./SocketContext";

const CreateChannelDialogueContext = createContext();

export const CreateChannelDialogueProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [server_id, setServerID] = useState(""); // I know
  const [voice, setVoice] = useState(false);
  const [error, setError] = useState("");

  const { setShowSpinner } = useSpinner();
  const { fetchChannels, setSelectedChannelID } = useWoukie();
  const { socket } = useSocket();

  const show = (server_id, voice) => {
    console.log(server_id);
    setName("");
    setError("");
    setServerID(server_id);
    setVoice(voice);
    setVisible(true);
  };

  const submit = async () => {
    try {
      setShowSpinner(true);
      const response = await AxiosInstance.post("/channels/create", {
        name,
        server_id,
        voice,
      });

      if (!response || !response.data) {
        throw new Error("Unknown error...");
      }

      if (response.data.status === "success") {
        await fetchChannels();
        setSelectedChannelID(response.data.channel_id);
        setVisible(false);
        socket.emit(
          "join_channel",
          { channel_id: response.data.channel_id },
          (response) => {
            console.log(response);
          }
        );
      } else if (response.data.message) {
        setError(response.data.message);
      }
    } catch (error) {
      throw error;
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <CreateChannelDialogueContext.Provider value={{ show }}>
      {children}
      <Portal>
        <Modal
          contentContainerStyle={styles.root}
          visible={visible}
          onDismiss={() => setVisible(false)}
        >
          <Surface style={styles.surface} elevation={5}>
            <TextInput
              maxLength={20}
              error={error}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              mode="outlined"
              label="Channel Name"
            />
            <HelperText type="error" visible={error}>
              {error}
            </HelperText>

            <View
              style={{
                flexDirection: "row",
                paddingBottom: 16,
              }}
            >
              <Text variant="bodyMedium" style={{ paddingRight: 16 }}>
                Voice
              </Text>
              <Switch
                value={voice}
                onValueChange={() => {
                  setVoice(!voice);
                }}
              />
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                icon={"cancel"}
                mode="contained-tonal"
                onPress={() => setVisible(false)}
              >
                Cancel
              </Button>
              <Button icon={"hammer"} mode="contained" onPress={submit}>
                Create
              </Button>
            </View>
          </Surface>
        </Modal>
      </Portal>
    </CreateChannelDialogueContext.Provider>
  );
};

export const useCreateChannelDialogue = () => {
  const context = useContext(CreateChannelDialogueContext);
  if (!context) {
    throw new Error(
      "useCreateChannelDialogue must be used within a CreateChannelDialogueProvider"
    );
  }
  return context;
};

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
    alignSelf: "center",
  },
  surface: {
    padding: 16,
    borderRadius: 8,
    width: 400,
  },
});
