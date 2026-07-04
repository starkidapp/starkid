import { auth, db } from "@/lib/firebase/config";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoading, useWithLoading } from "../context/LoadingContext";
import { alertNetworkError, checkInternet, isNetworkError } from "../utils/netUtils";

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const { loading } = useLoading();
    const withLoading = useWithLoading();

    const resetPassword = async () => {
        if (!email) {
            Alert.alert("Required", "Please enter your email address.");
            return;
        }

        if (!(await checkInternet())) return;

        try {
            await withLoading(async () => {
                const snap = await getDocs(
                    query(collection(db, "parents"), where("email", "==", email.trim()))
                );

                if (snap.empty) {
                    Alert.alert("Not Found", "No account found with this email address.");
                    return;
                }

                await sendPasswordResetEmail(auth, email.trim());
                router.replace("/screens/ResetPasswordConfirmationScreen");
            });
        } catch (error: any) {
            console.error("Password reset error:", error);
            if (isNetworkError(error)) {
                alertNetworkError();
            } else {
                Alert.alert("Reset Failed", error?.message || "Unable to send password reset email.");
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
                Enter the email address for your account, and we will send you a reset
                link.
            </Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(t) => setEmail(t.replace(/\s/g, ''))}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={resetPassword}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? "Sending..." : "Send Reset Link"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/screens/LoginScreen")}>
                <Text style={styles.link}>Back to login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#FFF8E7",
    },
    title: {
        fontSize: 30,
        fontWeight: "900",
        textAlign: "center",
        color: "#2D2A32",
        marginBottom: 12,
    },
    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: 24,
        fontSize: 15,
    },
    input: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 18,
        marginBottom: 14,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#6C63FF",
        padding: 17,
        borderRadius: 20,
        marginTop: 6,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "900",
        fontSize: 17,
        textAlign: "center",
    },
    link: {
        textAlign: "center",
        marginTop: 18,
        color: "#6C63FF",
        fontWeight: "800",
    },
});
