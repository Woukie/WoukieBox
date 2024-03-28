import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { useWoukie } from "../contexts/WoukieContext";
import { useAuth } from "../contexts/AuthenticationContext";
import { useSocket } from "../contexts/SocketContext";
import { useEffect } from "react";

export default function Chat() {
  const theme = useTheme();
  const { connecting, connected, connect } = useSocket();
  const { selectedChannelID } = useWoukie();

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
              Connecting to room: {selectedChannelID || ""}
            </Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
});
