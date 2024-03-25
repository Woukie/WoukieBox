import React, { createContext, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const SpinnerContext = createContext();

export const SpinnerProvider = ({ children }) => {
  const [showSpinner, setShowSpinner] = useState(false);

  return (
    <SpinnerContext.Provider value={{ setShowSpinner }}>
      {children}
      {showSpinner && (
        <View style={styles.wrapper}>
          <ActivityIndicator size={"large"} style={styles.spinner} />
        </View>
      )}
    </SpinnerContext.Provider>
  );
};

export const useSpinner = () => {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error("useSpinner must be used within a SpinnerProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    flex: 1,
  },
  spinner: {},
});
