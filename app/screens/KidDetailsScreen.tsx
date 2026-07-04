import { t } from "@/lib/i18n";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { useKids } from "../context/KidContext";
import { capitalizeWords } from "../utils/textUtils";

export default function KidDetailsScreen() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editStars, setEditStars] = useState("");
  const [editReason, setEditReason] = useState("");
  const { kidId } = useLocalSearchParams();
  const { kids, completions, tasks, getKidStars, removeCompletion, updateCompletion } = useKids();
  const kid = kids.find((k) => k.id === kidId);

  const kidCompletions = useMemo(
    () => completions.filter((c) => c.kidId === kidId),
    [completions, kidId],
  );
  function openEditReward(item: any) {
    setEditingItem(item);
    setEditStars(String(item.stars || 1));
    setEditReason(item.reason || "");
    setEditModalVisible(true);
  }

  async function handleUpdateReward() {
    if (!editingItem) return;

    const stars = Number(editStars) || 1;

    await updateCompletion(editingItem.id, {
      stars,
      reason: editReason.trim(),
    });

    setEditModalVisible(false);
    setEditingItem(null);
    setEditStars("");
    setEditReason("");
  }

  const allBonuses = useMemo(
    () => kidCompletions.filter((c) => c.isBonus),
    [kidCompletions],
  );

  const allPenalties = useMemo(
    () => kidCompletions.filter((c) => c.isPenalty),
    [kidCompletions],
  );

  const activityByDate = useMemo(() => {
    const sorted = [...kidCompletions].sort((a, b) => b.date.localeCompare(a.date));
    const map = new Map<string, typeof kidCompletions>();
    sorted.forEach((c) => {
      const list = map.get(c.date) || [];
      list.push(c);
      map.set(c.date, list);
    });
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    return Array.from(map.entries()).map(([date, items]) => {
      let label: string;
      if (date === today) label = 'Today';
      else if (date === yesterday) label = 'Yesterday';
      else label = new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
      return { date, label, items };
    });
  }, [kidCompletions]);

  // const monthlyStars = useMemo(() => {
  //   const months: { [key: string]: number } = {};
  //   kidCompletions.forEach((c) => {
  //     const monthKey = c.date.slice(0, 7); // YYYY-MM
  //     months[monthKey] = (months[monthKey] || 0) + (c.stars || 0);
  //   });
  //   return months;
  // }, [kidCompletions]);
  const monthlyStars = useMemo(() => {
    const months: { [key: string]: number } = {};

    kidCompletions.forEach((c) => {
      const monthKey = c.date.slice(0, 7);

      let stars = c.stars || 0;

      if (!c.isBonus && !c.isPenalty) {
        const task = tasks.find((t) => t.id === c.taskId);
        const subtask = task?.subtasks.find((s) => s.id === c.subtaskId);
        stars = subtask?.stars || 0;
      }

      months[monthKey] = (months[monthKey] || 0) + stars;
    });

    return months;
  }, [kidCompletions, tasks]);



  const allKidsMonthlyStars = useMemo(() => {
    const result: {
      [kidId: string]: { [monthKey: string]: number };
    } = {};

    kids.forEach((k) => {
      result[k.id] = {};

      const kCompletions = completions.filter((c) => c.kidId === k.id);

      kCompletions.forEach((c) => {
        const monthKey = c.date.slice(0, 7);

        let stars = c.stars || 0;

        if (!c.isBonus && !c.isPenalty) {
          const task = tasks.find((t) => t.id === c.taskId);
          const subtask = task?.subtasks.find((s) => s.id === c.subtaskId);
          stars = subtask?.stars || 0;
        }

        result[k.id][monthKey] = (result[k.id][monthKey] || 0) + stars;
      });
    });

    return result;
  }, [kids, completions, tasks]);

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

  // const getPreviousMonthRanking = () => {
  //   const prevMonthKey = getPreviousMonthKey();
  //   const rankings = kids
  //     .map((k) => ({
  //       kid: k,
  //       stars: allKidsMonthlyStars[k.id]?.[prevMonthKey] || 0,
  //     }))
  //     .sort((a, b) => b.stars - a.stars);
  //   return rankings;
  // };


  if (!kid) {
    return (
      <SafeAreaView style={styles.screen}>
        <ScreenHeader tKey="kidDetails.title" showBackButton />
        <View style={styles.centeredBox}>
          <Text>{t('kidDetails.not_found')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getLatestPreviousMonthWithData = () => {
    const currentMonth = getCurrentMonthKey();

    const monthKeys = Object.values(allKidsMonthlyStars)
      .flatMap((kidMonths) => Object.keys(kidMonths))
      .filter((monthKey) => monthKey < currentMonth)
      .sort()
      .reverse();

    return monthKeys[0] || null;
  };

  const getPreviousMonthRanking = () => {
    const prevMonthKey = getLatestPreviousMonthWithData();

    if (!prevMonthKey) {
      return [];
    }

    return kids
      .map((k) => ({
        kid: k,
        stars: allKidsMonthlyStars[k.id]?.[prevMonthKey] || 0,
        monthKey: prevMonthKey,
      }))
      .sort((a, b) => b.stars - a.stars);
  };

  const currentMonthKey = getCurrentMonthKey();
  const prevMonthRanking = getPreviousMonthRanking();

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader tKey="kidDetails.title" showBackButton />
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

        {/* Activity Timeline */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Activity Timeline</Text>
          {activityByDate.length === 0 ? (
            <Text style={styles.mutedText}>No activity yet</Text>
          ) : (
            activityByDate.map(({ date, label, items }) => (
              <View key={date} style={styles.dateGroup}>
                <View style={styles.dateHeader}>
                  <Text style={styles.dateLabel}>{label}</Text>
                  <View style={styles.dateLine} />
                  <View style={styles.dateCountBadge}>
                    <Text style={styles.dateCountText}>{items.length}</Text>
                  </View>
                </View>

                {items.map((item) => {
                  if (item.isBonus) {
                    return (
                      <View key={item.id} style={[styles.activityItem, styles.bonusActivity]}>
                        <View style={[styles.activityIconBg, { backgroundColor: '#E3FBF3' }]}>
                          <Text style={styles.activityIconText}>🎁</Text>
                        </View>
                        <View style={styles.activityBody}>
                          <Text style={styles.activityTitle}>Bonus</Text>
                          {item.reason ? <Text style={styles.activitySub}>{item.reason}</Text> : null}
                        </View>
                        <Text style={styles.bonusValue}>+{item.stars} ⭐</Text>
                        <TouchableOpacity style={styles.editBtn} onPress={() => openEditReward(item)}>
                          <Text style={styles.editBtnText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.removeBtn} onPress={() => Alert.alert('Delete Bonus', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => removeCompletion(item.kidId, item.taskId, item.subtaskId) }])}>
                          <Text style={styles.removeBtnText}>Del</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }

                  if (item.isPenalty) {
                    return (
                      <View key={item.id} style={[styles.activityItem, styles.penaltyActivity]}>
                        <View style={[styles.activityIconBg, { backgroundColor: '#FFE8E8' }]}>
                          <Text style={styles.activityIconText}>⚠️</Text>
                        </View>
                        <View style={styles.activityBody}>
                          <Text style={styles.activityTitle}>Penalty</Text>
                          {item.reason ? <Text style={styles.activitySub}>{item.reason}</Text> : null}
                        </View>
                        <Text style={styles.penaltyValue}>-{item.stars} ⭐</Text>
                        <TouchableOpacity style={styles.editBtn} onPress={() => openEditReward(item)}>
                          <Text style={styles.editBtnText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.removeBtn} onPress={() => Alert.alert('Delete Penalty', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => removeCompletion(item.kidId, item.taskId, item.subtaskId) }])}>
                          <Text style={styles.removeBtnText}>Del</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }

                  const task = tasks.find((t) => t.id === item.taskId);
                  const subtask = task?.subtasks.find((s) => s.id === item.subtaskId);
                  return (
                    <View key={item.id} style={[styles.activityItem, styles.taskActivity]}>
                      <View style={[styles.activityIconBg, { backgroundColor: '#EDEAFF' }]}>
                        <Text style={styles.activityIconText}>⭐</Text>
                      </View>
                      <View style={styles.activityBody}>
                        <Text style={styles.activityTitle}>{task?.title ?? 'Task'}</Text>
                        {subtask?.title ? <Text style={styles.activitySub}>{subtask.title}</Text> : null}
                      </View>
                      <Text style={styles.taskValue}>{subtask?.stars ?? 0} ⭐</Text>
                      <TouchableOpacity style={styles.removeBtn} onPress={() => Alert.alert(t('kid.info'), t('kid.oops_reminder'), [{ text: t('common.cancel'), style: 'cancel' as any }, { text: t('parentDashboard.delete'), style: 'destructive' as any, onPress: async () => { try { await removeCompletion(item.kidId, item.taskId, item.subtaskId); } catch (e) { console.error(e); } } }])}>
                        <Text style={styles.removeBtnText}>Del</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalBack}>
          <View style={styles.modalCard}>
            <Text style={styles.sectionTitle}>
              Edit {editingItem?.isBonus ? "Bonus" : "Penalty"}
            </Text>

            <TextInput
              placeholder="Stars"
              value={editStars}
              onChangeText={(t) => setEditStars(t.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              style={styles.input}
            />

            <TextInput
              placeholder="Reason"
              value={editReason}
              onChangeText={setEditReason}
              style={styles.input}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateReward}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  removeBtn: {
    marginLeft: 10,
    backgroundColor: "#FFE7E7",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  removeBtnText: {
    color: "#dc3545",
    fontSize: 12,
    fontWeight: "800",
  },
  editBtn: {
    marginLeft: 10,
    backgroundColor: "#E8E7FF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  editBtnText: {
    color: "#6C63FF",
    fontSize: 12,
    fontWeight: "800",
  },
  modalBack: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalCard: {
    margin: 20,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: "#03c8A7",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "800",
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  cancelBtnText: {
    color: "#000",
    fontWeight: "800",
  },

  // Activity timeline
  dateGroup: {
    marginBottom: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C63FF',
    marginRight: 8,
    textTransform: 'uppercase',
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8F0',
    marginRight: 8,
  },
  dateCountBadge: {
    backgroundColor: '#EDEAFF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  dateCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C63FF',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  taskActivity: {
    backgroundColor: '#F7F6FF',
  },
  bonusActivity: {
    backgroundColor: '#F0FFF8',
  },
  penaltyActivity: {
    backgroundColor: '#FFF4F4',
  },
  activityIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityIconText: {
    fontSize: 18,
  },
  activityBody: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D2A32',
  },
  activitySub: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  taskValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6C63FF',
    marginRight: 6,
  },
  bonusValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#06D6A0',
    marginRight: 6,
  },
  penaltyValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF5D5D',
    marginRight: 6,
  },
});
