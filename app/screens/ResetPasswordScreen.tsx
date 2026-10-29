import { Button, TextField } from "@/components/ui";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Alert } from "react-native";
import AuthScreen from "../components/AuthScreen";
import { useLoading, useWithLoading } from "../context/LoadingContext";
import { friendlyErrorMessage } from "../utils/errorUtils";
import { alertNetworkError, checkInternet, isNetworkError } from "../utils/netUtils";
import { t } from "@/lib/i18n";

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const { loading } = useLoading();
    const withLoading = useWithLoading();

    const resetPassword = async () => {
        if (!email) {
            Alert.alert(t("reset.type_email"), t("reset.type_email_msg"));
            return;
        }

        if (!(await checkInternet())) return;

        try {
            await withLoading(async () => {
                await sendPasswordResetEmail(auth, email.trim());
                router.replace({
                    pathname: "/screens/ResetPasswordConfirmationScreen",
                    params: { email: email.trim() },
                });
            });
        } catch (error: any) {
            console.error("Password reset error:", error);
            if (isNetworkError(error)) {
                alertNetworkError();
            } else if (error?.code === "auth/invalid-email") {
                Alert.alert(t("reset.invalid_email"), t("reset.invalid_email_msg"));
            } else if (error?.code === "auth/user-not-found") {
                Alert.alert(
                    t("reset.not_registered"),
                    t("reset.not_registered_msg"),
                    [
                        { text: t("reset.try_again"), style: "cancel" },
                        {
                            text: t("reset.register"),
                            onPress: () =>
                                router.replace({
                                    pathname: "/screens/RegisterScreen",
                                    params: { email: email.trim() },
                                }),
                        },
                    ]
                );
            } else {
                Alert.alert(
                    t("reset.send_failed"),
                    friendlyErrorMessage(error, t("reset.send_failed_msg"))
                );
            }
        }
    };

    return (
        <AuthScreen
            title={t("reset.title")}
            subtitle={t("reset.subtitle")}
            footer={
                <Button
                    title={t("reset.back_to_login")}
                    variant="ghost"
                    size="sm"
                    haptic={false}
                    onPress={() => router.replace("/screens/LoginScreen")}
                />
            }
        >
            <TextField
                label={t("reset.email")}
                placeholder="you@example.com"
                value={email}
                onChangeText={(t) => setEmail(t.replace(/\s/g, ""))}
                autoCapitalize="none"
                keyboardType="email-address"
                leftIcon="mail-outline"
                returnKeyType="go"
                onSubmitEditing={resetPassword}
            />

            <Button
                title={t("reset.send_link")}
                onPress={resetPassword}
                loading={loading}
                fullWidth
                playful
                style={{ marginTop: 4 }}
            />
        </AuthScreen>
    );
}
