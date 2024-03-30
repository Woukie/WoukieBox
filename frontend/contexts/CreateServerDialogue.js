import React, { createContext, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  HelperText,
  Modal,
  Portal,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import AxiosInstance from "../AxiosInstance";
import { useSpinner } from "./Spinner";
import { useWoukie } from "./WoukieContext";
import { useNavigation } from "@react-navigation/native";

const CreateServerDialogueContext = createContext();

export const CreateServerDialogueProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [error, setError] = useState("");

  const { setShowSpinner } = useSpinner();
  const { fetchServers, setSelectedServerID } = useWoukie();
  const navigation = useNavigation();

  const show = () => {
    setName("");
    setIcon("");
    setError("");
    setVisible(true);
  };

  const submit = async () => {
    console.log(name);
    try {
      setShowSpinner(true);
      const response = await AxiosInstance.post("/servers/create", { name });

      if (!response || !response.data) {
        throw new Error("Unknown error...");
      }

      if (response.data.status === "success") {
        await fetchServers();
        setSelectedServerID(response.data.server_id);
        navigation.navigate("Server");
        setVisible(false);
        console.log(response.data.server_id);
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
    <CreateServerDialogueContext.Provider value={{ show }}>
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

            <Text variant="bodyMedium" style={{ paddingBottom: 16 }}>
              By creating a server you agree to proactively climb the heavenly
              ranks in the pursuit of godhood
            </Text>
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
    </CreateServerDialogueContext.Provider>
  );
};

export const useCreateServerDialogue = () => {
  const context = useContext(CreateServerDialogueContext);
  if (!context) {
    throw new Error(
      "useCreateServerDialogue must be used within a CreateServerDialogueProvider"
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
