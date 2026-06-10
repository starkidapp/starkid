import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { capitalizeWords } from "../utils/textUtils";
interface LeaderboardItemProps {
  item: { name: string; stars: number };
  index: number;
}
export default function LeaderboardItem({ item, index }: LeaderboardItemProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <Text style={styles.name}>{capitalizeWords(item.name)}</Text>
      <Text style={styles.stars}>{item.stars} ⭐</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
  },
  rank: { fontWeight: "900", fontSize: 18 },
  name: { fontSize: 18, fontWeight: "700" },
  stars: { fontWeight: "900" },
});
