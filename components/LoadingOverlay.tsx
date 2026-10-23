import { useLoading } from "@/app/context/LoadingContext";
import { colors, radii, shadows } from "@/constants/theme";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoadingOverlay() {
  const { loading } = useLoading();

  if (!loading) return null;

  // A plain absolute overlay rather than a <Modal>: a Modal shown and hidden
  // quickly during a navigation (e.g. right after login) can stay attached on
  // iOS and leave the screen unresponsive until the app is restarted.
  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.overlay,
  },
  card: {
    width: 84,
    height: 84,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
  },
});
