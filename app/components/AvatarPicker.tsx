import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, palette, radii, spacing } from "@/constants/theme";

// Tap-to-choose avatars, so parents never have to find the emoji keyboard.
export const KID_AVATARS = [
  "🧒", "👦", "👧", "👶", "🧑", "👱",
  "🦁", "🐯", "🐼", "🐨", "🐰", "🦊",
  "🐶", "🐱", "🦄", "🐸", "🐵", "🐧",
  "🚀", "⚽", "🎨", "🦖", "🌟", "🌈",
];

export default function AvatarPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (avatar: string) => void;
}) {
  return (
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
  cellSelected: { borderColor: colors.primary, backgroundColor: palette.primarySoft },
  pressed: { transform: [{ scale: 0.9 }] },
  emoji: { fontSize: 26 },
});
