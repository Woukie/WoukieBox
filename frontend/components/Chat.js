import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { useWoukie } from "../contexts/WoukieContext";

export default function Chat() {
  const theme = useTheme();

  const { selectedChannelID } = useWoukie();

  return (
    <View style={{ flex: 1 }}>
      {selectedChannelID && (
        <View style={styles.root}>
          <ActivityIndicator size="large" />
          <Text style={{ padding: 16 }} variant="titleMedium">
            Connecting to room: {selectedChannelID}
          </Text>
        </View>
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
