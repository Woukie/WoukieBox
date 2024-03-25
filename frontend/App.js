import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "./contexts/AuthenticationContext";
import WoukieBox from "./stacks/WoukieBox";
import Authentication from "./stacks/Authentication";
import { SpinnerProvider } from "./contexts/Spinner";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DialogueProvider } from "./contexts/Dialogue";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <SpinnerProvider>
        <AuthProvider>
          <DialogueProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Authentication"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen
                  name="Authentication"
                  component={Authentication}
                />
                <Stack.Screen name="WoukieBox" component={WoukieBox} />
              </Stack.Navigator>
            </NavigationContainer>
          </DialogueProvider>
        </AuthProvider>
      </SpinnerProvider>
    </PaperProvider>
  );
}
