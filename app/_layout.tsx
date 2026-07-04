import * as Application from "expo-application";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../lib/i18n";
import LoadingOverlay from "../components/LoadingOverlay";
import NoInternetBanner from "../components/NoInternetBanner";
import { auth, db } from "../lib/firebase/config";
import { KidProvider } from "./context/KidContext";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import { LocaleProvider } from "./context/LocaleContext";
import MandatoryUpdateScreen from "./screens/MandatoryUpdateScreen";
import { isVersionLower } from "./utils/versionUtils";

(Text as any).defaultProps = { ...(Text as any).defaultProps, style: { textTransform: 'capitalize', fontWeight: '400' } };

export default function RootLayout() {
  const [initialized, setInitialized] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [storeLinks, setStoreLinks] = useState({
    appStoreUrl: "",
    playStoreUrl: "",
  });
  const [splashReady, setSplashReady] = useState(false);

  function StartupManager({ onDone }: { onDone: () => void }) {
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
      let unsubscribe: any;

      const startApp = async () => {
        showLoading();
        try {
          const updateRequired = await checkAppVersion();

          if (updateRequired) {
            onDone();
            return;
          }

          unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log("Auth user:", firebaseUser?.uid || null);
            setUser(firebaseUser);
            onDone();
          });
        } catch (error) {
          console.log("Init error:", error);
          onDone();
        } finally {
          hideLoading();
        }
      };

      startApp();

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }, [onDone, showLoading, hideLoading]);

    return null;
  }

  useEffect(() => {
    const prepareSplash = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (error) {
        console.log("Splash prevent auto hide error:", error);
      } finally {
        setSplashReady(true);
      }
    };

    prepareSplash();
  }, []);

  useEffect(() => {
    if (initialized && splashReady) {
      const t: any = setTimeout(() => {
        SplashScreen.hideAsync().catch((error) => {
          console.log("Splash hide error:", error);
        });
      }, 2000); // keep splash visible for 2s after init

      return () => clearTimeout(t);
    }
  }, [initialized, splashReady]);

  // initialization is handled in StartupManager (runs inside LoadingProvider)

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

  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <LoadingProvider>
          <KidProvider>
            {!initialized && <StartupManager onDone={() => setInitialized(true)} />}

            {!initialized ? (
              // while StartupManager runs, the global LoadingOverlay is shown
              <View style={styles.loadingContainer} />
            ) : forceUpdate ? (
              <MandatoryUpdateScreen
                appStoreUrl={storeLinks.appStoreUrl}
                playStoreUrl={storeLinks.playStoreUrl}
              />
            ) : (
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                {user ? (
                  <>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="screens/ParentProfileScreen" />
                    <Stack.Screen name="screens/ContactSupportScreen" />
                    <Stack.Screen name="screens/FaqScreen" />
                    <Stack.Screen name="screens/TermsAndConditionsScreen" />
                    <Stack.Screen name="screens/LicensesScreen" />
                    <Stack.Screen name="screens/AboutUsScreen" />
                    <Stack.Screen name="screens/PrivacyPolicyScreen" />
                    <Stack.Screen name="modal" options={{ presentation: "modal" }} />
                  </>
                ) : (
                  <>
                    <Stack.Screen name="screens/LoginScreen" />
                    <Stack.Screen name="screens/RegisterScreen" />
                    <Stack.Screen name="screens/ResetPasswordScreen" />
                    <Stack.Screen name="screens/ResetPasswordConfirmationScreen" />
                  </>
                )}
              </Stack>
            )}
          </KidProvider>
          <LoadingOverlay />
          <NoInternetBanner />
        </LoadingProvider>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center" },
});
