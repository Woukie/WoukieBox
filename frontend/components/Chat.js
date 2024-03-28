import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import Textarea from "react-expanding-textarea";
import { useWoukie } from "../contexts/WoukieContext";
import { useAuth } from "../contexts/AuthenticationContext";
import { useSocket } from "../contexts/SocketContext";
import { useCallback, useEffect, useRef, useState } from "react";

const placeholders = [
  "ballse...",
  "OoooohHH im so gay...",
  "um hi...",
  "AAAHHHHHH...",
  "Message here...",
  "my cock smells so bad...",
  ":)...",
  "GOD I hate n...",
];

export default function Chat() {
  const [message, setMessage] = useState("");
  const [placeholder, setPlaceHolder] = useState(
    placeholders[Math.floor(Math.random() * placeholders.length)]
  );

  const theme = useTheme();
  const { connected, sendMessage } = useSocket();
  const { selectedChannelID } = useWoukie();

  useEffect(() => {
    setPlaceHolder(
      placeholders[Math.floor(Math.random() * placeholders.length)]
    );
  }, [selectedChannelID]);

  const font = theme.fonts.bodyLarge;

  return (
    <View style={{ flex: 1 }}>
      {connected ? (
        <View style={styles.root}>
          <Text style={{ padding: 16 }} variant="titleMedium">
            Connected!
          </Text>
        </View>
      ) : (
        selectedChannelID && (
          <View style={styles.root}>
            <ActivityIndicator size="large" />
            <Text style={{ padding: 16 }} variant="titleMedium">
              Connecting...
            </Text>
          </View>
        )
      )}

      <Surface style={{ padding: 0 }}>
        <Textarea
          maxLength={3000}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          placeholder={placeholder}
          style={{
            maxHeight: "300px",
            display: "block",
            padding: 14,
            paddingLeft: 16,
            paddingRight: 16,
            fontFamily: font.fontFamily,
            fontSize: font.fontSize,
            fontStyle: font.fontStyle,
            fontWeight: font.fontWeight,
            letterSpacing: font.letterSpacing,
            color: "rgb(230, 225, 229)",
            backgroundColor: "rgba(0, 0, 0, 0)",
            outline: "none",
            margin: 0,
            appearance: "none",
            borderRadius: 0,
            boxSizing: "border-box",
            resize: "none",
            borderWidth: 0,
          }}
        />
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  container: {
    flex: 1,
  },
  input: {
    minHeight: 40,
    maxHeight: 200,
    margin: 20,
  },
});
