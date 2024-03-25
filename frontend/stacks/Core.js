import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { Appbar, useTheme } from "react-native-paper";
import WoukieBox from "../stacks/WoukieBox";
import Authentication from "../stacks/Authentication";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Loading from "../pages/Loading";

const Stack = createNativeStackNavigator();

export default function Core({ navigation }) {
  const theme = useTheme();

  return (
    <NavigationContainer theme={theme}>
      <Appbar.Header elevated={true}>
        <Appbar.Content title="WoukieBox 2" />
      </Appbar.Header>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Authentication" component={Authentication} />
        <Stack.Screen name="WoukieBox" component={WoukieBox} />
        <Stack.Screen name="Loading" component={Loading} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
