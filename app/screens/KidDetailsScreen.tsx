import { t } from "@/lib/i18n";
import { colors, palette, radii, shadows, spacing } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { Avatar, Text } from "@/components/ui";
import ScreenHeader from "../components/ScreenHeader";
import { useKids } from "../context/KidContext";
import { capitalizeWords } from "../utils/textUtils";

export default function KidDetailsScreen() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editStars, setEditStars] = useState("");
  const [editReason, setEditReason] = useState("");
  const { kidId } = useLocalSearchParams();
  const { kids, completions, competitions, tasks, getKidStars, getChallengeStars, getLeaderIds, removeCompletion, updateCompletion } = useKids();
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

  /** Rankings from the most recently ended challenge. */
  const lastChallengeRankings = useMemo(
    () => (competitions.length > 0 ? competitions[competitions.length - 1].rankings : []),
    [competitions],
  );

  if (!kid) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title={t("kidDetails.title")} showBackButton />
        <View style={styles.centeredBox}>
          <Text>{t('kidDetails.not_found')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("kidDetails.title")} showBackButton />
      <ScrollView style={styles.container}>
        {/* Kid Info Header */}
        <View style={styles.headerCard}>
          <Avatar
            emoji={kid.avatar}
            size="xl"
            crowned={getLeaderIds().includes(kid.id)}
            style={styles.avatar}
          />
          <Text style={styles.kidName}>{capitalizeWords(kid.name)}</Text>
          <Text style={styles.totalStars}>
            Total Stars: {getKidStars(kidId as string)}
          </Text>
        </View>

        {/* This Challenge Stats */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>This Challenge</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Stars Earned:</Text>
            <Text style={styles.statValue}>{getChallengeStars(kidId as string)} ⭐</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Completions:</Text>
            <Text style={styles.statValue}>
              {kidCompletions.filter((c) => !c.isBonus && !c.isPenalty).length}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Bonuses:</Text>
            <Text style={styles.statValue}>{allBonuses.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Penalties:</Text>
            <Text style={styles.statValue}>{allPenalties.length}</Text>
          </View>
        </View>

        {/* Previous Challenge Ranking */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Previous Challenge Ranking</Text>
          {lastChallengeRankings.length === 0 ? (
            <Text style={styles.mutedText}>No past challenges yet</Text>
          ) : (
            <FlatList
              data={lastChallengeRankings}
              keyExtractor={(item) => item.kidId}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.rankingRow,
                    item.kidId === kidId && styles.highlightedRanking,
                  ]}
                >
                  <Text style={styles.rankingPosition}>#{index + 1}</Text>
                  <Text style={styles.rankingName}>{capitalizeWords(item.name)}</Text>
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
    </View>
  );
}

const CARD = { backgroundColor: colors.card, borderRadius: radii.lg, ...shadows.sm };
const HAIRLINE = { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border };

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  headerCard: { ...CARD, padding: spacing.xl, alignItems: "center", marginBottom: spacing.lg },
  avatar: { marginTop: spacing.xl, marginBottom: spacing.md },
  kidName: { fontSize: 24, fontWeight: "800", marginBottom: spacing.sm, color: colors.text },
  totalStars: { fontSize: 18, fontWeight: "800", color: colors.primary },
  sectionCard: { ...CARD, padding: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: spacing.md, color: colors.text },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    ...HAIRLINE,
  },
  statLabel: { fontSize: 14, fontWeight: "600", color: colors.textMuted },
  statValue: { fontSize: 14, fontWeight: "800", color: colors.text },
  rankingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    ...HAIRLINE,
  },
  highlightedRanking: {
    backgroundColor: palette.primarySoft,
    borderRadius: radii.sm,
    marginVertical: spacing.xs,
  },
  rankingPosition: { fontSize: 16, fontWeight: "800", color: colors.primary, width: 40 },
  rankingName: { fontSize: 16, fontWeight: "700", flex: 1, marginLeft: spacing.md, color: colors.text },
  rankingStars: { fontSize: 16, fontWeight: "800", color: palette.accentDark },
  historyItem: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    ...HAIRLINE,
    alignItems: "center",
  },
  historyTask: { fontSize: 14, fontWeight: "700", color: colors.text },
  historySubtask: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  historyReason: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontStyle: "italic",
  },
  historyDate: { fontSize: 11, color: colors.textFaint, marginTop: spacing.xs },
  historyStars: { fontSize: 16, fontWeight: "800", color: palette.accentDark, marginLeft: spacing.md },
  bonusItem: { backgroundColor: palette.successSoft },
  bonusStars: { fontSize: 16, fontWeight: "800", color: "#02795B", marginLeft: spacing.md },
  penaltyItem: { backgroundColor: palette.dangerSoft },
  penaltyStars: { fontSize: 16, fontWeight: "800", color: "#C22E51", marginLeft: spacing.md },
  screen: { flex: 1, backgroundColor: colors.bg },
  centeredBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  mutedText: { color: colors.textMuted, padding: spacing.md },
  flex1: { flex: 1 },
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowAlignCenterFlex1: { flexDirection: "row", alignItems: "center", flex: 1 },
  historyBody: { marginLeft: spacing.md, flex: 1 },
  linkText: { color: colors.primary, fontWeight: "700" },
  removeBtn: {
    marginLeft: spacing.sm,
    backgroundColor: palette.dangerSoft,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
  },
  removeBtnText: { color: "#C22E51", fontSize: 12, fontWeight: "800" },
  editBtn: {
    marginLeft: spacing.sm,
    backgroundColor: palette.primarySoft,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
  },
  editBtnText: { color: colors.primary, fontSize: 12, fontWeight: "800" },
  modalBack: { flex: 1, justifyContent: "center", backgroundColor: colors.overlay },
  modalCard: {
    margin: spacing.xl,
    backgroundColor: colors.card,
    padding: spacing.xl,
    borderRadius: radii.xl,
    ...shadows.lg,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  saveBtnText: { color: colors.onPrimary, fontWeight: "800" },
  cancelBtn: {
    backgroundColor: colors.bgAlt,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  cancelBtnText: { color: colors.text, fontWeight: "800" },

  // Activity timeline
  dateGroup: { marginBottom: spacing.sm },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginRight: spacing.sm,
    textTransform: 'uppercase',
  },
  dateLine: { flex: 1, height: 1, backgroundColor: colors.border, marginRight: spacing.sm },
  dateCountBadge: {
    backgroundColor: palette.primarySoft,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  dateCountText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    marginBottom: spacing.xs,
  },
  taskActivity: { backgroundColor: palette.primarySoft },
  bonusActivity: { backgroundColor: palette.successSoft },
  penaltyActivity: { backgroundColor: palette.dangerSoft },
  activityIconBg: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityIconText: { fontSize: 18 },
  activityBody: { flex: 1 },
  activityTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  activitySub: { fontSize: 11, color: colors.textFaint, marginTop: 2 },
  taskValue: { fontSize: 14, fontWeight: '800', color: colors.primary, marginRight: spacing.xs },
  bonusValue: { fontSize: 14, fontWeight: '800', color: palette.success, marginRight: spacing.xs },
  penaltyValue: { fontSize: 14, fontWeight: '800', color: colors.danger, marginRight: spacing.xs },
});
