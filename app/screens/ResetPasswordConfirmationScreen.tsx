import { Button } from "@/components/ui";
import { auth } from "@/lib/firebase/config";
import { useLocalSearchParams, useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { Alert } from "react-native";
import AuthScreen from "../components/AuthScreen";
import { useToast } from "../context/ToastContext";
import { useLoading, useWithLoading } from "../context/LoadingContext";
import { friendlyErrorMessage } from "../utils/errorUtils";

export default function ResetPasswordConfirmationScreen() {
    const router = useRouter();
    const { email: rawEmail } = useLocalSearchParams();
    const email = typeof rawEmail === "string" ? rawEmail : Array.isArray(rawEmail) ? rawEmail[0] : "";
    const { loading } = useLoading();
    const withLoading = useWithLoading();
    const { showToast } = useToast();

    const resendEmail = async () => {
        if (!email) {
            Alert.alert("Missing email", "Please go back and enter your email address.");
            return;
        }

        try {
            await withLoading(async () => {
                await sendPasswordResetEmail(auth, email);
            });

            showToast("✅ We sent the link again. Can't find it? Look in your Spam folder.");
        } catch (error: any) {
            console.error("Resend error:", error);
            Alert.alert(
                "Couldn't send the email",
                friendlyErrorMessage(error, "Please try again in a few minutes."),
            );
        }
    };

    return (
        <AuthScreen
            title="Check your email 📬"
            subtitle={"1. Open your email inbox.\n2. Tap the link in the email we sent you.\n3. Type your new password.\n4. Come back here and log in with the new password.\n\nCan't find the email? Look in your Spam folder."}
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
            <Button
                title="Resend email"
                onPress={resendEmail}
                loading={loading}
                fullWidth
                playful
            />
        </AuthScreen>
    );
}
