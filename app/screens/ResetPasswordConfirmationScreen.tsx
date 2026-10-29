import { Button } from "@/components/ui";
import { auth } from "@/lib/firebase/config";
import { useLocalSearchParams, useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { Alert } from "react-native";
import AuthScreen from "../components/AuthScreen";
import { useToast } from "../context/ToastContext";
import { useLoading, useWithLoading } from "../context/LoadingContext";
import { friendlyErrorMessage } from "../utils/errorUtils";
import { t } from "@/lib/i18n";

export default function ResetPasswordConfirmationScreen() {
    const router = useRouter();
    const { email: rawEmail } = useLocalSearchParams();
    const email = typeof rawEmail === "string" ? rawEmail : Array.isArray(rawEmail) ? rawEmail[0] : "";
    const { loading } = useLoading();
    const withLoading = useWithLoading();
    const { showToast } = useToast();

    const resendEmail = async () => {
        if (!email) {
            Alert.alert(t("reset.missing_email"), t("reset.missing_email_msg"));
            return;
        }

        try {
            await withLoading(async () => {
                await sendPasswordResetEmail(auth, email);
            });

            showToast(t("reset.sent_again"));
        } catch (error: any) {
            console.error("Resend error:", error);
            Alert.alert(
                t("reset.send_failed"),
                friendlyErrorMessage(error, t("reset.wait_msg")),
            );
        }
    };

    return (
        <AuthScreen
            title={t("reset.check_email")}
            subtitle={t("reset.steps")}
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
            <Button
                title={t("reset.resend")}
                onPress={resendEmail}
                loading={loading}
                fullWidth
                playful
            />
        </AuthScreen>
    );
}
