// src/screens/MandatoryUpdateScreen.tsx

import React from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";

type Props = {
  appStoreUrl: string;
  playStoreUrl: string;
};

export default function MandatoryUpdateScreen({
  appStoreUrl,
  playStoreUrl,
}: Props) {
  const openStore = () => {
    const url = Platform.OS === "ios" ? appStoreUrl : playStoreUrl;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Update Required" />
      <Text style={styles.icon}>🚀</Text>

      <Text style={styles.title}>Update Required</Text>

      <Text style={styles.message}>
        A new version of Star Kids is available. Please update the app to
        continue using it.
      </Text>

      <TouchableOpacity style={styles.button} onPress={openStore}>
        <Text style={styles.buttonText}>Update Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#2D2A32",
    marginBottom: 12,
  },
  message: {
    fontSize: 17,
    color: "#555",
    textAlign: "center",
    lineHeight: 25,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 22,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});
