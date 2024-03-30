import { StyleSheet, View } from "react-native";
import { Drawer, Surface, Text, useTheme } from "react-native-paper";
import { useWoukie } from "../contexts/WoukieContext";
import Chat from "../components/Chat";
import { useAuth } from "../contexts/AuthenticationContext";
import { useCreateChannelDialogue } from "../contexts/CreateChannelDialogue";
import { ScrollView } from "react-native-gesture-handler";

export default function Server({ navigation }) {
  const theme = useTheme();
  const { user } = useAuth();
  const createChannelDialogue = useCreateChannelDialogue();
  const {
    selectedServerID,
    selectedChannelID,
    setSelectedChannelID,
    channels,
    servers,
  } = useWoukie();

  const serverData = servers.find((server) => server._id === selectedServerID);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.fakeDrawer} elevation={2}>
        {serverData && channels && (
          <ScrollView>
            <Drawer.Section title={serverData.name || ""} />
            <Drawer.Section title="Text Channels">
              {channels
                .filter((channel) => !channel.voice)
                .map((channel) => (
                  <Drawer.Item
                    key={channel._id}
                    active={channel._id === selectedChannelID}
                    icon="chat"
                    label={channel.name}
                    onPress={() => setSelectedChannelID(channel._id)}
                  />
                ))}
            </Drawer.Section>

            <Drawer.Section title="Voice Channels">
              {channels
                .filter((channel) => channel.voice)
                .map((channel) => (
                  <Drawer.Item
                    key={channel._id}
                    active={channel._id === selectedChannelID}
                    icon="microphone"
                    label={channel.name}
                    onPress={() => setSelectedChannelID(channel._id)}
                  />
                ))}
            </Drawer.Section>

            {serverData.owner_id && serverData.owner_id === user._id && (
              <Drawer.Section>
                <Drawer.Item
                  key={"create channel"}
                  icon="chat-plus"
                  label={"Create Channel"}
                  onPress={() => {
                    createChannelDialogue.show(serverData._id, false);
                  }}
                />
                <Drawer.Item
                  key={"create voice chat"}
                  icon="microphone-plus"
                  label={"Create Voice Chat"}
                  onPress={() => {
                    createChannelDialogue.show(serverData._id, true);
                  }}
                />
                <Drawer.Item
                  key={"Invite"}
                  icon="account-plus"
                  label={"Invite Link"}
                  onPress={() => {}}
                />
              </Drawer.Section>
            )}
          </ScrollView>
        )}
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
