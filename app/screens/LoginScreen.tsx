// app/screens/LoginScreen.tsx

import { auth, db } from "@/lib/firebase/config";
import { t } from "@/lib/i18n";
import { Button, TextField } from "@/components/ui";
import { useRouter } from "expo-router";
import { onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import AuthScreen from "../components/AuthScreen";
import { useLoading } from "../context/LoadingContext";
import { friendlyErrorMessage } from "../utils/errorUtils";
import { alertNetworkError, checkInternet, isNetworkError } from "../utils/netUtils";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const navigatedRef = useRef(false);

  // Both loginParent and the auth listener below reach this after a successful
  // sign-in; navigating twice leaves the home screen stuck until the app restarts.
  const goHome = useCallback(() => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    router.replace("/(tabs)");
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;

      try {
        const parentRef = doc(db, "parents", firebaseUser.uid);
        const parentSnap = await getDoc(parentRef);
        const isVerifiedByFlag = parentSnap.exists() && parentSnap.data()?.emailVerified === true;
        const isVerifiedByAuth = firebaseUser.emailVerified === true;

        // if (!isVerifiedByFlag && !isVerifiedByAuth) {
        //   await signOut(auth);
        //   return;
        // }
        if (!isVerifiedByFlag && !isVerifiedByAuth) {
          console.log("Auth user email not verified; signing out!!");

          await signOut(auth);
          return;
        }

        if (isVerifiedByAuth && !isVerifiedByFlag) {
          await setDoc(parentRef, { emailVerified: true }, { merge: true });
        }

        goHome();
      } catch (error) {
        console.error("Auth state check error:", error);
      } finally {
        hideLoading();
      }
    });
    return unsubscribe;
  }, [goHome, hideLoading]);

  const loginParent = async () => {
    if (!email || !password) {
      Alert.alert(t("login.missing_title"), t("login.missing_msg"));
      return;
    }

    if (!(await checkInternet())) return;

    setSubmitting(true);
    showLoading();
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      const parentRef = doc(db, "parents", result.user.uid);
      const parentSnap = await getDoc(parentRef);
      const isVerifiedByFlag = parentSnap.exists() && parentSnap.data()?.emailVerified === true;
      const isVerifiedByAuth = result.user.emailVerified === true;

      if (!isVerifiedByFlag && !isVerifiedByAuth) {
        const unverifiedUser = result.user;
        await signOut(auth);
        Alert.alert(
          t("login.confirm_email_title"),
          t("login.confirm_email_msg"),
          [
            {
              text: t("login.send_again"),
              onPress: async () => {
                showLoading();
                try {
                  await sendEmailVerification(unverifiedUser);
                  Alert.alert(
                    t("login.email_sent_title"),
                    t("login.email_sent_msg", { email: email.trim() })
                  );
                } catch (resendError: any) {
                  if (isNetworkError(resendError)) {
                    alertNetworkError();
                  } else if (resendError?.code === "auth/too-many-requests") {
                    Alert.alert(
                      t("login.wait_title"),
                      t("login.resend_wait_msg")
                    );
                  } else {
                    Alert.alert(
                      t("login.send_failed_title"),
                      friendlyErrorMessage(resendError, t("login.send_failed_msg"))
                    );
                  }
                } finally {
                  hideLoading();
                }
              },
            },
            { text: t("login.ok"), style: "cancel" },
          ],
          { cancelable: false }
        );
        return;
      }

      if (isVerifiedByAuth && !isVerifiedByFlag) {
        await setDoc(parentRef, { emailVerified: true }, { merge: true });
      }

      goHome();
    } catch (error: any) {
      console.error("Login error:", error);
      if (isNetworkError(error)) {
        alertNetworkError();
      } else if (error?.code === "auth/user-not-found") {
        Alert.alert(
          t("login.not_found_title"),
          t("login.not_found_msg")
        );
      } else if (
        error?.code === "auth/wrong-password" ||
        error?.code === "auth/invalid-credential"
      ) {
        Alert.alert(
          t("login.wrong_title"),
          t("login.wrong_msg")
        );
      } else if (error?.code === "auth/invalid-email") {
        Alert.alert(t("login.invalid_email_title"), t("login.invalid_email_msg"));
      } else if (error?.code === "auth/too-many-requests") {
        Alert.alert(
          t("login.wait_title"),
          t("login.too_many_msg")
        );
      } else {
        Alert.alert(
          t("login.login_failed_title"),
          friendlyErrorMessage(error, t("login.login_failed_msg"))
        );
      }
    } finally {
      setSubmitting(false);
      hideLoading();
    }
  };

  return (
    <AuthScreen
      title={t("login.title")}
      subtitle={t("login.subtitle")}
      footer={
        <>
          <Button
            title={t("login.forgot_password")}
            variant="ghost"
            size="sm"
            haptic={false}
            onPress={() => router.push("/screens/ResetPasswordScreen")}
          />
          <Button
            title={t("login.register_link")}
            variant="subtle"
            size="sm"
            fullWidth
            haptic={false}
            onPress={() => router.replace("/screens/RegisterScreen")}
          />
        </>
      }
    >
      <TextField
        label={t("login.email")}
        placeholder={t("login.email_placeholder")}
        value={email}
        onChangeText={(v) => setEmail(v.replace(/\s/g, ""))}
        autoCapitalize="none"
        keyboardType="email-address"
        leftIcon="mail-outline"
        returnKeyType="next"
      />

      <TextField
        label={t("login.password")}
        placeholder={t("login.password_placeholder")}
        value={password}
        onChangeText={(v) => setPassword(v.replace(/\s/g, ""))}
        secureToggle
        leftIcon="lock-closed-outline"
        returnKeyType="go"
        onSubmitEditing={loginParent}
      />

      <Button
        title={t("login.login")}
        onPress={loginParent}
        loading={submitting}
        fullWidth
        playful
        style={{ marginTop: 4 }}
      />
    </AuthScreen>
  );
}
