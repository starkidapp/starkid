import { Pressable, StyleSheet, View } from "react-native";
import { AppText, Avatar, StarBadge } from "@/components/ui";
import { colors, palette, radii, shadows, spacing } from "@/constants/theme";
import { capitalizeWords } from "../utils/textUtils";

interface KidAvatarProps {
  item: { avatar: string; name: string };
  selected?: boolean;
  /** Kid is (jointly) leading the current challenge. */
  crowned?: boolean;
  onPress?: () => void;
  challengeStars?: number;
  bonusCount?: number;
  penaltyCount?: number;
  /** Pastel card colour; a matching circle decorates the card's corner. */
  tint?: { main: string; soft: string };
}

export default function KidAvatar({
  item,
  selected,
  crowned = false,
  onPress,
  challengeStars = 0,
  bonusCount = 0,
  penaltyCount = 0,
  tint,
}: KidAvatarProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        tint && { backgroundColor: tint.soft },
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      {tint ? (
        <>
          <View pointerEvents="none" style={[styles.cornerCircle, { backgroundColor: tint.main }]} />
          <View pointerEvents="none" style={[styles.cornerRing, { borderColor: tint.main }]} />
        </>
      ) : null}
      <Avatar emoji={item.avatar} size="lg" selected={selected} crowned={crowned} style={styles.avatar} />

      <AppText variant="bodyStrong" align="center" numberOfLines={1} style={styles.name}>
        {capitalizeWords(item.name)}
      </AppText>

      <StarBadge count={challengeStars} size="sm" />

      {bonusCount > 0 || penaltyCount > 0 ? (
        <View style={styles.metaRow}>
          {bonusCount > 0 ? (
            <AppText variant="caption" color="textMuted">{`🎁 ${bonusCount}`}</AppText>
          ) : null}
          {penaltyCount > 0 ? (
            <AppText variant="caption" color="textMuted">{`⚠️ ${penaltyCount}`}</AppText>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    width: 124,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    ...shadows.sm,
  },
  selected: {
    backgroundColor: palette.accentSoft,
    borderColor: palette.accent,
  },
  cornerCircle: {
    position: "absolute",
    top: -26,
    right: -26,
    width: 64,
    height: 64,
    borderRadius: 32,
    opacity: 0.25,
  },
  cornerRing: {
    position: "absolute",
    bottom: -18,
    left: -18,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    opacity: 0.25,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  // Room for the leader's crown, kept on every card so they line up.
  avatar: { marginTop: spacing.lg },
  name: { maxWidth: 104 },
  metaRow: { flexDirection: "row", gap: spacing.sm },
});
