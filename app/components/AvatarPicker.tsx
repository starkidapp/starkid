import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, palette, radii, spacing } from "@/constants/theme";
import { t } from "@/lib/i18n";

// Tap-to-choose avatars; parents can still type any emoji in the box below.
export const KID_AVATARS = [
  "🧒",
  "👦",
  "👧",
  "👶",
  "🧑",
  "👱",
  "🦁",
  "🐯",
  "🐼",
  "🐨",
  "🐰",
  "🦊",
  "🐶",
  "🐱",
  "🦄",
  "🐸",
  "🐵",
  "🐧",
  "🚀",
  "⚽",
  "🎨",
  "🦖",
  "🌟",
  "🌈",
];

export default function AvatarPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (avatar: string) => void;
}) {
  // Anything not in the grid was typed by the parent; show it in the box.
  const [custom, setCustom] = useState(
    KID_AVATARS.includes(value) ? "" : value,
  );

  return (
    <View>
      <View style={styles.grid}>
        {KID_AVATARS.map((emoji) => {
          const selected = emoji === value;
          return (
            <Pressable
              key={emoji}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                onChange(emoji);
              }}
              style={({ pressed }) => [
                styles.cell,
                selected && styles.cellSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.orLabel}>
        {t("avatar.or_type")}
      </Text>
      <TextInput
        value={custom}
        placeholder="😀"
        onChangeText={(text) => {
          // Keep it short — an emoji or two (emojis can be several characters).
          const trimmed = Array.from(text.trim()).slice(-8).join("");
          setCustom(trimmed);
          if (trimmed) onChange(trimmed);
        }}
        style={[
          styles.customInput,
          custom && custom === value ? styles.customSelected : null,
        ]}
        textAlign="center"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cell: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.inputBg,
    borderWidth: 2,
    borderColor: "transparent",
  },
  cellSelected: {
    borderColor: colors.primary,
    backgroundColor: palette.primarySoft,
  },
  pressed: { transform: [{ scale: 0.9 }] },
  emoji: { fontSize: 26 },
  orLabel: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  customInput: {
    alignSelf: "center",
    width: 120,
    fontSize: 28,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.inputBg,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: spacing.md,
    color: colors.text,
  },
  customSelected: {
    borderColor: colors.primary,
    backgroundColor: palette.primarySoft,
  },
});
