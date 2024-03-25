import { StyleSheet, View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useAuth } from "../contexts/AuthenticationContext";
import { useEffect } from "react";

export default function Loading({ navigation }) {
  const theme = useTheme();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigation.navigate("WoukieBox");
    } else {
      navigation.navigate("Login");
    }
  }, [loading, user]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.root}>
        <ActivityIndicator size="large" />
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
