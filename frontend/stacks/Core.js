import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { Appbar, Surface, useTheme } from "react-native-paper";
import WoukieBox from "../stacks/WoukieBox";
import Authentication from "../stacks/Authentication";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function Core() {
  const theme = useTheme();

  return (
    <NavigationContainer theme={theme}>
      <Appbar.Header elevated={true}>
        <Appbar.Content title="WoukieBox" />
      </Appbar.Header>
      <Stack.Navigator
        initialRouteName="Authentication"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Authentication" component={Authentication} />
        <Stack.Screen name="WoukieBox" component={WoukieBox} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
