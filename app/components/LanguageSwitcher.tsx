import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { AppText } from "@/components/ui";
import { AppLocale } from "@/lib/i18n";
import { colors, palette, radii, shadows, spacing } from "@/constants/theme";
import { useLocale } from "../context/LocaleContext";

// Each language is written in its own script so anyone can find theirs.
const OPTIONS: { locale: AppLocale; label: string }[] = [
  { locale: "en", label: "English" },
  { locale: "ar", label: "العربية" },
];

/** Two-option toggle (English | العربية) with the current language highlighted. */
export default function LanguageSwitcher({ style }: { style?: ViewStyle }) {
  const { locale, setLocale } = useLocale();

  return (
    <View style={[styles.track, style]} accessibilityRole="radiogroup">
      {OPTIONS.map((option) => {
        const selected = option.locale === locale;
        return (
          <Pressable
            key={option.locale}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            hitSlop={6}
            onPress={() => {
              if (selected) return;
              Haptics.selectionAsync().catch(() => {});
              setLocale(option.locale);
            }}
            style={({ pressed }) => [
              styles.option,
              selected && styles.optionSelected,
              pressed && !selected && styles.pressed,
            ]}
          >
            <AppText
              variant="bodyStrong"
              color={selected ? colors.onPrimary : colors.textMuted}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    // Keep "English | العربية" in the same order in Arabic (RTL) mode too.
    direction: "ltr",
    flexDirection: "row",
    padding: 3,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: palette.primarySoft,
    ...shadows.sm,
  },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  optionSelected: { backgroundColor: colors.primary },
  pressed: { opacity: 0.6 },
});
