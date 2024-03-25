import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function Profile({ navigation }) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.root}>
        <Text variant="titleLarge">Profile Paeg!!1!!1!!!</Text>
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
});
