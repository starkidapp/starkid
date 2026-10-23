import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText, IconButton } from "@/components/ui";
import { colors, radii, shadows, spacing } from "@/constants/theme";

interface ScreenHeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightButton?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
  /** Custom node for the right slot (takes precedence over `rightButton`). */
  right?: ReactNode;
  /** No fill or divider, so a decorative screen background shows through. */
  transparent?: boolean;
}

export default function ScreenHeader({
  title,
  onBackPress,
  showBackButton = true,
  rightButton,
  right,
  transparent = false,
}: ScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) onBackPress();
    else router.back();
  };

  return (
    <View
      style={[
        styles.header,
        transparent && styles.headerTransparent,
        { paddingTop: Math.max(insets.top, spacing.sm) + spacing.xs },
      ]}
    >
      <View style={styles.side}>
        {showBackButton ? (
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={10}
            style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
        ) : null}
      </View>

      <AppText variant="subtitle" align="center" numberOfLines={1} style={styles.title}>
        {title}
      </AppText>

      <View style={[styles.sideRight, right ? styles.sideRightWide : styles.side]}>
        {right ? (
          right
        ) : rightButton ? (
          <IconButton
            icon={rightButton.icon}
            onPress={rightButton.onPress}
            variant="surface"
            color={colors.primary}
            size={22}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTransparent: { backgroundColor: "transparent", borderBottomWidth: 0 },
  side: { width: 40, alignItems: "flex-start", justifyContent: "center" },
  sideRight: { alignItems: "flex-end", justifyContent: "center" },
  sideRightWide: { flexShrink: 0 },
  back: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  backPressed: { opacity: 0.6, transform: [{ scale: 0.92 }] },
  title: { flex: 1 },
});
