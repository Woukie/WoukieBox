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
import { useNavigation } from "@react-navigation/native";

const JoinServerDialogueContext = createContext();

export const JoinServerDialogueProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { setShowSpinner } = useSpinner();
  const { fetchServers, setSelectedServerID } = useWoukie();

  const show = () => {
    setName("");
    setError("");
    setVisible(true);
  };

  const submit = async () => {
    setShowSpinner(true);
    try {
      const response = await AxiosInstance.post("/servers/join", { name });

      if (!response || !response.data) {
        throw new Error("Unknown error...");
      }

      if (response.data.status === "success") {
        await fetchServers();
        setSelectedServerID(response.data.server_id);
        setVisible(false);
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
    <JoinServerDialogueContext.Provider value={{ show }}>
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
              label="Server Name"
            />
            <HelperText type="error" visible={error}>
              {error}
            </HelperText>

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
              <Button
                icon={"account-multiple-plus"}
                mode="contained"
                onPress={submit}
              >
                Join
              </Button>
            </View>
          </Surface>
        </Modal>
      </Portal>
    </JoinServerDialogueContext.Provider>
  );
};

export const useJoinServerDialogue = () => {
  const context = useContext(JoinServerDialogueContext);
  if (!context) {
    throw new Error(
      "useJoinServerDialogue must be used within a JoinServerDialogueProvider"
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
