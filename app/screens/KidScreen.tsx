import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import {
  AppText,
  Badge,
  Card,
  Dialog,
  EmptyState,
  PlayfulBackground,
  ProgressBar,
  Screen,
  SectionHeader,
  StarBadge,
  TextField,
} from '@/components/ui';
import { colors, palette, radii, shadows, spacing } from '@/constants/theme';
import KidAvatar from '../components/KidAvatar';
import ScreenHeader from '../components/ScreenHeader';
import StarCelebration, { type Celebration } from '../components/StarCelebration';
import { useKids, type Kid } from '../context/KidContext';

// Each task gets its own colour so the list reads as a rainbow, not a grey stack.
const TASK_COLORS = [
  { main: palette.primary, soft: palette.primarySoft },
  { main: palette.accent, soft: palette.accentSoft },
  { main: palette.info, soft: palette.infoSoft },
  { main: palette.danger, soft: palette.dangerSoft },
  { main: palette.success, soft: palette.successSoft },
] as const;

export default function KidScreen() {
  const router = useRouter();
  const {
    kids,
    tasks,
    toggleCompletion,
    hasCompletedToday,
    getKidStars,
    getChallengeStars,
    getLeaderIds,
    completions,
  } = useKids();
  const leaderIds = getLeaderIds();
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinTargetId, setPinTargetId] = useState<string | null>(null);

  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const clearCelebration = useCallback(() => setCelebration(null), []);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  function markSubtask(taskId: string, subtaskId: string) {
    if (!selectedKid) {
      Alert.alert(
        'Tap your picture first',
        'Tap your picture at the top of the screen and type your PIN. Then you can mark your tasks.',
      );
      return;
    }
    try {
      const res = toggleCompletion(selectedKid.id, taskId, subtaskId);
      if (res && res.added) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const task = tasks.find((t) => t.id === taskId);
        const total = task?.subtasks.length || 0;
        const today = new Date().toISOString().slice(0, 10);
        const existing = completions.filter(
          (c) => c.kidId === selectedKid.id && c.taskId === taskId && c.date === today,
        ).length;
        const nowDone = existing + 1;
        const stars = task?.subtasks.find((st) => st.id === subtaskId)?.stars ?? 1;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        setCelebration({ id: Date.now(), stars, taskDone: total > 0 && nowDone >= total });
      } else {
        // Already done today — the chip already shows "✓ Done", so no pop-up.
        Haptics.selectionAsync().catch(() => {});
      }
    } catch (err) {
      console.warn('toggleCompletion error', err);
      Alert.alert('Something went wrong', 'Please tap the task again.');
    }
  }

  function tryOpenKid(kid: Kid) {
    setPinTargetId(kid.id);
    setPinValue('');
    setPinModalVisible(true);
  }

  function verifyPin() {
    if (!pinTargetId) return;
    const kid = kids.find((k) => k.id === pinTargetId);
    if (!kid) return;
    if (kid.pin === pinValue) {
      setSelectedKid(kid);
      setPinModalVisible(false);
    } else {
      setPinValue('');
      Alert.alert(
        'Wrong PIN',
        'That PIN is not correct. Please try again.\n\nForgot your PIN? Ask your mom or dad.',
      );
    }
  }

  const bonuses = selectedKid
    ? completions.filter((c) => c.kidId === selectedKid.id && c.isBonus)
    : [];
  const penalties = selectedKid
    ? completions.filter((c) => c.kidId === selectedKid.id && c.isPenalty)
    : [];
  const penaltyTotal = penalties.reduce((s, n) => s + (n.stars || 0), 0);

  return (
    <View style={{ flex: 1 }}>
      <PlayfulBackground />
      <ScreenHeader
        title={selectedKid ? selectedKid.name : 'Who are you?'}
        onBackPress={() => router.back()}
        transparent
      />
      <Screen padded={false} topInset={false} background="transparent">
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.header}>
              {!selectedKid ? (
                <BubbleBanner colors={[palette.primary, '#9B5CFF']}>
                  <AppText style={styles.bannerEmoji}>🌟</AppText>
                  <View style={{ flex: 1 }}>
                    <AppText variant="heading" color="#fff">
                      Hello, superstar!
                    </AppText>
                    <AppText variant="caption" color="rgba(255,255,255,0.92)">
                      Tap your picture below to start earning stars.
                    </AppText>
                  </View>
                </BubbleBanner>
              ) : null}

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={kids}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.kidRow}
                renderItem={({ item, index }) => (
                  <KidAvatar
                    item={item}
                    tint={TASK_COLORS[index % TASK_COLORS.length]}
                    selected={selectedKid?.id === item.id}
                    onPress={() => tryOpenKid(item)}
                    challengeStars={getChallengeStars(item.id)}
                    crowned={leaderIds.includes(item.id)}
                  />
                )}
                ListEmptyComponent={
                  <AppText variant="body" color="textMuted">
                    No kids yet — ask a parent to add you.
                  </AppText>
                }
              />

              {selectedKid ? (
                <BubbleBanner colors={[palette.accent, palette.star]}>
                  <View style={styles.totals}>
                    <AppText variant="label" color="rgba(255,255,255,0.95)">
                      TOTAL STARS
                    </AppText>
                    <AppText variant="display" color="#fff">
                      {getKidStars(selectedKid.id)} ⭐
                    </AppText>
                  </View>
                  <AppText style={styles.trophy}>🏆</AppText>
                </BubbleBanner>
              ) : null}

              {selectedKid && bonuses.length > 0 ? (
                <View style={styles.section}>
                  <SectionHeader title="Bonuses" emoji="🎊" />
                  {bonuses.map((b) => (
                    <RewardRow
                      key={b.id}
                      tone="success"
                      amount={`+${b.stars}`}
                      title={b.reason || 'Bonus'}
                      date={b.date}
                    />
                  ))}
                </View>
              ) : null}

              {selectedKid && penalties.length > 0 ? (
                <View style={styles.section}>
                  <SectionHeader title="Penalties / Alerts" emoji="⚠️" />
                  {penalties.map((p) => (
                    <RewardRow
                      key={p.id}
                      tone="danger"
                      amount={`-${p.stars}`}
                      title={p.reason || 'Penalty / Alert'}
                      date={p.date}
                    />
                  ))}
                </View>
              ) : null}

              <SectionHeader title="Tasks" emoji="✅" style={styles.tasksHeading} />
            </View>
          }
          renderItem={({ item, index }) => {
            const tint = TASK_COLORS[index % TASK_COLORS.length];
            const total = item.subtasks.length;
            const doneCount = item.subtasks.filter((s) =>
              hasCompletedToday(selectedKid?.id || '', item.id, s.id),
            ).length;
            const taskStars = item.subtasks.reduce((a, b) => a + b.stars, 0);
            const expanded = expandedTaskId === item.id;
            const allDone = total > 0 && doneCount === total;

            return (
              <Card style={{ ...styles.taskCard, borderLeftColor: tint.main }} padding="none">
                <Pressable
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setExpandedTaskId(expanded ? null : item.id);
                  }}
                  style={({ pressed }) => [styles.taskRow, pressed && { opacity: 0.7 }]}
                >
                  <View
                    style={[
                      styles.taskStatusDot,
                      { backgroundColor: allDone ? palette.success : tint.soft },
                    ]}
                  >
                    {allDone ? (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    ) : (
                      <AppText variant="caption" color={tint.main} weight="700">
                        {doneCount}
                      </AppText>
                    )}
                  </View>
                  <AppText
                    variant="bodyStrong"
                    style={[styles.taskRowTitle, allDone && styles.strike]}
                    color={allDone ? 'textMuted' : 'text'}
                    numberOfLines={1}
                  >
                    {item.title || item.subtasks[0]?.title}
                  </AppText>
                  <StarBadge count={taskStars} size="sm" />
                  <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.textFaint}
                  />
                </Pressable>

                {expanded ? (
                  <View style={styles.taskDetail}>
                    <ProgressBar value={doneCount} total={total} label style={styles.progress} />
                    <View style={styles.subtasks}>
                      {item.subtasks.map((st) => {
                        const done = hasCompletedToday(selectedKid?.id || '', item.id, st.id);
                        return (
                          <Pressable
                            key={st.id}
                            onPress={() => markSubtask(item.id, st.id)}
                            style={({ pressed }) => [
                              styles.subtaskChip,
                              { backgroundColor: done ? palette.successSoft : colors.inputBg },
                              pressed && { opacity: 0.85 },
                            ]}
                          >
                            <View style={{ flex: 1 }}>
                              <AppText
                                variant="bodyStrong"
                                color={done ? 'success' : 'text'}
                                style={done && styles.strike}
                              >
                                {st.title}
                              </AppText>
                              <AppText variant="caption" color="textMuted">
                                {st.stars} ⭐
                              </AppText>
                            </View>
                            <Badge tone={done ? 'success' : 'primary'} size="sm">
                              {done ? '✓ Done' : 'Mark'}
                            </Badge>
                          </Pressable>
                        );
                      })}
                    </View>
                    {penaltyTotal > 0 ? (
                      <Badge tone="danger" size="sm" style={{ marginTop: spacing.sm }}>
                        {`Penalties: -${penaltyTotal} ⭐`}
                      </Badge>
                    ) : null}
                  </View>
                ) : null}
              </Card>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              emoji="🗒️"
              title="No tasks yet"
              message="A parent can add tasks from the Parent dashboard."
            />
          }
        />

      </Screen>

      <StarCelebration celebration={celebration} onDone={clearCelebration} />

      <Dialog
        visible={pinModalVisible}
        onClose={() => setPinModalVisible(false)}
        title="Enter your 4-digit PIN"
        actions={[
          { label: 'Cancel', variant: 'ghost', onPress: () => setPinModalVisible(false) },
          { label: 'Unlock', onPress: verifyPin },
        ]}
      >
        <TextField
          value={pinValue}
          onChangeText={(t) => setPinValue(t.replace(/[^0-9]/g, '').slice(0, 4))}
          keyboardType="number-pad"
          placeholder="1234"
          maxLength={4}
          secureToggle
          autoFocus
        />
      </Dialog>
    </View>
  );
}

/** Gradient banner with soft white circles floating inside it. */
function BubbleBanner({
  colors: gradient,
  children,
}: {
  colors: readonly [string, string];
  children: ReactNode;
}) {
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.banner}
    >
      <View pointerEvents="none" style={[styles.bannerCircle, styles.bannerCircleA]} />
      <View pointerEvents="none" style={[styles.bannerCircle, styles.bannerCircleB]} />
      <View pointerEvents="none" style={[styles.bannerRing, styles.bannerRingA]} />
      <View pointerEvents="none" style={[styles.bannerDot, { top: 14, left: '52%' }]} />
      <View pointerEvents="none" style={[styles.bannerDot, { bottom: 12, left: '30%' }]} />
      {children}
    </LinearGradient>
  );
}

function RewardRow({
  tone,
  amount,
  title,
  date,
}: {
  tone: 'success' | 'danger';
  amount: string;
  title: string;
  date: string;
}) {
  return (
    <Card tone={tone} accentBar style={styles.rewardRow} padding="md">
      <Badge tone={tone === 'success' ? 'success' : 'danger'}>{amount}</Badge>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="caption" color="textMuted">
          {date}
        </AppText>
      </View>
      <Badge tone="neutral" size="sm">
        View-only
      </Badge>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.xl, paddingBottom: spacing['4xl'] },
  header: { gap: spacing.lg },
  kidRow: { gap: spacing.md, paddingVertical: spacing.sm, paddingRight: spacing.lg },
  totals: { flex: 1, alignItems: 'flex-start', gap: spacing.xs },
  trophy: { fontSize: 44 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  bannerEmoji: { fontSize: 40 },
  bannerCircle: {
    position: 'absolute',
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  bannerCircleA: { width: 140, height: 140, top: -60, right: -30 },
  bannerCircleB: { width: 90, height: 90, bottom: -45, left: -20 },
  bannerRing: {
    position: 'absolute',
    borderRadius: radii.pill,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  bannerRingA: { width: 54, height: 54, bottom: 10, right: 70 },
  bannerDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  section: { gap: spacing.sm },
  tasksHeading: { marginTop: spacing.sm },
  taskCard: { marginBottom: spacing.md, overflow: 'hidden', borderLeftWidth: 5 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  taskStatusDot: {
    width: 30,
    height: 30,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskRowTitle: { flex: 1 },
  taskDetail: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  progress: { marginTop: spacing.xs },
  subtasks: { gap: spacing.sm },
  subtaskChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
  },
  strike: { textDecorationLine: 'line-through' },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
