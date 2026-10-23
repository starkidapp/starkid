import React from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Avatar, StarBadge } from "@/components/ui";
import { colors, palette, radii, shadows, spacing } from "@/constants/theme";
import { capitalizeWords } from "../utils/textUtils";

interface LeaderboardItemProps {
  item: { name: string; stars: number; avatar?: string };
  /** 1-based; tied kids share a rank. */
  rank: number;
}

const MEDALS = ["🥇", "🥈", "🥉"];
const PODIUM_TONE = [palette.star, "#C7CCD1", "#E8A87C"];

export default function LeaderboardItem({ item, rank }: LeaderboardItemProps) {
  const index = rank - 1;
  const isPodium = index < 3;
  const isLeader = rank === 1 && item.stars > 0;

  return (
    <View
      style={[
        styles.row,
        isPodium && { borderColor: PODIUM_TONE[index], borderWidth: 2 },
      ]}
    >
      <View style={styles.rankWrap}>
        {isPodium ? (
          <AppText style={styles.medal}>{MEDALS[index]}</AppText>
        ) : (
          <AppText variant="heading" color="textFaint">
            {rank}
          </AppText>
        )}
      </View>

      <Avatar emoji={item.avatar || "🧒"} size="sm" crowned={isLeader} />

      <AppText variant="subtitle" style={styles.name} numberOfLines={1}>
        {capitalizeWords(item.name)}
      </AppText>

      <StarBadge count={item.stars} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    padding: spacing.md,
    paddingTop: spacing.lg,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
    ...shadows.sm,
  },
  rankWrap: { width: 32, alignItems: "center" },
  medal: { fontSize: 24 },
  name: { flex: 1 },
});
