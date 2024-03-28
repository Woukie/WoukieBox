import "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "./contexts/AuthenticationContext";
import { SpinnerProvider } from "./contexts/Spinner";
import { DialogueProvider } from "./contexts/Dialogue";
import { WoukieProvider } from "./contexts/WoukieContext";
import React from "react";
import Core from "./stacks/Core";
import { SocketProvider } from "./contexts/SocketContext";

export default function App() {
  return (
    <PaperProvider>
      <SpinnerProvider>
        <AuthProvider>
          <WoukieProvider>
            <SocketProvider>
              <DialogueProvider>
                <Core />
              </DialogueProvider>
            </SocketProvider>
          </WoukieProvider>
        </AuthProvider>
      </SpinnerProvider>
    </PaperProvider>
  );
}
