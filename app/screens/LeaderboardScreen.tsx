import React from "react";
import { FlatList, View } from "react-native";
import { EmptyState, PlayfulBackground, Screen } from "@/components/ui";
import { spacing } from "@/constants/theme";
import LeaderboardItem from "../components/LeaderboardItem";
import ScreenHeader from "../components/ScreenHeader";
import { useKids } from "../context/KidContext";
import { t } from "@/lib/i18n";

export default function LeaderboardScreen() {
  const { kids, getChallengeStars } = useKids();

  const sorted = kids
    .map((k) => ({ id: k.id, name: k.name, avatar: k.avatar, stars: getChallengeStars(k.id) }))
    .sort((a, b) => b.stars - a.stars);
  // Kids with the same stars share a rank (two kids tied on top are both 1st).
  const data = sorted.map((k) => ({
    ...k,
    rank: 1 + sorted.filter((other) => other.stars > k.stars).length,
  }));

  return (
    <View style={{ flex: 1 }}>
      <PlayfulBackground />
      <ScreenHeader title={t("leaderboard.title")} transparent />
      <Screen padded={false} topInset={false} background="transparent">
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.xl }}
          renderItem={({ item }) => <LeaderboardItem item={item} rank={item.rank} />}
          ListEmptyComponent={
            <EmptyState
              emoji="🏅"
              title={t("leaderboard.empty_title")}
              message={t("leaderboard.empty_msg")}
            />
          }
        />
      </Screen>
    </View>
  );
}
