import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useAuth } from "../contexts/AuthenticationContext";
import { useDialogue } from "../contexts/Dialogue";

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [hidePassword, setHidePassword] = useState(true);

  const theme = useTheme();
  const dialogue = useDialogue();
  const { login } = useAuth();

  const handleSubmit = async () => {
    try {
      await login(username, password);
      // navigation.navigate("WoukieBox");
    } catch (error) {
      dialogue.show("Error!", error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.root}>
        <Text variant="titleLarge">Login</Text>

        <View style={{ paddingBottom: 8 }}>
          <TextInput
            mode="outlined"
            label="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />

          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={hidePassword}
            right={
              <TextInput.Icon
                icon={hidePassword ? "eye-off" : "eye"}
                onPress={() => setHidePassword(!hidePassword)}
                forceTextInputFocus={false}
              />
            }
          />
        </View>

        <Button
          mode="contained"
          style={{ ...styles.button, marginBottom: 8 }}
          onPress={handleSubmit}
        >
          Login
        </Button>
        <Button
          mode="text"
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          Make an account
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  surface: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "100%",
  },
});
