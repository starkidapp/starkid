// app/screens/RegisterScreen.tsx

import { Button, TextField } from "@/components/ui";
import { auth, db } from "@/lib/firebase/config";
import { t } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert } from "react-native";
import AuthScreen from "../components/AuthScreen";
import { useLoading } from "../context/LoadingContext";
import { friendlyErrorMessage } from "../utils/errorUtils";
import { alertNetworkError, checkInternet, isNetworkError } from "../utils/netUtils";

export default function RegisterScreen() {
  const router = useRouter();
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showLoading, hideLoading } = useLoading();

  const registerParent = async () => {
    if (submitting) return;

    const trimmedEmail = email.trim();
    const trimmedName = parentName.trim();

    if (!trimmedName) {
      Alert.alert(t("register.missing_name_title"), t("register.missing_name_msg"));
      return;
    }

    if (!trimmedEmail) {
      Alert.alert(t("register.missing_email_title"), t("register.missing_email_msg"));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert(t("register.invalid_email_title"), t("register.invalid_email_msg"));
      return;
    }

    if (!password) {
      Alert.alert(t("register.missing_password_title"), t("register.missing_password_msg"));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t("register.mismatch_title"), t("register.mismatch_msg"));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t("register.too_short_title"), t("register.too_short_msg"));
      return;
    }

    if (!(await checkInternet())) return;

    setSubmitting(true);
    showLoading();
    try {
      (global as any).isRegistering = true;

      const result = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password.trim()
      );
      console.log("✅✅✅✅✅", result);
      await setDoc(doc(db, "parents", result.user.uid), {
        parentId: result.user.uid,
        parentName: trimmedName,
        email: trimmedEmail,
        emailVerified: false,
        createdAt: new Date(),
      });

      await sendEmailVerification(result.user);

      await signOut(auth);
      (global as any).isRegistering = false;

      Alert.alert(
        t("register.created_title"),
        t("register.created_msg", { email: trimmedEmail }),
        [
          {
            text: t("register.ok"),
            onPress: () => router.replace("/screens/LoginScreen"),
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      (global as any).isRegistering = false;

      console.log("Registration error:", error);
      if (error?.code === "auth/email-already-in-use") {
        Alert.alert(
          t("register.exists_title"),
          t("register.exists_msg"),
          [
            { text: t("register.cancel"), style: "cancel" },
            {
              text: t("register.log_in"),
              onPress: () => router.replace("/screens/LoginScreen"),
            },
          ]
        );
        return;
      }

      if (isNetworkError(error)) {
        alertNetworkError();
        return;
      }

      Alert.alert(
        t("register.registration_failed"),
        friendlyErrorMessage(error, t("register.registration_failed_msg"))
      );
    } finally {
      hideLoading();
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen
      title={t("register.title")}
      subtitle={t("register.subtitle")}
      footer={
        <Button
          title={t("register.already_registered")}
          variant="subtle"
          size="sm"
          fullWidth
          haptic={false}
          onPress={() => router.replace("/screens/LoginScreen")}
        />
      }
    >
      <TextField
        label={t("register.parent_name")}
        placeholder={t("register.parent_name_placeholder")}
        value={parentName}
        onChangeText={setParentName}
        leftIcon="person-outline"
        returnKeyType="next"
      />

      <TextField
        label={t("register.email")}
        placeholder={t("register.email_placeholder")}
        value={email}
        onChangeText={(v) => setEmail(v.replace(/\s/g, ""))}
        autoCapitalize="none"
        keyboardType="email-address"
        leftIcon="mail-outline"
        returnKeyType="next"
      />

      <TextField
        label={t("register.password")}
        placeholder={t("register.password_placeholder")}
        value={password}
        onChangeText={(v) => setPassword(v.replace(/\s/g, ""))}
        secureToggle
        leftIcon="lock-closed-outline"
        helper={t("register.password_helper")}
        returnKeyType="next"
      />

      <TextField
        label={t("register.confirm_password")}
        placeholder={t("register.confirm_password_placeholder")}
        value={confirmPassword}
        onChangeText={(v) => setConfirmPassword(v.replace(/\s/g, ""))}
        secureToggle
        leftIcon="lock-closed-outline"
        returnKeyType="go"
        onSubmitEditing={registerParent}
        error={
          confirmPassword.length > 0 && confirmPassword !== password
            ? t("register.passwords_no_match")
            : undefined
        }
      />

      <Button
        title={t("register.register")}
        onPress={registerParent}
        loading={submitting}
        fullWidth
        playful
        style={{ marginTop: 4 }}
      />
    </AuthScreen>
  );
}
