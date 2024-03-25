import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthenticationContext";

export default function Authentication({ navigation }) {
  const Stack = createNativeStackNavigator();

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigation.navigate("WoukieBox");
    }
  }, [user]);

  return (
    <Stack.Navigator
      initialRouteName="Register"
      screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
