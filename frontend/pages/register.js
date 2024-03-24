import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function Register({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [hidePassword, setHidePassword] = useState(true);

  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.root}>
        <Text variant="titleLarge">Register</Text>

        <View style={{ paddingBottom: 8 }}>
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

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
          onPress={() => {}}
        >
          Register
        </Button>
        <Button
          mode="text"
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          I already have an account
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
