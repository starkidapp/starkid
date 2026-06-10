import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeaderboardItem from "../components/LeaderboardItem";
import ScreenHeader from "../components/ScreenHeader";
import { useKids } from "../context/KidContext";

export default function LeaderboardScreen() {
  const { kids, getMonthlyStars } = useKids();

  const data = kids
    .map((k) => ({ id: k.id, name: k.name, stars: getMonthlyStars(k.id) }))
    .sort((a, b) => b.stars - a.stars);

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader title="🏆 Leaderboard" />
      <View style={styles.content}>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <LeaderboardItem item={item} index={index} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7FBFF" },
  content: { flex: 1, padding: 20 },
});
