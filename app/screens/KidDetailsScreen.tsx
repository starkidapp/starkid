import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { useKids } from "../context/KidContext";
import { capitalizeWords } from "../utils/textUtils";

export default function KidDetailsScreen() {
  const { kidId } = useLocalSearchParams();
  const { kids, completions, tasks, getKidStars } = useKids();
  const kid = kids.find((k) => k.id === kidId);

  const kidCompletions = useMemo(
    () => completions.filter((c) => c.kidId === kidId),
    [completions, kidId],
  );

  const allBonuses = useMemo(
    () => kidCompletions.filter((c) => c.isBonus),
    [kidCompletions],
  );

  const allPenalties = useMemo(
    () => kidCompletions.filter((c) => c.isPenalty),
    [kidCompletions],
  );

  const monthlyStars = useMemo(() => {
    const months: { [key: string]: number } = {};
    kidCompletions.forEach((c) => {
      const monthKey = c.date.slice(0, 7); // YYYY-MM
      months[monthKey] = (months[monthKey] || 0) + (c.stars || 0);
    });
    return months;
  }, [kidCompletions]);

  const allKidsMonthlyStars = useMemo(() => {
    const result: {
      [kidId: string]: { [monthKey: string]: number };
    } = {};

    kids.forEach((k) => {
      result[k.id] = {};
      const kCompletions = completions.filter((c) => c.kidId === k.id);
      kCompletions.forEach((c) => {
        const monthKey = c.date.slice(0, 7);
        result[k.id][monthKey] = (result[k.id][monthKey] || 0) + (c.stars || 0);
      });
    });

    return result;
  }, [kids, completions]);

  const getCurrentMonthKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  const getPreviousMonthKey = () => {
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    return `${prevMonth.getFullYear()}-${String(
      prevMonth.getMonth() + 1,
    ).padStart(2, "0")}`;
  };

  const getPreviousMonthRanking = () => {
    const prevMonthKey = getPreviousMonthKey();
    const rankings = kids
      .map((k) => ({
        kid: k,
        stars: allKidsMonthlyStars[k.id]?.[prevMonthKey] || 0,
      }))
      .sort((a, b) => b.stars - a.stars);
    return rankings;
  };

  const currentMonthKey = getCurrentMonthKey();
  const prevMonthRanking = getPreviousMonthRanking();

  if (!kid) {
    return (
      <SafeAreaView style={styles.screen}>
        <ScreenHeader title="Kid Details" showBackButton />
        <View style={styles.centeredBox}>
          <Text>Kid not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader title="Kid Details" showBackButton />
      <ScrollView style={styles.container}>
        {/* Kid Info Header */}
        <View style={styles.headerCard}>
          <Text style={styles.avatar}>{kid.avatar}</Text>
          <Text style={styles.kidName}>{capitalizeWords(kid.name)}</Text>
          <Text style={styles.totalStars}>
            Total Stars: {getKidStars(kidId as string)}
          </Text>
        </View>

        {/* This Month Stats */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Stars Earned:</Text>
            <Text style={styles.statValue}>
              {monthlyStars[currentMonthKey] || 0} ⭐
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Completions:</Text>
            <Text style={styles.statValue}>
              {
                kidCompletions.filter(
                  (c) =>
                    c.date.slice(0, 7) === currentMonthKey &&
                    !c.isBonus &&
                    !c.isPenalty,
                ).length
              }
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Bonuses:</Text>
            <Text style={styles.statValue}>
              {
                allBonuses.filter((b) => b.date.slice(0, 7) === currentMonthKey)
                  .length
              }
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Penalties:</Text>
            <Text style={styles.statValue}>
              {
                allPenalties.filter(
                  (p) => p.date.slice(0, 7) === currentMonthKey,
                ).length
              }
            </Text>
          </View>
        </View>

        {/* Previous Month Ranking */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Previous Month Ranking</Text>
          {prevMonthRanking.length === 0 ? (
            <Text style={styles.mutedText}>
              No data available
            </Text>
          ) : (
            <FlatList
              data={prevMonthRanking}
              keyExtractor={(item) => item.kid.id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.rankingRow,
                    item.kid.id === kidId && styles.highlightedRanking,
                  ]}
                >
                  <Text style={styles.rankingPosition}>#{index + 1}</Text>
                  <Text style={styles.rankingName}>
                    {capitalizeWords(item.kid.name)}
                  </Text>
                  <Text style={styles.rankingStars}>{item.stars} ⭐</Text>
                </View>
              )}
            />
          )}
        </View>

        {/* All Completions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>All Completions History</Text>
          {kidCompletions.length === 0 ? (
            <Text style={styles.mutedText}>
              No completions yet
            </Text>
          ) : (
            <FlatList
              data={kidCompletions.filter((c) => !c.isBonus && !c.isPenalty)}
              keyExtractor={(item, idx) => `${item.id}-${idx}`}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const task = tasks.find((t) => t.id === item.taskId);
                const subtask = task?.subtasks.find(
                  (s) => s.id === item.subtaskId,
                );
                return (
                  <View style={styles.historyItem}>
                    <View style={styles.flex1}>
                      <Text style={styles.historyTask}>{task?.title}</Text>
                      <Text style={styles.historySubtask}>
                        {subtask?.title}
                      </Text>
                      <Text style={styles.historyDate}>{item.date}</Text>
                    </View>
                    <Text style={styles.historyStars}>
                      {item.stars || 0} ⭐
                    </Text>
                  </View>
                );
              }}
            />
          )}
        </View>

        {/* All Bonuses */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>All Bonuses</Text>
          {allBonuses.length === 0 ? (
            <Text style={styles.mutedText}>No bonuses yet</Text>
          ) : (
            <FlatList
              data={allBonuses}
              keyExtractor={(item, idx) => `bonus-${item.id}-${idx}`}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={[styles.historyItem, styles.bonusItem]}>
                  <View style={styles.flex1}>
                    <Text style={styles.historyTask}>🎉 Bonus</Text>
                    <Text style={styles.historyReason}>
                      {item.reason || "No reason"}
                    </Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </View>
                  <Text style={styles.bonusStars}>+{item.stars || 0} ⭐</Text>
                </View>
              )}
            />
          )}
        </View>

        {/* All Penalties */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>All Penalties</Text>
          {allPenalties.length === 0 ? (
            <Text style={styles.mutedText}>No penalties yet</Text>
          ) : (
            <FlatList
              data={allPenalties}
              keyExtractor={(item, idx) => `penalty-${item.id}-${idx}`}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={[styles.historyItem, styles.penaltyItem]}>
                  <View style={styles.flex1}>
                    <Text style={styles.historyTask}>⚠️ Penalty</Text>
                    <Text style={styles.historyReason}>
                      {item.reason || "No reason"}
                    </Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </View>
                  <Text style={styles.penaltyStars}>-{item.stars || 0} ⭐</Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  avatar: {
    fontSize: 56,
    marginBottom: 12,
  },
  kidName: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  totalStars: {
    fontSize: 18,
    fontWeight: "800",
    color: "#6C63FF",
  },
  sectionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    color: "#2D2A32",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2D2A32",
  },
  rankingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  highlightedRanking: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginVertical: 4,
  },
  rankingPosition: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6C63FF",
    width: 40,
  },
  rankingName: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    marginLeft: 12,
  },
  rankingStars: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFD700",
  },
  historyItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  historyTask: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2D2A32",
  },
  historySubtask: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  historyReason: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  historyDate: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  historyStars: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFD700",
    marginLeft: 12,
  },
  bonusItem: {
    backgroundColor: "#f0ffe7",
  },
  bonusStars: {
    fontSize: 16,
    fontWeight: "800",
    color: "#28a745",
    marginLeft: 12,
  },
  penaltyItem: {
    backgroundColor: "#ffe7e7",
  },
  penaltyStars: {
    fontSize: 16,
    fontWeight: "800",
    color: "#dc3545",
    marginLeft: 12,
  },
  screen: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
  centeredBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mutedText: {
    color: "#666",
    padding: 12,
  },
  flex1: {
    flex: 1,
  },
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowAlignCenterFlex1: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  historyBody: {
    marginLeft: 12,
    flex: 1,
  },
  linkText: {
    color: "#6C63FF",
    fontWeight: "700",
  },
});
