import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/components/ui";
import { colors, radii, shadows, spacing } from "@/constants/theme";
import { useLocale } from "../context/LocaleContext";

/** Pill button that flips the app between English and Arabic. */
export default function LanguageSwitcher({ style }: { style?: ViewStyle }) {
  const { locale, setLocale, t } = useLocale();
  const next = locale === "ar" ? "en" : "ar";
  // Label shows the language you will switch to, written in that language.
  const label = next === "ar" ? t("parentProfile_extra.arabic") : t("parentProfile_extra.english");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t("parentProfile_extra.language")}
      hitSlop={8}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        setLocale(next);
      }}
      style={({ pressed }) => [styles.pill, pressed && styles.pressed, style]}
    >
      <Ionicons name="language" size={18} color={colors.primary} />
      <AppText variant="bodyStrong" color={colors.primary}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    ...shadows.sm,
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
});
