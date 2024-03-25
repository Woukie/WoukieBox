import "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "./contexts/AuthenticationContext";
import { SpinnerProvider } from "./contexts/Spinner";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DialogueProvider } from "./contexts/Dialogue";
import { WoukieProvider } from "./contexts/WoukieContext";
import Core from "./stacks/Core";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <SpinnerProvider>
        <AuthProvider>
          <WoukieProvider>
            <DialogueProvider>
              <Core />
            </DialogueProvider>
          </WoukieProvider>
        </AuthProvider>
      </SpinnerProvider>
    </PaperProvider>
  );
}
