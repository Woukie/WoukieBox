import { StyleSheet, View } from "react-native";
import { Drawer, Surface, Text, useTheme } from "react-native-paper";
import { useWoukie } from "../contexts/WoukieContext";
import Chat from "../components/Chat";

export default function Server({ navigation }) {
  const theme = useTheme();
  const {
    selectedServerID,
    selectedChannelID,
    setSelectedChannelID,
    channels,
    servers,
  } = useWoukie();

  const serverData = servers.find((server) => server._id === selectedServerID);

  console.log("Displaying server data:");
  console.log(serverData._id);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.fakeDrawer} elevation={2}>
        <Drawer.Section title={serverData.name || ""}>
          {serverData &&
            channels &&
            channels.map((channel) => (
              <Drawer.Item
                key={channel._id}
                active={channel._id === selectedChannelID}
                icon="chat"
                label={channel.name}
                onPress={() => setSelectedChannelID(channel._id)}
              />
            ))}
        </Drawer.Section>
      </Surface>

      <Chat />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
  },
  fakeDrawer: {
    width: 300,
    height: "100%",
  },
});
