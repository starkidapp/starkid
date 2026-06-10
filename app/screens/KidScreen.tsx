import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, LayoutAnimation, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KidAvatar from '../components/KidAvatar';
import { useKids, type Kid } from '../context/KidContext';

export default function KidScreen() {
  const router = useRouter();
  const { kids, tasks, toggleCompletion, hasCompletedToday, getKidStars, getMonthlyStars, completions, removeCompletion } = useKids();
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinTargetId, setPinTargetId] = useState<string | null>(null);

  // helper functions in this screen: markSubtask below

  function markSubtask(taskId: string, subtaskId: string) {
    if (!selectedKid) {
      Alert.alert('Select Kid First');
      return;
    }
    try {
      const res = toggleCompletion(selectedKid.id, taskId, subtaskId);
      if (res && res.added) {
        // animate layout
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
          UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        // check if task now fully completed to celebrate
        const task = tasks.find((t) => t.id === taskId);
        const total = task?.subtasks.length || 0;
        const today = new Date().toISOString().slice(0, 10);
        const existing = completions.filter((c) => c.kidId === selectedKid.id && c.taskId === taskId && c.date === today).length;
        const nowDone = existing + 1; // include this new completion
        if (nowDone >= total && total > 0) {
          triggerCelebrate();
        }
        Alert.alert('Nice!', 'Subtask marked done and stars awarded');
      } else {
        Alert.alert('Info', res?.message || 'Already done');
      }
    } catch (err) {
      console.warn('toggleCompletion error', err);
      Alert.alert('Error', 'Could not mark subtask. Try again.');
    }
  }

  const confettiScale = useRef(new Animated.Value(0)).current;
  const [celebrateVisible, setCelebrateVisible] = useState(false);

  function triggerCelebrate() {
    setCelebrateVisible(true);
    confettiScale.setValue(0);
    Animated.spring(confettiScale, { toValue: 1, useNativeDriver: true, friction: 5 }).start(() => {
      setTimeout(() => {
        Animated.timing(confettiScale, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setCelebrateVisible(false));
      }, 900);
    });
  }

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

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
      Alert.alert('Welcome', `Hello ${kid.name}!`);
    } else {
      Alert.alert('Incorrect PIN', 'Try again');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>{selectedKid ? selectedKid.name : 'Who are you?'}</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.kidList}
          contentContainerStyle={styles.kidListContent}
          data={kids}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.kidListItem}>
              <KidAvatar
                item={item}
                selected={selectedKid?.id === item.id}
                onPress={() => tryOpenKid(item)}
              />
              <View style={styles.monthlyBadge}>
                <Text style={styles.monthlyBadgeText}>{getMonthlyStars(item.id)}⭐</Text>
              </View>
            </View>
          )}
        />

        {celebrateVisible ? (
          <Animated.View pointerEvents="none" style={[styles.confettiWrapper, { transform: [{ scale: confettiScale }] }]}>
            <Text style={styles.confettiText}>🎉✨🎉</Text>
          </Animated.View>
        ) : null}

        <Text style={styles.sectionHeading}>
          Tasks
        </Text>
        {selectedKid && (
          <Text style={styles.totalStarsInfo}>Total Stars: {getKidStars(selectedKid.id)} ⭐</Text>
        )}

        {selectedKid && (
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionTitleLarge}>Bonuses</Text>
            {completions.filter((c) => c.kidId === selectedKid.id && c.isBonus).length === 0 ? (
              <View style={styles.emptyRow}><Text style={styles.emptyText}>✨ No bonuses yet — try asking for extra stars!</Text></View>
            ) : (
              completions
                .filter((c) => c.kidId === selectedKid.id && c.isBonus)
                .map((b) => (
                  <View key={b.id} style={[styles.bonusCard, styles.cardElevated]}>
                    <View style={styles.bonusLeft}>
                      <View style={styles.badge}><Text style={styles.badgeText}>+{b.stars}</Text></View>
                      <Text style={styles.bonusEmoji}>🎊</Text>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{b.reason || 'Bonus'}</Text>
                      <Text style={styles.cardMeta}>{b.date}</Text>
                    </View>
                    <View style={styles.viewOnlyBadge}>
                      <Text style={styles.viewOnlyText}>View-only</Text>
                    </View>
                  </View>
                ))
            )}

            <Text style={[styles.sectionTitleLarge, styles.sectionSpacing]}>Penalties / Alerts</Text>
            {completions.filter((c) => c.kidId === selectedKid.id && c.isPenalty).length === 0 ? (
              <View style={styles.emptyRow}><Text style={styles.emptyText}>✅ No penalties. Keep it up!</Text></View>
            ) : (
              completions
                .filter((c) => c.kidId === selectedKid.id && c.isPenalty)
                .map((p) => (
                  <View key={p.id} style={[styles.penaltyCard, styles.cardElevated]}>
                    <View style={styles.penaltyLeft}>
                      <View style={styles.penaltyBadge}><Text style={styles.badgeText}>-{p.stars}</Text></View>
                      <Text style={styles.penaltyEmoji}>⚠️</Text>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.penaltyTitle}>{p.reason || 'Penalty / Alert'}</Text>
                      <Text style={styles.cardMeta}>{p.date}</Text>
                    </View>
                    <View style={styles.viewOnlyBadge}>
                      <Text style={styles.viewOnlyText}>View-only</Text>
                    </View>
                  </View>
                ))
            )}
          </View>
        )}

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const total = item.subtasks.length;
            const doneCount = item.subtasks.filter((s) => hasCompletedToday(selectedKid?.id || '', item.id, s.id)).length;
            const penaltyTotal = selectedKid
              ? completions.filter((c) => c.kidId === selectedKid.id && c.isPenalty).reduce((s, n) => s + (n.stars || 0), 0)
              : 0;
            return (
              <View style={[styles.taskCard, { backgroundColor: '#fff' }]}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  <View style={styles.rightAligned}>
                    <View style={styles.totalStarsBadge}><Text style={styles.badgeText}>{item.subtasks.reduce((a, b) => a + b.stars, 0)} ⭐</Text></View>
                  </View>
                </View>

                <View style={styles.progressWrap}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: total === 0 ? '0%' : `${Math.round((doneCount / total) * 100)}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{doneCount}/{total} done</Text>
                </View>

                <View style={styles.subtasksRow}>
                  {item.subtasks.map((st) => {
                    const done = hasCompletedToday(selectedKid?.id || '', item.id, st.id);
                    return (
                      <View key={st.id} style={styles.subtaskRow}>
                        <View style={[styles.subtaskChip, done ? styles.subtaskDone : styles.subtaskPending]}>
                          <Text style={styles.subtaskEmoji}>{done ? '🎉' : '⭕'}</Text>
                          <View style={styles.subtaskDetails}>
                            <Text style={done ? styles.subtaskTextDone : styles.subtaskTextPending}>{st.title}</Text>
                            <Text style={styles.subtaskMeta}>{st.stars} ⭐</Text>
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => markSubtask(item.id, st.id)} style={[styles.subtaskBtn, done ? styles.subtaskBtnDone : styles.subtaskBtnIdle]}>
                          <Text style={styles.subtaskBtnText}>{done ? '✓' : 'Mark'}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
                <View style={styles.taskFooter}>
                  <View style={styles.footerLeft}>
                    <View style={styles.footerBadge}>
                      <Text style={styles.footerBadgeText}>🏆 {item.subtasks.reduce((a, b) => a + b.stars, 0)}</Text>
                    </View>
                    <View style={styles.footerInfo}>
                      <Text style={styles.footerTitle}>{item.title}</Text>
                      <Text style={styles.footerSmall}>{doneCount}/{total} completed</Text>
                    </View>
                  </View>
                  <View style={styles.footerRight}>
                    {penaltyTotal > 0 && (
                      <View style={styles.footerPenaltyCard}>
                        <Text style={styles.footerPenaltyText}>-{penaltyTotal}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          }}
        />

        <Modal visible={pinModalVisible} transparent animationType="fade">
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Enter 4-digit PIN</Text>
              <TextInput
                value={pinValue}
                onChangeText={(t) => setPinValue(t.replace(/[^0-9]/g, '').slice(0, 4))}
                keyboardType="number-pad"
                style={styles.input}
                placeholder="1234"
                maxLength={4}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.btn, styles.flex1]} onPress={verifyPin}>
                  <Text style={styles.modalPrimaryText}>Unlock</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.flex1, styles.btnCancel]} onPress={() => setPinModalVisible(false)}>
                  <Text style={styles.modalSecondaryText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalBack: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalCard: { margin: 20, backgroundColor: '#fff', padding: 16, borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 8, marginBottom: 8 },
  btn: { backgroundColor: '#6C63FF', padding: 12, borderRadius: 10 },
  taskCard: { backgroundColor: '#F1FBFF', padding: 14, borderRadius: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  taskTitle: { fontSize: 18, fontWeight: '900' },
  taskStars: { color: '#fb8500', fontWeight: '800' },
  progressText: { color: '#666', fontSize: 12 },
  totalStarsBadge: { backgroundColor: '#fb8500', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
  progressWrap: { marginBottom: 10 },
  progressBarBg: { height: 8, backgroundColor: '#eee', borderRadius: 8, overflow: 'hidden' },
  progressBarFill: { height: 8, backgroundColor: '#6C63FF', borderRadius: 8 },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  footerLeft: { flexDirection: 'row', alignItems: 'center' },
  footerBadge: { backgroundColor: '#ffd166', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
  footerBadgeText: { fontWeight: '900' },
  footerInfo: { marginLeft: 12 },
  footerSmall: { color: '#666', fontSize: 12 },
  footerRight: { alignItems: 'center' },
  footerPenaltyBadge: { backgroundColor: '#ffccd1', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
  footerPenaltyText: { color: '#b00020', fontWeight: '900', fontSize: 14 },
  subtasksRow: { gap: 8 },
  subtaskRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  subtaskChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  subtaskDone: { backgroundColor: '#E6F9F0' },
  subtaskPending: { backgroundColor: '#fff' },
  subtaskTextDone: { color: '#007f5f', fontWeight: '700' },
  subtaskTextPending: { color: '#023047', fontWeight: '700' },
  subtaskStars: { marginLeft: 8, color: '#fb8500', fontWeight: '800' },
  subtaskBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  subtaskBtnDone: { backgroundColor: '#ccc' },
  subtaskBtnIdle: { backgroundColor: '#06c' },
  subtaskBtnText: { color: '#fff', fontWeight: '800' },
  bonusCard: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6 },
  badge: { backgroundColor: '#ffd166', padding: 10, borderRadius: 8, minWidth: 52, alignItems: 'center', justifyContent: 'center' },
  smallUndoBtn: { borderWidth: 1, borderColor: '#e63946', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  smallUndoBtnText: { color: '#e63946', fontWeight: '800' },
  penaltyCard: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6 },
  penaltyBadge: { backgroundColor: '#e63946', padding: 10, borderRadius: 8, minWidth: 52, alignItems: 'center', justifyContent: 'center' },
  smallUndoBtnBlue: { borderWidth: 1, borderColor: '#6C63FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  smallUndoBtnBlueText: { color: '#6C63FF', fontWeight: '800' },
  /* New kid-friendly styles */
  cardElevated: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  bonusLeft: { alignItems: 'center', justifyContent: 'center', width: 72 },
  bonusEmoji: { fontSize: 22, marginTop: 6 },
  penaltyLeft: { alignItems: 'center', justifyContent: 'center', width: 72 },
  penaltyEmoji: { fontSize: 22, marginTop: 6 },
  emptyRow: { paddingVertical: 12, paddingHorizontal: 10, backgroundColor: '#fff9f2', borderRadius: 10 },
  emptyText: { color: '#666', fontSize: 13 },
  footerPenaltyCard: { backgroundColor: '#fff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, minWidth: 56, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  kidList: { marginTop: 12, maxHeight: 130 },
  kidListContent: { paddingRight: 20, alignItems: 'center' },
  screenContainer: { flex: 1, padding: 20, backgroundColor: '#FFF8E7' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e5e5' },
  backButtonText: { fontWeight: '700', fontSize: 14 },
  backButtonPlaceholder: { width: 82 },
  screenTitle: { fontSize: 24, fontWeight: '800', flex: 1, textAlign: 'center' },
  safeArea: { flex: 1, backgroundColor: '#FFF8E7' },
  kidListItem: { marginRight: 12 },
  monthlyBadge: { position: 'absolute', right: -6, top: -6, backgroundColor: '#FFD166', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  monthlyBadgeText: { fontWeight: '800' },
  confettiWrapper: { position: 'absolute', left: 0, right: 0, top: 120, alignItems: 'center' },
  confettiText: { fontSize: 48 },
  sectionHeading: { fontSize: 22, marginVertical: 20 },
  totalStarsInfo: { fontSize: 16, marginBottom: 8 },
  sectionGroup: { marginBottom: 16 },
  sectionTitleLarge: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  sectionSpacing: { marginTop: 12 },
  cardContent: { flex: 1, marginLeft: 12 },
  cardTitle: { fontWeight: '900', fontSize: 16 },
  cardMeta: { color: '#666', fontSize: 12 },
  penaltyTitle: { fontWeight: '900', color: '#b00020', fontSize: 16 },
  viewOnlyBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#f0f4ff' },
  viewOnlyText: { color: '#666', fontSize: 12 },
  rightAligned: { alignItems: 'flex-end' },
  subtaskEmoji: { fontSize: 18 },
  subtaskDetails: { marginLeft: 10 },
  subtaskMeta: { color: '#999', fontSize: 12 },
  footerTitle: { fontWeight: '800' },
  buttonRow: { flexDirection: 'row', gap: 8 },
  flex1: { flex: 1 },
  btnCancel: { backgroundColor: '#ccc' },
  modalPrimaryText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  modalSecondaryText: { textAlign: 'center', fontWeight: '700' },
  taskCardWhite: { backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6 },
});