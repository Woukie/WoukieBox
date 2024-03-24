import { View } from "react-native";
import { Text } from "react-native-paper";

export default function Login() {
  return (
    <View style={styles.root}>
      <Text>LOGIN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: wp("90%"),
  },
  backgroundImage: {
    position: "absolute",
    alignSelf: "center",
    resizeMode: "contain",
    height: hp("100%"),
  },
  button: {
    marginBottom: wp("5%"),
  },
});
