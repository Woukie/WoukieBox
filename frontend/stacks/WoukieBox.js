import * as React from "react";
import {
  DrawerContentScrollView,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import Server from "../pages/Server";
import Profile from "../pages/Profile";
import { useWoukie } from "../contexts/WoukieContext";
import { Drawer as PaperDrawer } from "react-native-paper";
import { useCreateServerDialogue } from "../contexts/CreateServerDialogue";

const Drawer = createDrawerNavigator();

export default function WoukieBox({ navigation }) {
  const { servers, setSelectedServerID } = useWoukie();
  const createServerDialogue = useCreateServerDialogue();

  const drawerContent = (props) => {
    return (
      <DrawerContentScrollView style={{ flex: 1 }} {...props}>
        <PaperDrawer.Section>
          <PaperDrawer.CollapsedItem
            key={"Profile"}
            focusedIcon={"account"}
            label="Profile"
            onPress={() => navigation.navigate("Profile")}
          />
          <PaperDrawer.CollapsedItem
            key={"Create Server"}
            focusedIcon={"plus"}
            label="Create Server"
            onPress={() => {
              createServerDialogue.show();
            }}
          />
        </PaperDrawer.Section>
        <PaperDrawer.Section>
          {servers &&
            servers.map((server) => (
              <PaperDrawer.CollapsedItem
                key={server._id}
                focusedIcon="earth"
                label={server.name}
                onPress={() => {
                  navigation.navigate("Server");
                  setSelectedServerID(server._id);
                }}
              />
            ))}
        </PaperDrawer.Section>
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={drawerContent}
      screenOptions={{
        drawerType: "permanent",
        headerShown: false,
        drawerStyle: { width: 80 },
      }}
    >
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Server" component={Server} />
    </Drawer.Navigator>
  );
}
