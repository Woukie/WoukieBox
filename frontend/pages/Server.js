import { StyleSheet, View } from "react-native";
import { Appbar, Drawer, Surface, Text, useTheme } from "react-native-paper";
import { useWoukie } from "../contexts/WoukieContext";

export default function Server({ navigation }) {
  const theme = useTheme();
  const { selectedServerID, selectedChannelID, channels, servers } =
    useWoukie();

  const serverData = servers.find((server) => server._id === selectedServerID);

  console.log("Displaying server data:");
  console.log(serverData._id);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {serverData && (
        <Surface style={styles.fakeDrawer}>
          <Drawer.Section title={serverData.name}>
            <Drawer.Item icon="star" active={true} label="First Item" />
            <Drawer.Item icon="star" label="First Item" />
            <Drawer.Item icon="star" label="First Item" />
            <Drawer.Item icon="star" label="First Item" />
          </Drawer.Section>
        </Surface>
      )}

      <Text variant="titleLarge">Servers Paeg!!1!!1!!!</Text>
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
