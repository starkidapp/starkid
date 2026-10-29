import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/nunito";
import * as Application from "expo-application";
import { Stack } from "expo-router";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as ScreenOrientation from "expo-screen-orientation";
import { Dimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoadingOverlay from "../components/LoadingOverlay";
import NoInternetBanner from "../components/NoInternetBanner";
import ThemeSplash, { hideNativeSplash } from "../components/ThemeSplash";
import { auth, db } from "../lib/firebase/config";
import { AppLocale, currentLocale, loadSavedLocale } from "../lib/i18n";
import { KidProvider } from "./context/KidContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ToastProvider } from "./context/ToastContext";
import { LocaleProvider } from "./context/LocaleContext";
import MandatoryUpdateScreen from "./screens/MandatoryUpdateScreen";
import { isVersionLower } from "./utils/versionUtils";

// Keep the native launch screen until ThemeSplash has drawn the full-screen
// theme (it hides it then), instead of Expo Router hiding it on its own schedule.
SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ fade: true, duration: 250 });

// Keep phones in portrait, but let tablets and foldables rotate freely. This is
// done at runtime (not via app.json "orientation") because Android 16 ignores
// manifest orientation locks on large screens and Play flags them.
const { width, height } = Dimensions.get("screen");
if (Math.min(width, height) < 600) {
  ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.PORTRAIT_UP,
  ).catch(() => {});
}

// Defined at module scope so it is not remounted on every RootLayout render
// (which re-ran the whole startup sequence and re-subscribed the auth listener).
function StartupManager({
  onDone,
  onUser,
  checkAppVersion,
}: {
  onDone: () => void;
  onUser: (user: User | null) => void;
  checkAppVersion: () => Promise<boolean>;
}) {
  useEffect(() => {
    let unsubscribe: any;

    const startApp = async () => {
      try {
        const updateRequired = await checkAppVersion();

        if (updateRequired) {
          onDone();
          return;
        }

        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (!firebaseUser) {
            onUser(null);
            onDone();
            return;
          }

          try {
            const parentRef = doc(db, "parents", firebaseUser.uid);
            const parentSnap = await getDoc(parentRef);
            const isVerifiedByFlag =
              parentSnap.exists() && parentSnap.data()?.emailVerified === true;
            const isVerifiedByAuth = firebaseUser.emailVerified === true;

            // if (!isVerifiedByFlag && !isVerifiedByAuth) {
            //   console.log("Auth user email not verified; signing out..");
            //   await signOut(auth);
            //   onUser(null);
            //   onDone();
            //   return;
            // }
            if (!isVerifiedByFlag && !isVerifiedByAuth) {
              if ((global as any).isRegistering) {
                console.log(
                  "Registration in progress, skipping unverified sign out",
                );
                onDone();
                return;
              }

              console.log("Auth user email not verified; signing out..");
              await signOut(auth);
              onUser(null);
              onDone();
              return;
            }

            if (isVerifiedByAuth && !isVerifiedByFlag) {
              await setDoc(parentRef, { emailVerified: true }, { merge: true });
            }
          } catch (error) {
            console.log("Verification check error:", error);
          }

          console.log("Auth user:", firebaseUser?.uid || null);
          onUser(firebaseUser);
          onDone();
        });
      } catch (error) {
        console.log("Init error:", error);
        onDone();
      }
    };

    startApp();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onDone, onUser, checkAppVersion]);

  return null;
}

export default function RootLayout() {
  const [initialized, setInitialized] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [locale, setLocale] = useState<AppLocale | null>(null);
  const localeReady = locale !== null;

  // Apply the saved language before any screen renders its strings.
  useEffect(() => {
    loadSavedLocale().finally(() => setLocale(currentLocale()));
  }, []);

  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const [storeLinks, setStoreLinks] = useState({
    appStoreUrl: "",
    playStoreUrl: "",
  });

  const checkAppVersion = useCallback(async () => {
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
  }, []);
  const finishStartup = useCallback(() => setInitialized(true), []);

  // Fallback in case the theme image never reports loading.
  useEffect(() => {
    if (initialized && fontsLoaded && localeReady) hideNativeSplash();
  }, [initialized, fontsLoaded, localeReady]);

  return (
    <SafeAreaProvider>
      <LocaleProvider locale={locale ?? currentLocale()}>
        <LoadingProvider>
          <ToastProvider>
            <KidProvider>
              {!initialized && (
                <StartupManager
                  onDone={finishStartup}
                  onUser={setUser}
                  checkAppVersion={checkAppVersion}
                />
              )}

              {!initialized || !fontsLoaded || !localeReady ? (
                // while StartupManager / fonts load, show the full-screen theme
                <ThemeSplash />
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
          </ToastProvider>
          <LoadingOverlay />
          <NoInternetBanner />
        </LoadingProvider>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
