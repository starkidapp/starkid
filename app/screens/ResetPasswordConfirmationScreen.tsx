import { auth } from "@/lib/firebase/config";
import { useLocalSearchParams, useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoading, useWithLoading } from "../context/LoadingContext";

export default function ResetPasswordConfirmationScreen() {
    const router = useRouter();
    const { email: rawEmail } = useLocalSearchParams();
    const email = typeof rawEmail === "string" ? rawEmail : Array.isArray(rawEmail) ? rawEmail[0] : "";
    const { loading } = useLoading();
    const withLoading = useWithLoading();

    const resendEmail = async () => {
        if (!email) {
            Alert.alert("Email missing", "Please return to the reset screen and enter your email.");
            return;
        }

        try {
            await withLoading(async () => {
                await sendPasswordResetEmail(auth, email);
            });

            Alert.alert(
                "Resent",
                "We sent the password reset link again. Check your inbox and spam folder.",
            );
        } catch (error: any) {
            console.error("Resend error:", error);
            Alert.alert(
                "Resend Failed",
                error?.message || "Unable to resend password reset email.",
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Check your email</Text>
                <Text style={styles.subtitle}>
                    We sent a password reset link to your email.
                    Open it and follow the instructions to reset your password.
                </Text>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={resendEmail}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? "Resending..." : "Resend email"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.replace("/screens/LoginScreen")}
                >
                    <Text style={styles.secondaryButtonText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#FFF8E7",
    },
    card: {
        backgroundColor: "#fff",
        padding: 28,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 22,
        elevation: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: "900",
        color: "#2D2A32",
        marginBottom: 16,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        lineHeight: 24,
        textAlign: "center",
        marginBottom: 28,
    },
    button: {
        backgroundColor: "#6C63FF",
        padding: 16,
        borderRadius: 18,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    secondaryButton: {
        marginTop: 16,
        padding: 16,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#6C63FF",
    },
    secondaryButtonText: {
        color: "#6C63FF",
        fontWeight: "900",
        textAlign: "center",
        fontSize: 17,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "900",
        textAlign: "center",
        fontSize: 17,
    },
});
