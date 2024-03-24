import React, { createContext, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const SpinnerContext = createContext();

export const SpinnerProvider = ({ children }) => {
  const [showSpinner, setShowSpinner] = useState(false);

  return (
    <SpinnerContext.Provider value={{ setShowSpinner }}>
      {children}
      {showSpinner && <ActivityIndicator style={styles.spinner} />}
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
  spinner: {
    color: "#FFF",
  },
});
