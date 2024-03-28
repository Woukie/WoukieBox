import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import Textarea from "react-expanding-textarea";
import { useWoukie } from "../contexts/WoukieContext";
import { useSocket } from "../contexts/SocketContext";
import { useEffect, useState } from "react";

const placeholders = [
  "im gay...",
  "um hi...",
  "my cock smells SO bad...",
  "you look horrible today...",
  "you look beautifull today...",
  ":3...",
  "gonna kms on vc later...",
  "I LOVE you...",
  "I HATE you...",
  "add me on discord...",
  "(⌐■_■)...",
  "( •_•)>⌐■-■...",
];

const randomPlaceholder = () => {
  return Math.random() >= 0.1
    ? "Message here..."
    : placeholders[Math.floor(Math.random() * placeholders.length)];
};

export default function Chat() {
  const [message, setMessage] = useState("");
  const [placeholder, setPlaceHolder] = useState(randomPlaceholder());

  const theme = useTheme();
  const { connected, socket } = useSocket();
  const { selectedChannelID } = useWoukie();

  useEffect(() => {
    setPlaceHolder(randomPlaceholder());
  }, [selectedChannelID]);

  const font = theme.fonts.bodyLarge;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.root}>
        {connected ? (
          selectedChannelID ? (
            <Text variant="titleMedium">Connected!</Text>
          ) : (
            <Text variant="titleMedium">le no chnanels on serer...</Text>
          )
        ) : (
          <View>
            <ActivityIndicator size="large" />
            <Text style={{ padding: 16 }} variant="titleMedium">
              Connecting...
            </Text>
          </View>
        )}
      </View>

      {/* I hate this more than you think :) */}
      <View style={{ flexDirection: "row", alignContent: "flex-end" }}>
        <Surface elevation={2} style={{ flex: 1, padding: 0 }}>
          <Textarea
            maxLength={3000}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder={placeholder}
            style={{
              ...styles.input,
              fontFamily: font.fontFamily,
              fontSize: font.fontSize,
              fontStyle: font.fontStyle,
              fontWeight: font.fontWeight,
              letterSpacing: font.letterSpacing,
              outline: "none",
            }}
          />
        </Surface>
        <Button
          mode="contained-tonal"
          icon="send"
          onPress={() => {}}
          style={{ borderRadius: 0 }}
          contentStyle={(styles.flexReverse, { height: 46 })}
        >
          Send
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  input: {
    maxHeight: "300px",
    display: "block",
    padding: 14,
    paddingLeft: 16,
    paddingRight: 16,
    color: "rgb(230, 225, 229)",
    backgroundColor: "rgba(0, 0, 0, 0)",
    margin: 0,
    appearance: "none",
    borderRadius: 0,
    boxSizing: "border-box",
    resize: "none",
    borderWidth: 0,
  },
  flexReverse: {
    flexDirection: "row-reverse",
  },
});
