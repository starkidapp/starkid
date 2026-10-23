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

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const { loading } = useLoading();
    const withLoading = useWithLoading();

    const resetPassword = async () => {
        if (!email) {
            Alert.alert("Type your email", "Please type the email you used to register, then tap the button again.");
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
                Alert.alert("Invalid email", "Please enter a valid email address.");
            } else if (error?.code === "auth/user-not-found") {
                Alert.alert(
                    "You are not registered yet",
                    "This email does not have an account.\n\n1. Tap \"Register\" below.\n2. Make your account.\n3. Then log in.",
                    [
                        { text: "Try again", style: "cancel" },
                        {
                            text: "Register",
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
                    "Couldn't send the email",
                    friendlyErrorMessage(error, "We couldn't send the email. Please try again.")
                );
            }
        }
    };

    return (
        <AuthScreen
            title="Reset Password"
            subtitle="Enter the email for your account and we'll send you a reset link."
            footer={
                <Button
                    title="Back to login"
                    variant="ghost"
                    size="sm"
                    haptic={false}
                    onPress={() => router.replace("/screens/LoginScreen")}
                />
            }
        >
            <TextField
                label="Email"
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
                title="Send Reset Link"
                onPress={resetPassword}
                loading={loading}
                fullWidth
                playful
                style={{ marginTop: 4 }}
            />
        </AuthScreen>
    );
}
