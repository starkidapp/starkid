import { useLoading } from "@/app/context/LoadingContext";
import { Colors } from "@/constants/theme";
import { ActivityIndicator, Modal, StyleSheet, useColorScheme, View } from "react-native";

export default function LoadingOverlay() {
    const { loading } = useLoading();
    const scheme = useColorScheme() || "light";
    const color = Colors[scheme].tint;

    if (!loading) return null;

    return (
        <Modal transparent animationType="fade" visible={loading}>
            <View style={styles.backdrop} pointerEvents="auto">
                <ActivityIndicator size="large" color={color} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.25)",
    },
});
