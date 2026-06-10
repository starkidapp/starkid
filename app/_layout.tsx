import * as Application from "expo-application";
import { Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { auth, db } from "../lib/firebase/config";
import { KidProvider } from "./context/KidContext";
import MandatoryUpdateScreen from "./screens/MandatoryUpdateScreen";
import { isVersionLower } from "./utils/versionUtils";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [storeLinks, setStoreLinks] = useState({
    appStoreUrl: "",
    playStoreUrl: "",
  });

  useEffect(() => {
    let unsubscribe: any;

    const startApp = async () => {
      try {
        const updateRequired = await checkAppVersion();

        if (updateRequired) {
          setLoading(false);
          return;
        }

        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          console.log("Auth user:", firebaseUser?.uid || null);
          setUser(firebaseUser);
          setLoading(false);
        });
      } catch (error) {
        console.log("Init error:", error);
        setLoading(false);
      }
    };

    startApp();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const checkAppVersion = async () => {
    try {
      const currentVersion = Application.nativeApplicationVersion || "1.0.0";

      const configRef = doc(db, "appConfig", "version");
      const configSnap = await getDoc(configRef);

      if (!configSnap.exists()) {
        return false;
      }

      const data: any = configSnap.data();

      setStoreLinks({
        appStoreUrl: data.appStoreUrl || "",
        playStoreUrl: data.playStoreUrl || "",
      });

      const shouldForceUpdate =
        data.mandatoryUpdate === true &&
        isVersionLower(currentVersion, data.minimumVersion || "1.0.0");
      console.log("Current App Version:", currentVersion);
      console.log("Firestore Config:", data);
      console.log("Should Force Update:", shouldForceUpdate);
      setForceUpdate(shouldForceUpdate);
      return shouldForceUpdate;
    } catch (error) {
      console.log("Version check error:", error);
      return false;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (forceUpdate) {
    return (
      <MandatoryUpdateScreen
        appStoreUrl={storeLinks.appStoreUrl}
        playStoreUrl={storeLinks.playStoreUrl}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <KidProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          {user ? (
            <>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="screens/ParentProfileScreen" />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </>
          ) : (
            <>
              <Stack.Screen name="screens/LoginScreen" />
              <Stack.Screen name="screens/RegisterScreen" />
            </>
          )}
        </Stack>
      </KidProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center" },
});
