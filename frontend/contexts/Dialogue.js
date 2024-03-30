import React, { createContext, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Surface, Text } from "react-native-paper";

const DialogueContext = createContext();

export const DialogueProvider = ({ children }) => {
  const [showDialogue, setShowDialogue] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const show = (title, body) => {
    setShowDialogue(true);
    setTitle(title);
    setBody(body);
  };

  return (
    <DialogueContext.Provider value={{ show }}>
      {children}
      <Portal>
        <Modal
          contentContainerStyle={styles.root}
          visible={showDialogue}
          onDismiss={() => setShowDialogue(false)}
        >
          <Surface elevation={5} style={styles.surface}>
            <Text variant="titleMedium">{title}</Text>
            <Text variant="bodyMedium">{body}</Text>
            <Button onPress={() => setShowDialogue(false)}>Ok</Button>
          </Surface>
        </Modal>
      </Portal>
    </DialogueContext.Provider>
  );
};

export const useDialogue = () => {
  const context = useContext(DialogueContext);
  if (!context) {
    throw new Error("useDialogue must be used within a DialogueProvider");
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
    minWidth: 300,
  },
});
