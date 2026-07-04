// import { t } from '@/lib/i18n';
// import { useRouter } from 'expo-router';
// import { useEffect, useRef, useState } from 'react';
// import { Alert, Animated, FlatList, LayoutAnimation, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import KidAvatar from '../components/KidAvatar';
// import { useKids, type Kid } from '../context/KidContext';

// export default function KidScreen() {
//   const router = useRouter();
//   const { kids, tasks, toggleCompletion, hasCompletedToday, getKidStars, getMonthlyStars, completions, removeCompletion } = useKids();
//   const [selectedKid, setSelectedKid] = useState<Kid | null>(null);

//   const [pinModalVisible, setPinModalVisible] = useState(false);
//   const [pinValue, setPinValue] = useState('');
//   const [pinTargetId, setPinTargetId] = useState<string | null>(null);

//   // helper functions in this screen: markSubtask below

//   function markSubtask(taskId: string, subtaskId: string) {
//     if (!selectedKid) {
//       Alert.alert(t('kid.select_first'));
//       return;
//     }
//     try {
//       const res = toggleCompletion(selectedKid.id, taskId, subtaskId);
//       if (res && res.added) {
//         // animate layout
//         if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//           UIManager.setLayoutAnimationEnabledExperimental(true);
//         }
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         // check if task now fully completed to celebrate
//         const task = tasks.find((t) => t.id === taskId);
//         const total = task?.subtasks.length || 0;
//         const today = new Date().toISOString().slice(0, 10);
//         const existing = completions.filter((c) => c.kidId === selectedKid.id && c.taskId === taskId && c.date === today).length;
//         const nowDone = existing + 1; // include this new completion
//         // if (nowDone >= total && total > 0) {
//         triggerCelebrate();
//         // }
//         // Alert.alert('Nice!', 'Subtask marked done and stars awarded');
//       } else {
//         Alert.alert('Info', res?.message || 'Already done');
//       }
//     } catch (err) {
//       console.warn('toggleCompletion error', err);
//       Alert.alert('Error', 'Could not mark subtask. Try again.');
//     }
//   }

//   const confettiScale = useRef(new Animated.Value(0)).current;
//   const [celebrateVisible, setCelebrateVisible] = useState(false);

//   function triggerCelebrate() {
//     setCelebrateVisible(true);
//     confettiScale.setValue(0);
//     Animated.spring(confettiScale, { toValue: 1, useNativeDriver: true, friction: 5 }).start(() => {
//       setTimeout(() => {
//         Animated.timing(confettiScale, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setCelebrateVisible(false));
//       }, 900);
//     });
//   }

//   useEffect(() => {
//     if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//       UIManager.setLayoutAnimationEnabledExperimental(true);
//     }
//   }, []);

//   function tryOpenKid(kid: Kid) {
//     setPinTargetId(kid.id);
//     setPinValue('');
//     setPinModalVisible(true);
//   }

//   function verifyPin() {
//     if (!pinTargetId) return;
//     const kid = kids.find((k) => k.id === pinTargetId);
//     if (!kid) return;
//     if (kid.pin === pinValue) {
//       setSelectedKid(kid);
//       setPinModalVisible(false);
//       // Alert.alert('Welcome', `Hello ${kid.name}!`);
//     } else {
//       Alert.alert('Incorrect PIN', 'Try again');
//     }
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.screenContainer}>
//         <View style={styles.headerRow}>
//           <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//             <Text style={styles.backButtonText}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.screenTitle}>{selectedKid ? selectedKid.name : 'Who are you?'}</Text>
//           <View style={styles.backButtonPlaceholder} />
//         </View>

//         {!selectedKid ? (
//           <FlatList
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.kidList}
//             contentContainerStyle={styles.kidListContent}
//             data={kids}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <View style={styles.kidListItem}>
//                 <KidAvatar
//                   item={item}
//                   selected={selectedKid?.id === item.id}
//                   onPress={() => tryOpenKid(item)}
//                 />
//                 <View style={styles.monthlyBadge}>
//                   <Text style={styles.monthlyBadgeText}>
//                     {getMonthlyStars(item.id)}⭐
//                   </Text>
//                 </View>
//               </View>
//             )}
//           />
//         ) : (
//           // <View style={styles.selectedKidCard}>
//           //   <View>
//           //     <Text style={styles.selectedKidLabel}>Current Kid</Text>
//           //     <Text style={styles.selectedKidName}>{selectedKid.name}</Text>
//           //     <Text style={styles.selectedKidStars}>
//           //       {getKidStars(selectedKid.id)} ⭐ total stars
//           //     </Text>
//           //   </View>

//           //   <TouchableOpacity
//           //     style={styles.switchKidBtn}
//           //     onPress={() => setSelectedKid(null)}
//           //   >
//           //     <Text style={styles.switchKidText}>Switch Kid</Text>
//           //   </TouchableOpacity>
//           // </View>
//           //-----------
//           // <View style={styles.selectedKidCard}>
//           //   <KidAvatar
//           //     item={selectedKid}
//           //     selected={true}
//           //     onPress={() => { }}
//           //   />

//           //   <View style={styles.selectedKidInfo}>
//           //     <Text style={styles.selectedKidStars}>
//           //       {getKidStars(selectedKid.id)} ⭐ total stars
//           //     </Text>
//           //   </View>

//           //   <TouchableOpacity
//           //     style={styles.switchKidBtn}
//           //     onPress={() => setSelectedKid(null)}
//           //   >
//           //     <Text style={styles.switchKidText}>Switch</Text>
//           //   </TouchableOpacity>
//           // </View>
//           (() => {
//             const totalBonuses = completions
//               .filter((c) => c.kidId === selectedKid.id && c.isBonus)
//               .reduce((sum, current) => sum + (current.stars || 0), 0);

//             const totalPenalties = completions
//               .filter((c) => c.kidId === selectedKid.id && c.isPenalty)
//               .reduce((sum, current) => sum + (current.stars || 0), 0);

//             return (
//               <View style={styles.selectedKidCardCompact}>
//                 <View style={styles.leftProfileContainer}>
//                   <KidAvatar
//                     item={selectedKid}
//                     selected={true}
//                     onPress={() => { }}
//                   />

//                   {/* Vertical Stack for the Two Lines */}
//                   <View style={styles.compactStatsStackedColumn}>
//                     {/* Line 1: Total Stars */}
//                     <View style={styles.statsInlineRow}>
//                       <View style={styles.statBadgeStars}>
//                         <Text style={styles.statBadgeText}>⭐ {getKidStars(selectedKid.id)} Total</Text>
//                       </View>
//                     </View>

//                     {/* Line 2: Bonuses & Penalties aligned underneath */}
//                     <View style={styles.statsInlineRow}>
//                       <View style={styles.statBadgeBonuses}>
//                         <Text style={styles.statBadgeText}>🎉 +{totalBonuses}</Text>
//                       </View>

//                       {totalPenalties > 0 && (
//                         <View style={styles.statBadgePenalties}>
//                           <Text style={styles.statBadgeText}>⚠️ -{totalPenalties}</Text>
//                         </View>
//                       )}
//                     </View>
//                   </View>
//                 </View>

//                 <TouchableOpacity
//                   style={styles.switchKidBtnCompact}
//                   onPress={() => setSelectedKid(null)}
//                 >
//                   <Text style={styles.switchKidText}>{t('common.switch')}</Text>
//                 </TouchableOpacity>
//               </View>
//             );
//           })()
//         )}

//         {celebrateVisible ? (
//           <Animated.View pointerEvents="none" style={[styles.confettiWrapper, { opacity: confettiScale, transform: [{ scale: confettiScale, }] }]}>
//             <Text style={styles.confettiText}>🎉✨🎉</Text>
//           </Animated.View>
//         ) : null}
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 50 }}
//         >
//           {selectedKid && (
//             <View style={styles.sectionGroup}>
//               <Text style={styles.sectionTitleLarge}>Bonuses</Text>
//               {completions.filter((c) => c.kidId === selectedKid.id && c.isBonus).length === 0 ? (
//                 <View style={styles.emptyRow}><Text style={styles.emptyText}>✨ No bonuses yet </Text></View>
//               ) : (
//                 completions
//                   .filter((c) => c.kidId === selectedKid.id && c.isBonus)
//                   .map((b) => (
//                     <View key={b.id} style={styles.bonusCard}>
//                       <View style={styles.bonusLeft}>
//                         <View style={styles.badge}><Text style={styles.badgeText}>+{b.stars}</Text></View>
//                         <Text style={styles.bonusEmoji}>🎊</Text>
//                       </View>
//                       <View style={styles.cardContent}>
//                         <Text style={styles.cardTitle}>{b.reason || t('kid.no_bonuses')}</Text>
//                         <Text style={styles.cardMeta}>{b.date}</Text>
//                       </View>
//                       <View style={styles.viewOnlyBadge}>
//                         <Text style={styles.viewOnlyText}>{t('common.saved')}</Text>
//                       </View>
//                     </View>
//                   ))
//               )}

//               <Text style={[styles.sectionTitleLarge, styles.sectionSpacing]}>{t('kid.penalties_title')}</Text>
//               {completions.filter((c) => c.kidId === selectedKid.id && c.isPenalty).length === 0 ? (
//                 <View style={styles.emptyRow}><Text style={styles.emptyText}>✅ No penalties. Keep it up!</Text></View>
//               ) : (
//                 completions
//                   .filter((c) => c.kidId === selectedKid.id && c.isPenalty)
//                   .map((p) => (
//                     <View key={p.id} style={styles.penaltyCard}>
//                       <View style={styles.penaltyLeft}>
//                         <View style={styles.penaltyBadge}><Text style={styles.badgeText}>-{p.stars}</Text></View>
//                         <Text style={styles.penaltyEmoji}>⚡</Text>
//                       </View>
//                       <View style={styles.cardContent}>
//                         <Text style={styles.penaltyTitle}>{p.reason || t('kid.oops_reminder')}</Text>
//                         <Text style={styles.cardMeta}>{p.date}</Text>
//                       </View>
//                       <View style={styles.viewOnlyBadge}>
//                         <Text style={styles.viewOnlyText}>{t('common.saved')}</Text>
//                       </View>
//                     </View>
//                   ))
//               )}
//             </View>
//           )}
//           <Text style={styles.sectionHeading}>
//             {selectedKid ? t('kid.tasks') : t('kid.available_tasks')}
//           </Text>
//           <FlatList
//             data={tasks}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => {
//               if (!selectedKid) {
//                 return (
//                   <TouchableOpacity style={styles.taskCardLocked}>
//                     <Text style={styles.taskTitle}>🔒 {item.title}</Text>
//                     <Text style={styles.lockedTaskText}>{t('kid.locked_task_text')}</Text>
//                   </TouchableOpacity>
//                 );
//               }

//               const total = item.subtasks.length;
//               const doneCount = item.subtasks.filter((s) =>
//                 hasCompletedToday(selectedKid.id, item.id, s.id)
//               ).length;
//               // const total = item.subtasks.length;
//               // const doneCount = item.subtasks.filter((s) => hasCompletedToday(selectedKid?.id || '', item.id, s.id)).length;
//               const penaltyTotal = selectedKid
//                 ? completions.filter((c) => c.kidId === selectedKid.id && c.isPenalty).reduce((s, n) => s + (n.stars || 0), 0)
//                 : 0;
//               return (
//                 <View style={[styles.taskCard, { backgroundColor: '#fff' }]}>
//                   <View style={styles.taskHeader}>
//                     <Text style={styles.taskTitle}>{item.title}</Text>
//                     <View style={styles.rightAligned}>
//                       <View style={styles.totalStarsBadge}><Text style={styles.badgeText}>{item.subtasks.reduce((a, b) => a + b.stars, 0)} ⭐</Text></View>
//                     </View>
//                   </View>

//                   <View style={styles.progressWrap}>
//                     <View style={styles.progressBarBg}>
//                       <View style={[styles.progressBarFill, { width: total === 0 ? '0%' : `${Math.round((doneCount / total) * 100)}%` }]} />
//                     </View>
//                     <Text style={styles.progressText}>{doneCount}/{total} done</Text>
//                   </View>

//                   <View style={styles.subtasksRow}>
//                     {item.subtasks.map((st) => {
//                       const done = hasCompletedToday(selectedKid?.id || '', item.id, st.id);
//                       return (
//                         <View key={st.id} style={styles.subtaskRow}>
//                           <View style={[styles.subtaskChip, done ? styles.subtaskDone : styles.subtaskPending]}>
//                             <Text style={styles.subtaskEmoji}>{done ? '🎉' : '⭕'}</Text>
//                             <View style={styles.subtaskDetails}>
//                               <Text style={done ? styles.subtaskTextDone : styles.subtaskTextPending}>{st.title}</Text>
//                               <Text style={styles.subtaskMeta}>{st.stars} ⭐</Text>
//                             </View>
//                           </View>
//                           {selectedKid && (<TouchableOpacity onPress={() => markSubtask(item.id, st.id)} style={[styles.subtaskBtn, done ? styles.subtaskBtnDone : styles.subtaskBtnIdle]}>
//                             <Text style={styles.subtaskBtnText}>{done ? t('kid.marked_symbol') : t('common.mark')}</Text>
//                           </TouchableOpacity>)}
//                         </View>
//                       );
//                     })}
//                   </View>
//                   <View style={styles.taskFooter}>
//                     <View style={styles.footerLeft}>
//                       <View style={styles.footerBadge}>
//                         <Text style={styles.footerBadgeText}>🏆 {item.subtasks.reduce((a, b) => a + b.stars, 0)}</Text>
//                       </View>
//                       <View style={styles.footerInfo}>
//                         <Text style={styles.footerTitle}>{item.title}</Text>
//                         <Text style={styles.footerSmall}>{doneCount}/{total} completed</Text>
//                       </View>
//                     </View>
//                     <View style={styles.footerRight}>
//                       {penaltyTotal > 0 && (
//                         <View style={styles.footerPenaltyCard}>
//                           <Text style={styles.footerPenaltyText}>-{penaltyTotal}</Text>
//                         </View>
//                       )}
//                     </View>
//                   </View>
//                 </View>
//               );
//             }}
//           />
//         </ScrollView>

//         <Modal visible={pinModalVisible} transparent animationType="fade">
//           <View style={styles.modalBack}>
//             <View style={styles.modalCard}>
//               <Text style={styles.modalTitle}>{t('common.enter_pin')}</Text>
//               <TextInput
//                 value={pinValue}
//                 onChangeText={(t) => setPinValue(t.replace(/[^0-9]/g, '').slice(0, 4))}
//                 keyboardType="number-pad"
//                 style={styles.input}
//                 placeholder={t('common.pin_placeholder')}
//                 maxLength={4}
//               />
//               <View style={styles.buttonRow}>
//                 <TouchableOpacity style={[styles.btn, styles.flex1]} onPress={verifyPin}>
//                   <Text style={styles.modalPrimaryText}>{t('common.unlock')}</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.btn, styles.flex1, styles.btnCancel]} onPress={() => setPinModalVisible(false)}>
//                   <Text style={styles.modalSecondaryText}>{t('common.cancel')}</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   modalBack: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
//   modalCard: { margin: 20, backgroundColor: '#fff', padding: 16, borderRadius: 12 },
//   modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
//   input: { borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 8, marginBottom: 8 },
//   btn: { backgroundColor: '#6C63FF', padding: 12, borderRadius: 10 },
//   taskCard: { backgroundColor: '#F1FBFF', padding: 14, borderRadius: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6 },
//   taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//   taskTitle: { fontSize: 18, fontWeight: '700' },
//   taskStars: { color: '#fb8500', fontWeight: '600' },
//   progressText: { color: '#666', fontSize: 12 },
//   totalStarsBadge: { backgroundColor: '#fb8500', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
//   progressWrap: { marginBottom: 10 },
//   progressBarBg: { height: 8, backgroundColor: '#eee', borderRadius: 8, overflow: 'hidden' },
//   progressBarFill: { height: 8, backgroundColor: '#6C63FF', borderRadius: 8 },
//   taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
//   footerLeft: { flexDirection: 'row', alignItems: 'center' },
//   footerBadge: { backgroundColor: '#ffd166', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
//   footerBadgeText: { fontWeight: '700' },
//   footerInfo: { marginLeft: 12 },
//   footerSmall: { color: '#666', fontSize: 12 },
//   footerRight: { alignItems: 'center' },
//   footerPenaltyBadge: { backgroundColor: '#ffccd1', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
//   footerPenaltyText: { color: '#b00020', fontWeight: '700', fontSize: 14 },
//   subtasksRow: { gap: 8 },
//   subtaskRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
//   subtaskChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
//   subtaskDone: { backgroundColor: '#E6F9F0' },
//   subtaskPending: { backgroundColor: '#fff' },
//   subtaskTextDone: { color: '#007f5f', fontWeight: '700' },
//   subtaskTextPending: { color: '#023047', fontWeight: '700' },
//   subtaskStars: { marginLeft: 8, color: '#fb8500', fontWeight: '600' },
//   subtaskBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
//   subtaskBtnDone: { backgroundColor: '#ccc' },
//   subtaskBtnIdle: { backgroundColor: '#06c' },
//   subtaskBtnText: { color: '#fff', fontWeight: '600' },
//   smallUndoBtn: { borderWidth: 1, borderColor: '#e63946', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
//   smallUndoBtnText: { color: '#e63946', fontWeight: '600' },
//   smallUndoBtnBlue: { borderWidth: 1, borderColor: '#6C63FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
//   smallUndoBtnBlueText: { color: '#6C63FF', fontWeight: '600' },
//   cardElevated: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
//   footerPenaltyCard: { backgroundColor: '#fff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, minWidth: 56, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
//   kidList: { marginTop: 12, maxHeight: 130 },
//   kidListContent: { paddingRight: 20, alignItems: 'center' },
//   screenContainer: { flex: 1, padding: 20, backgroundColor: '#FFF8E7' },
//   headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
//   backButton: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e5e5' },
//   backButtonText: { fontWeight: '700', fontSize: 14 },
//   backButtonPlaceholder: { width: 82 },
//   screenTitle: { fontSize: 24, fontWeight: '600', flex: 1, textAlign: 'center' },
//   safeArea: { flex: 1, backgroundColor: '#FFF8E7' },
//   kidListItem: { marginRight: 12 },
//   monthlyBadge: { position: 'absolute', right: -6, top: -6, backgroundColor: '#FFD166', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
//   monthlyBadgeText: { fontWeight: '600' },
//   confettiWrapper: {
//     position: 'absolute', left: 0, right: 0, top: 120, alignItems: 'center',
//     zIndex: 999,
//     elevation: 999,
//   },
//   confettiText: { fontSize: 48 },
//   sectionHeading: { fontSize: 22, marginVertical: 20 },
//   totalStarsInfo: { fontSize: 16, marginBottom: 8 },
//   rightAligned: { alignItems: 'flex-end' },
//   subtaskEmoji: { fontSize: 18 },
//   subtaskDetails: { marginLeft: 10 },
//   subtaskMeta: { color: '#999', fontSize: 12 },
//   footerTitle: { fontWeight: '600' },
//   buttonRow: { flexDirection: 'row', gap: 8 },
//   flex1: { flex: 1 },
//   btnCancel: { backgroundColor: '#ccc' },
//   modalPrimaryText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
//   modalSecondaryText: { textAlign: 'center', fontWeight: '700' },
//   taskCardWhite: { backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6 },
//   taskCardLocked: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },

//   lockedTaskText: {
//     marginTop: 6,
//     color: '#777',
//     fontSize: 13,
//   },
//   selectedKidLabel: {
//     color: '#777',
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   selectedKidName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#222',
//   },
//   selectedKidStars: {
//     marginTop: 4,
//     color: '#fb8500',
//     fontWeight: '600',
//     textTransform: 'capitalize',
//   },
//   switchKidBtn: {
//     backgroundColor: '#6C63FF',
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 14,
//   },
//   selectedKidInfo: {
//     flex: 1,
//     marginLeft: 14,
//   },
//   sectionGroup: {
//     // marginBottom: 20,
//     // gap: 12
//   },
//   sectionTitleLarge: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#2D2D2D',
//     letterSpacing: 0.3
//   },
//   sectionSpacing: {
//     marginTop: 18
//   },
//   bonusCard: {
//     backgroundColor: '#E8F6EF', // Soft mint green background
//     borderWidth: 2,
//     borderColor: '#A3E4D7',
//     padding: 14,
//     borderRadius: 16,
//     marginBottom: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#48C9B0',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 2
//   },
//   bonusLeft: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 6,
//     width: 64,
//     height: 64,
//     borderWidth: 1,
//     borderColor: '#A3E4D7',
//   },
//   badge: {
//     backgroundColor: '#2ecc71', // Bright success green
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   badgeText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 14
//   },
//   bonusEmoji: {
//     fontSize: 20,
//     marginTop: 2
//   },

//   // Optimized Penalty Cards (Warm Amber / Alert Theme)
//   penaltyCard: {
//     backgroundColor: '#FFF2E6', // Soft warm peach/orange background
//     borderWidth: 2,
//     borderColor: '#FED7B7',
//     padding: 14,
//     borderRadius: 16,
//     marginBottom: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#E67E22',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 2
//   },
//   penaltyLeft: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 6,
//     width: 64,
//     height: 64,
//     borderWidth: 1,
//     borderColor: '#FED7B7',
//   },
//   penaltyBadge: {
//     backgroundColor: '#E67E22', // Energetic orange warning (less scary than red)
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   penaltyEmoji: {
//     fontSize: 20,
//     marginTop: 2
//   },
//   cardContent: {
//     flex: 1,
//     marginLeft: 14
//   },
//   cardTitle: {
//     fontWeight: '700',
//     fontSize: 16,
//     color: '#1A5235' // Deep forest green text for readability
//   },
//   penaltyTitle: {
//     fontWeight: '700',
//     fontSize: 16,
//     color: '#7E5109' // Deep brown/amber text for readability
//   },
//   cardMeta: {
//     color: '#7F8C8D',
//     fontSize: 12,
//     marginTop: 3,
//     fontWeight: '600'
//   },

//   viewOnlyBadge: {
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     borderWidth: 1,
//     borderColor: 'rgba(0,0,0,0.05)'
//   },
//   viewOnlyText: {
//     color: '#7F8C8D',
//     fontSize: 11,
//     fontWeight: '700',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5
//   },

//   emptyRow: {
//     paddingVertical: 16,
//     paddingHorizontal: 14,
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     borderWidth: 1,
//     borderStyle: 'dashed',
//     borderColor: '#D5D8DC',
//     alignItems: 'center'
//   },
//   emptyText: {
//     color: '#7F8C8D',
//     fontSize: 14,
//     fontWeight: '600'
//   },
//   selectedKidCard: {
//     backgroundColor: '#fff',
//     borderRadius: 18,
//     padding: 14,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 3,
//   },

//   cardTopRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   cardDivider: {
//     height: 1,
//     backgroundColor: '#F2F4F4',
//     marginVertical: 12,
//   },
//   statsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   selectedKidCardCompact: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     marginBottom: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between', // Keeps Switch button isolated on the right side
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 2,
//   },

//   leftProfileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1, // Takes up remaining left space safely without overlapping button
//   },

//   // Main vertical stack for lines 1 and 2
//   compactStatsStackedColumn: {
//     flexDirection: 'column',
//     justifyContent: 'center',
//     gap: 8, // Space between Line 1 and Line 2
//     marginLeft: 12,
//   },

//   // Horizontal wrapper for individual lines
//   statsInlineRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6, // Space between elements on the same line
//   },

//   statBadgeStars: {
//     backgroundColor: '#FFB703',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//   },

//   statBadgeBonuses: {
//     backgroundColor: '#2ECC71',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//   },

//   statBadgePenalties: {
//     backgroundColor: '#E67E22',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//   },

//   statBadgeText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 12,
//   },

//   switchKidBtnCompact: {
//     backgroundColor: '#6C63FF',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//   },

//   switchKidText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 13,
//   },
// });
//--------------------------------------------------------------------------------------------
// import { t } from '@/lib/i18n';
// import { useRouter } from 'expo-router';
// import { useEffect, useRef, useState } from 'react';
// import { Alert, Animated, FlatList, LayoutAnimation, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import KidAvatar from '../components/KidAvatar';
// import { useKids, type Kid } from '../context/KidContext';

// type TabKey = 'tasks' | 'bonus' | 'penalty';

// // ---- Kid-friendly color palette ----
// const COLORS = {
//   bg: '#FFF8E7',
//   primary: '#6C63FF',
//   primaryLight: '#EDEAFF',
//   secondary: '#FF6B6B',
//   secondaryLight: '#FFE9E9',
//   success: '#06D6A0',
//   successLight: '#E3FBF3',
//   warning: '#FFB703',
//   warningLight: '#FFF3D9',
//   danger: '#FF5D5D',
//   dangerLight: '#FFE8E8',
//   sky: '#4EA8DE',
//   skyLight: '#E6F4FD',
//   text: '#2D2D2D',
//   textMuted: '#8A8F98',
//   white: '#FFFFFF',
// };

// // cycling card colors for variety in lists
// const KID_CARD_COLORS = [COLORS.primaryLight, COLORS.warningLight, COLORS.skyLight, COLORS.successLight, COLORS.secondaryLight];
// const TASK_ACCENT_COLORS = [COLORS.primary, COLORS.sky, COLORS.secondary, COLORS.warning, COLORS.success];

// export default function KidScreen() {
//   const router = useRouter();
//   const { kids, tasks, toggleCompletion, hasCompletedToday, getKidStars, getMonthlyStars, completions, removeCompletion } = useKids();
//   const [selectedKid, setSelectedKid] = useState<Kid | null>(null);

//   // which tab is active once a kid is selected
//   const [activeTab, setActiveTab] = useState<TabKey>('tasks');

//   const [pinModalVisible, setPinModalVisible] = useState(false);
//   const [pinValue, setPinValue] = useState('');
//   const [pinTargetId, setPinTargetId] = useState<string | null>(null);

//   // jump back to the Tasks tab whenever the active kid changes (new kid or logged out)
//   useEffect(() => {
//     setActiveTab('tasks');
//   }, [selectedKid?.id]);

//   // helper functions in this screen: markSubtask below

//   function markSubtask(taskId: string, subtaskId: string) {
//     if (!selectedKid) {
//       Alert.alert(t('kid.select_first'));
//       return;
//     }
//     try {
//       const res = toggleCompletion(selectedKid.id, taskId, subtaskId);
//       if (res && res.added) {
//         // animate layout
//         if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//           UIManager.setLayoutAnimationEnabledExperimental(true);
//         }
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         // check if task now fully completed to celebrate
//         const task = tasks.find((t) => t.id === taskId);
//         const total = task?.subtasks.length || 0;
//         const today = new Date().toISOString().slice(0, 10);
//         const existing = completions.filter((c) => c.kidId === selectedKid.id && c.taskId === taskId && c.date === today).length;
//         const nowDone = existing + 1; // include this new completion
//         // if (nowDone >= total && total > 0) {
//         triggerCelebrate();
//         // }
//         // Alert.alert('Nice!', 'Subtask marked done and stars awarded');
//       } else {
//         Alert.alert('Info', res?.message || 'Already done');
//       }
//     } catch (err) {
//       console.warn('toggleCompletion error', err);
//       Alert.alert('Error', 'Could not mark subtask. Try again.');
//     }
//   }

//   const confettiScale = useRef(new Animated.Value(0)).current;
//   const [celebrateVisible, setCelebrateVisible] = useState(false);

//   function triggerCelebrate() {
//     setCelebrateVisible(true);
//     confettiScale.setValue(0);
//     Animated.spring(confettiScale, { toValue: 1, useNativeDriver: true, friction: 5 }).start(() => {
//       setTimeout(() => {
//         Animated.timing(confettiScale, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setCelebrateVisible(false));
//       }, 900);
//     });
//   }

//   useEffect(() => {
//     if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//       UIManager.setLayoutAnimationEnabledExperimental(true);
//     }
//   }, []);

//   function tryOpenKid(kid: Kid) {
//     setPinTargetId(kid.id);
//     setPinValue('');
//     setPinModalVisible(true);
//   }

//   function verifyPin() {
//     if (!pinTargetId) return;
//     const kid = kids.find((k) => k.id === pinTargetId);
//     if (!kid) return;
//     if (kid.pin === pinValue) {
//       setSelectedKid(kid);
//       setPinModalVisible(false);
//       // Alert.alert('Welcome', `Hello ${kid.name}!`);
//     } else {
//       Alert.alert('Incorrect PIN', 'Try again');
//     }
//   }

//   const pinTargetKid = pinTargetId ? kids.find((k) => k.id === pinTargetId) : null;

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.screenContainer}>
//         <View style={styles.headerRow}>
//           <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//             <Text style={styles.backButtonText}>←</Text>
//           </TouchableOpacity>
//           <View style={styles.headerTitleWrap}>
//             <Text style={styles.screenTitle}>
//               {selectedKid ? `Hi, ${selectedKid.name}! 👋` : "Who's Ready? ✨"}
//             </Text>
//             {!selectedKid && (
//               <Text style={styles.screenSubtitle}>🌈 Tap your avatar to start playing 🎈</Text>
//             )}
//           </View>
//           <View style={styles.backButtonPlaceholder} />
//         </View>

//         {!selectedKid ? (
//           <FlatList
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.kidList}
//             contentContainerStyle={styles.kidListContent}
//             data={kids}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item, index }) => (
//               <TouchableOpacity
//                 activeOpacity={0.85}
//                 style={[styles.kidListItem, { backgroundColor: KID_CARD_COLORS[index % KID_CARD_COLORS.length] }]}
//                 onPress={() => tryOpenKid(item)}
//               >
//                 <View style={styles.kidAvatarRing}>
//                   <KidAvatar
//                     item={item}
//                     selected={selectedKid?.id === item.id}
//                     onPress={() => tryOpenKid(item)}
//                   />
//                 </View>
//                 <View style={styles.monthlyBadge}>
//                   <Text style={styles.monthlyBadgeText}>
//                     {getMonthlyStars(item.id)}⭐
//                   </Text>
//                 </View>
//                 {/* <Text style={styles.kidTapHint}>Tap to play!</Text> */}
//               </TouchableOpacity>
//             )}
//           />
//         ) : (
//           (() => {
//             const totalBonuses = completions
//               .filter((c) => c.kidId === selectedKid.id && c.isBonus)
//               .reduce((sum, current) => sum + (current.stars || 0), 0);

//             const totalPenalties = completions
//               .filter((c) => c.kidId === selectedKid.id && c.isPenalty)
//               .reduce((sum, current) => sum + (current.stars || 0), 0);

//             return (
//               <View style={styles.heroCard}>
//                 <View style={styles.heroDecorStar}><Text style={styles.heroDecorStarText}>✨</Text></View>
//                 <View style={styles.leftProfileContainer}>
//                   <View style={styles.heroAvatarRing}>
//                     <KidAvatar
//                       item={selectedKid}
//                       selected={true}
//                       onPress={() => { }}
//                     />
//                   </View>

//                   <View style={styles.compactStatsStackedColumn}>
//                     <View style={styles.statsInlineRow}>
//                       <View style={styles.statBadgeStars}>
//                         <Text style={styles.statBadgeText}>⭐ {getKidStars(selectedKid.id)} Total</Text>
//                       </View>
//                     </View>

//                     <View style={styles.statsInlineRow}>
//                       <View style={styles.statBadgeBonuses}>
//                         <Text style={styles.statBadgeText}>🎁 +{totalBonuses}</Text>
//                       </View>

//                       {totalPenalties > 0 && (
//                         <View style={styles.statBadgePenalties}>
//                           <Text style={styles.statBadgeText}>⚡ -{totalPenalties}</Text>
//                         </View>
//                       )}
//                     </View>
//                   </View>
//                 </View>

//                 <TouchableOpacity
//                   style={styles.switchKidBtnCompact}
//                   onPress={() => setSelectedKid(null)}
//                 >
//                   <Text style={styles.switchKidText}>🔄 {t('common.switch')}</Text>
//                 </TouchableOpacity>
//               </View>
//             );
//           })()
//         )}

//         {/* Tabs only appear once a kid has been selected */}
//         {selectedKid && (
//           <View style={styles.tabBar}>
//             <TouchableOpacity
//               style={[styles.tabItem, activeTab === 'tasks' && styles.tabItemTasksActive]}
//               onPress={() => setActiveTab('tasks')}
//             >
//               <Text style={[styles.tabText, activeTab === 'tasks' && styles.tabTextActive]}>
//                 📝 {t('kid.tasks')}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.tabItem, activeTab === 'bonus' && styles.tabItemBonusActive]}
//               onPress={() => setActiveTab('bonus')}
//             >
//               <Text style={[styles.tabText, activeTab === 'bonus' && styles.tabTextActive]}>
//                 🎁 Bonus
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.tabItem, activeTab === 'penalty' && styles.tabItemPenaltyActive]}
//               onPress={() => setActiveTab('penalty')}
//             >
//               <Text style={[styles.tabText, activeTab === 'penalty' && styles.tabTextActive]}>
//                 ⚡ {t('kid.penalties_title')}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {celebrateVisible ? (
//           <Animated.View pointerEvents="none" style={[styles.confettiWrapper, { opacity: confettiScale, transform: [{ scale: confettiScale, }] }]}>
//             <Text style={styles.confettiText}>🎉✨🎉</Text>
//           </Animated.View>
//         ) : null}

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 50 }}
//         >
//           {selectedKid && activeTab === 'bonus' && (
//             <View style={styles.sectionGroup}>
//               <Text style={styles.sectionTitleLarge}>🎁 Bonuses</Text>
//               {completions.filter((c) => c.kidId === selectedKid.id && c.isBonus).length === 0 ? (
//                 <View style={styles.emptyRowBonus}>
//                   <Text style={styles.emptyEmoji}>✨</Text>
//                   <Text style={styles.emptyText}>No bonuses yet — keep being awesome!</Text>
//                 </View>
//               ) : (
//                 completions
//                   .filter((c) => c.kidId === selectedKid.id && c.isBonus)
//                   .map((b) => (
//                     <View key={b.id} style={styles.bonusCard}>
//                       <View style={styles.bonusLeft}>
//                         <View style={styles.badge}><Text style={styles.badgeText}>+{b.stars}</Text></View>
//                         <Text style={styles.bonusEmoji}>🎊</Text>
//                       </View>
//                       <View style={styles.cardContent}>
//                         <Text style={styles.cardTitle}>{b.reason || t('kid.no_bonuses')}</Text>
//                         <Text style={styles.cardMeta}>{b.date}</Text>
//                       </View>
//                       <View style={styles.viewOnlyBadgeSuccess}>
//                         <Text style={styles.viewOnlyTextSuccess}>{t('common.saved')}</Text>
//                       </View>
//                     </View>
//                   ))
//               )}
//             </View>
//           )}

//           {selectedKid && activeTab === 'penalty' && (
//             <View style={styles.sectionGroup}>
//               <Text style={styles.sectionTitleLarge}>⚡ {t('kid.penalties_title')}</Text>
//               {completions.filter((c) => c.kidId === selectedKid.id && c.isPenalty).length === 0 ? (
//                 <View style={styles.emptyRowPenalty}>
//                   <Text style={styles.emptyEmoji}>✅</Text>
//                   <Text style={styles.emptyText}>No penalties. Keep it up!</Text>
//                 </View>
//               ) : (
//                 completions
//                   .filter((c) => c.kidId === selectedKid.id && c.isPenalty)
//                   .map((p) => (
//                     <View key={p.id} style={styles.penaltyCard}>
//                       <View style={styles.penaltyLeft}>
//                         <View style={styles.penaltyBadge}><Text style={styles.badgeText}>-{p.stars}</Text></View>
//                         <Text style={styles.penaltyEmoji}>⚡</Text>
//                       </View>
//                       <View style={styles.cardContent}>
//                         <Text style={styles.penaltyTitle}>{p.reason || t('kid.oops_reminder')}</Text>
//                         <Text style={styles.cardMeta}>{p.date}</Text>
//                       </View>
//                       <View style={styles.viewOnlyBadge}>
//                         <Text style={styles.viewOnlyText}>{t('common.saved')}</Text>
//                       </View>
//                     </View>
//                   ))
//               )}
//             </View>
//           )}

//           {(!selectedKid || activeTab === 'tasks') && (
//             <>
//               <Text style={styles.sectionHeading}>
//                 {selectedKid ? `📝 ${t('kid.tasks')}` : `🔐 ${t('kid.available_tasks')}`}
//               </Text>
//               <FlatList
//                 data={tasks}
//                 keyExtractor={(item) => item.id}
//                 renderItem={({ item, index }) => {
//                   if (!selectedKid) {
//                     return (
//                       <View style={styles.taskCardLocked}>
//                         <Text style={styles.lockedEmoji}>🔒</Text>
//                         <View style={{ flex: 1 }}>
//                           <Text style={styles.taskTitle}>{item.title}</Text>
//                           <Text style={styles.lockedTaskText}>{t('kid.locked_task_text')}</Text>
//                         </View>
//                       </View>
//                     );
//                   }

//                   const total = item.subtasks.length;
//                   const doneCount = item.subtasks.filter((s) =>
//                     hasCompletedToday(selectedKid.id, item.id, s.id)
//                   ).length;
//                   const penaltyTotal = selectedKid
//                     ? completions.filter((c) => c.kidId === selectedKid.id && c.isPenalty).reduce((s, n) => s + (n.stars || 0), 0)
//                     : 0;
//                   const pct = total === 0 ? 0 : doneCount / total;
//                   const accentColor = TASK_ACCENT_COLORS[index % TASK_ACCENT_COLORS.length];
//                   const barColor = pct >= 1 ? COLORS.success : accentColor;

//                   return (
//                     <View style={styles.taskCard}>
//                       <View style={[styles.taskAccentBar, { backgroundColor: accentColor }]} />
//                       <View style={styles.taskCardBody}>
//                         <View style={styles.taskHeader}>
//                           <Text style={styles.taskTitle}>{item.title}</Text>
//                           <View style={styles.rightAligned}>
//                             <View style={[styles.totalStarsBadge, { backgroundColor: accentColor }]}>
//                               <Text style={styles.badgeText}>{item.subtasks.reduce((a, b) => a + b.stars, 0)} ⭐</Text>
//                             </View>
//                           </View>
//                         </View>

//                         <View style={styles.progressWrap}>
//                           <View style={styles.progressBarBg}>
//                             <View style={[styles.progressBarFill, { width: total === 0 ? '0%' : `${Math.round(pct * 100)}%`, backgroundColor: barColor }]} />
//                           </View>
//                           <Text style={styles.progressText}>
//                             {pct >= 1 ? '🏆 All done!' : `${doneCount}/${total} done`}
//                           </Text>
//                         </View>

//                         <View style={styles.subtasksRow}>
//                           {item.subtasks.map((st) => {
//                             const done = hasCompletedToday(selectedKid?.id || '', item.id, st.id);
//                             return (
//                               <View key={st.id} style={styles.subtaskRow}>
//                                 <View style={[styles.subtaskChip, done ? styles.subtaskDone : styles.subtaskPending]}>
//                                   <Text style={styles.subtaskEmoji}>{done ? '🎉' : '⭐'}</Text>
//                                   <View style={styles.subtaskDetails}>
//                                     <Text style={done ? styles.subtaskTextDone : styles.subtaskTextPending}>{st.title}</Text>
//                                     <Text style={styles.subtaskMeta}>{st.stars} ⭐</Text>
//                                   </View>
//                                 </View>
//                                 {selectedKid && (
//                                   <TouchableOpacity
//                                     onPress={() => markSubtask(item.id, st.id)}
//                                     style={[styles.subtaskBtn, done ? styles.subtaskBtnDone : styles.subtaskBtnIdle]}
//                                   >
//                                     <Text style={styles.subtaskBtnText}>{done ? '✓' : t('common.mark')}</Text>
//                                   </TouchableOpacity>
//                                 )}
//                               </View>
//                             );
//                           })}
//                         </View>
//                         <View style={styles.taskFooter}>
//                           <View style={styles.footerLeft}>
//                             <View style={[styles.footerBadge, { backgroundColor: accentColor }]}>
//                               <Text style={styles.footerBadgeTextLight}>🏆 {item.subtasks.reduce((a, b) => a + b.stars, 0)}</Text>
//                             </View>
//                             <View style={styles.footerInfo}>
//                               <Text style={styles.footerSmall}>{doneCount}/{total} completed</Text>
//                             </View>
//                           </View>
//                           <View style={styles.footerRight}>
//                             {penaltyTotal > 0 && (
//                               <View style={styles.footerPenaltyCard}>
//                                 <Text style={styles.footerPenaltyText}>-{penaltyTotal}</Text>
//                               </View>
//                             )}
//                           </View>
//                         </View>
//                       </View>
//                     </View>
//                   );
//                 }}
//               />
//             </>
//           )}
//         </ScrollView>

//         <Modal visible={pinModalVisible} transparent animationType="fade">
//           <View style={styles.modalBack}>
//             <View style={styles.modalCard}>
//               {pinTargetKid && (
//                 <View style={styles.modalAvatarWrap}>
//                   <KidAvatar item={pinTargetKid} selected={true} onPress={() => { }} />
//                 </View>
//               )}
//               <Text style={styles.modalTitle}>{t('common.enter_pin')}</Text>

//               <View style={styles.pinDotsRow}>
//                 {[0, 1, 2, 3].map((i) => (
//                   <View key={i} style={[styles.pinDot, pinValue.length > i && styles.pinDotFilled]} />
//                 ))}
//               </View>

//               <TextInput
//                 value={pinValue}
//                 onChangeText={(t) => setPinValue(t.replace(/[^0-9]/g, '').slice(0, 4))}
//                 keyboardType="number-pad"
//                 style={styles.input}
//                 placeholder={t('common.pin_placeholder')}
//                 maxLength={4}
//               />
//               <View style={styles.buttonRow}>
//                 <TouchableOpacity style={[styles.btn, styles.flex1]} onPress={verifyPin}>
//                   <Text style={styles.modalPrimaryText}>🔓 {t('common.unlock')}</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.btn, styles.flex1, styles.btnCancel]} onPress={() => setPinModalVisible(false)}>
//                   <Text style={styles.modalSecondaryText}>{t('common.cancel')}</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: COLORS.bg },
//   screenContainer: { flex: 1, padding: 20, backgroundColor: COLORS.bg },

//   // ---- Header ----
//   headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
//   backButton: {
//     width: 44, height: 44, borderRadius: 22,
//     backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
//     shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3,
//   },
//   backButtonText: { fontWeight: '700', fontSize: 18, color: COLORS.primary },
//   backButtonPlaceholder: { width: 44 },
//   headerTitleWrap: { flex: 1, alignItems: 'center' },
//   screenTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
//   screenSubtitle: { marginTop: 4, fontSize: 13, fontWeight: '600', color: COLORS.textMuted, textAlign: 'center' },

//   // ---- Kid picker list ----
//   kidList: { marginTop: 8, maxHeight: 160 },
//   kidListContent: { paddingRight: 20, paddingTop: 10, alignItems: 'center' },
//   kidListItem: {
//     marginRight: 14, alignItems: 'center', borderRadius: 22, padding: 14, position: 'relative',
//     shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3,
//   },
//   kidAvatarRing: {
//     borderRadius: 999, borderWidth: 3, borderColor: COLORS.white, padding: 2, backgroundColor: COLORS.white,
//     shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
//   },
//   monthlyBadge: { position: 'absolute', right: -2, top: -2, backgroundColor: COLORS.warning, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 12, borderWidth: 2, borderColor: COLORS.white },
//   monthlyBadgeText: { fontWeight: '700', fontSize: 11, color: COLORS.white },
//   kidTapHint: { marginTop: 8, fontSize: 11, fontWeight: '700', color: COLORS.textMuted },

//   // ---- Hero card (selected kid) ----
//   heroCard: {
//     backgroundColor: COLORS.primaryLight,
//     borderRadius: 24,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     marginBottom: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     shadowColor: COLORS.primary,
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 4,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   heroDecorStar: { position: 'absolute', right: 12, top: 8 },
//   heroDecorStarText: { fontSize: 18, opacity: 0.5 },
//   heroAvatarRing: {
//     borderRadius: 999, borderWidth: 4, borderColor: COLORS.white, backgroundColor: COLORS.white,
//     shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
//   },
//   leftProfileContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
//   compactStatsStackedColumn: { flexDirection: 'column', justifyContent: 'center', gap: 8, marginLeft: 14 },
//   statsInlineRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   statBadgeStars: { backgroundColor: COLORS.warning, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 },
//   statBadgeBonuses: { backgroundColor: COLORS.success, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 },
//   statBadgePenalties: { backgroundColor: COLORS.secondary, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 },
//   statBadgeText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
//   switchKidBtnCompact: { backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14 },
//   switchKidText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },

//   // ---- Tabs ----
//   tabBar: {
//     flexDirection: 'row',
//     backgroundColor: COLORS.white,
//     borderRadius: 16,
//     padding: 5,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 3,
//   },
//   tabItem: { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
//   tabItemTasksActive: { backgroundColor: COLORS.primary },
//   tabItemBonusActive: { backgroundColor: COLORS.success },
//   tabItemPenaltyActive: { backgroundColor: COLORS.secondary },
//   tabText: { fontWeight: '600', fontSize: 13, color: COLORS.textMuted },
//   tabTextActive: { color: COLORS.white },

//   // ---- Confetti ----
//   confettiWrapper: { position: 'absolute', left: 0, right: 0, top: 120, alignItems: 'center', zIndex: 999, elevation: 999 },
//   confettiText: { fontSize: 48 },

//   // ---- Section headings ----
//   sectionHeading: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginVertical: 18 },
//   sectionGroup: {},
//   sectionTitleLarge: { fontSize: 17, fontWeight: '600', color: COLORS.text, letterSpacing: 0.2 },
//   sectionSpacing: { marginTop: 18 },
//   rightAligned: { alignItems: 'flex-end' },

//   // ---- Task cards ----
//   taskCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: 18,
//     marginBottom: 14,
//     flexDirection: 'row',
//     overflow: 'hidden',
//     shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
//   },
//   taskAccentBar: { width: 6 },
//   taskCardBody: { flex: 1, padding: 16 },
//   taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
//   taskTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
//   totalStarsBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
//   badge: { backgroundColor: COLORS.success, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
//   badgeText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },

//   progressWrap: { marginBottom: 12 },
//   progressBarBg: { height: 10, backgroundColor: '#EFEFF4', borderRadius: 10, overflow: 'hidden' },
//   progressBarFill: { height: 10, borderRadius: 10 },
//   progressText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700', marginTop: 4 },

//   subtasksRow: { gap: 8 },
//   subtaskRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
//   subtaskChip: { flex: 1, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginRight: 10, borderWidth: 1.5 },
//   subtaskDone: { backgroundColor: COLORS.successLight, borderColor: COLORS.success },
//   subtaskPending: { backgroundColor: '#FAFAFC', borderColor: '#ECECF2' },
//   subtaskTextDone: { color: '#0B8F66', fontWeight: '600' },
//   subtaskTextPending: { color: COLORS.text, fontWeight: '700' },
//   subtaskEmoji: { fontSize: 18 },
//   subtaskDetails: { marginLeft: 10 },
//   subtaskMeta: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
//   subtaskBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
//   subtaskBtnDone: { backgroundColor: COLORS.success },
//   subtaskBtnIdle: { backgroundColor: COLORS.primary },
//   subtaskBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },

//   taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F2F2F6' },
//   footerLeft: { flexDirection: 'row', alignItems: 'center' },
//   footerBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
//   footerBadgeTextLight: { fontWeight: '700', color: COLORS.white, fontSize: 12 },
//   footerInfo: { marginLeft: 12 },
//   footerSmall: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700' },
//   footerRight: { alignItems: 'center' },
//   footerPenaltyCard: { backgroundColor: COLORS.dangerLight, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, minWidth: 56, alignItems: 'center', justifyContent: 'center' },
//   footerPenaltyText: { color: COLORS.danger, fontWeight: '700', fontSize: 14 },

//   // ---- Locked task (no kid selected) ----
//   taskCardLocked: {
//     backgroundColor: COLORS.white,
//     padding: 16,
//     borderRadius: 18,
//     marginBottom: 12,
//     borderWidth: 1.5,
//     borderColor: '#EDEDF2',
//     borderStyle: 'dashed',
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   lockedEmoji: { fontSize: 26 },
//   lockedTaskText: { marginTop: 4, color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },

//   // ---- Bonus cards ----
//   bonusCard: {
//     backgroundColor: COLORS.successLight,
//     borderWidth: 2,
//     borderColor: '#A3E4D7',
//     padding: 14,
//     borderRadius: 18,
//     marginBottom: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#48C9B0',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   bonusLeft: {
//     alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderRadius: 14,
//     padding: 6, width: 64, height: 64, borderWidth: 1, borderColor: '#A3E4D7',
//   },
//   bonusEmoji: { fontSize: 20, marginTop: 2 },

//   // ---- Penalty cards ----
//   penaltyCard: {
//     backgroundColor: COLORS.warningLight,
//     borderWidth: 2,
//     borderColor: '#FED7B7',
//     padding: 14,
//     borderRadius: 18,
//     marginBottom: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#E67E22',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   penaltyLeft: {
//     alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderRadius: 14,
//     padding: 6, width: 64, height: 64, borderWidth: 1, borderColor: '#FED7B7',
//   },
//   penaltyBadge: { backgroundColor: '#E67E22', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
//   penaltyEmoji: { fontSize: 20, marginTop: 2 },

//   cardContent: { flex: 1, marginLeft: 14 },
//   cardTitle: { fontWeight: '700', fontSize: 16, color: '#1A5235' },
//   penaltyTitle: { fontWeight: '700', fontSize: 16, color: '#7E5109' },
//   cardMeta: { color: COLORS.textMuted, fontSize: 12, marginTop: 3, fontWeight: '600' },

//   viewOnlyBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
//   viewOnlyText: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
//   viewOnlyBadgeSuccess: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.85)', borderWidth: 1, borderColor: 'rgba(6,214,160,0.3)' },
//   viewOnlyTextSuccess: { color: '#0B8F66', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },

//   // ---- Empty states ----
//   emptyRowBonus: {
//     paddingVertical: 22, paddingHorizontal: 14, backgroundColor: COLORS.successLight, borderRadius: 18,
//     borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#A3E4D7', alignItems: 'center',
//   },
//   emptyRowPenalty: {
//     paddingVertical: 22, paddingHorizontal: 14, backgroundColor: COLORS.warningLight, borderRadius: 18,
//     borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#FED7B7', alignItems: 'center',
//   },
//   emptyEmoji: { fontSize: 28, marginBottom: 6 },
//   emptyText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '700', textAlign: 'center' },

//   // ---- PIN modal ----
//   modalBack: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)' },
//   modalCard: { margin: 24, backgroundColor: COLORS.white, padding: 22, borderRadius: 24, alignItems: 'center' },
//   modalAvatarWrap: { marginBottom: 8 },
//   modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14, color: COLORS.text },
//   pinDotsRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
//   pinDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#EDEDF2', borderWidth: 2, borderColor: '#E0E0E8' },
//   pinDotFilled: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//   input: { borderWidth: 1.5, borderColor: '#EDEDF2', padding: 12, borderRadius: 12, marginBottom: 10, width: '100%', textAlign: 'center', fontSize: 18, letterSpacing: 4 },
//   buttonRow: { flexDirection: 'row', gap: 10, width: '100%' },
//   flex1: { flex: 1 },
//   btn: { backgroundColor: COLORS.primary, padding: 13, borderRadius: 14 },
//   btnCancel: { backgroundColor: '#EDEDF2' },
//   modalPrimaryText: { color: COLORS.white, textAlign: 'center', fontWeight: '600' },
//   modalSecondaryText: { textAlign: 'center', fontWeight: '700', color: COLORS.textMuted },
// });
//--------------
import { t } from '@/lib/i18n';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, LayoutAnimation, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KidAvatar from '../components/KidAvatar';
import { useKids, type Kid } from '../context/KidContext';

type TabKey = 'tasks' | 'bonus' | 'penalty';

// ---- Kid-friendly color palette ----
const COLORS = {
  bg: '#FFF8E7',
  primary: '#6C63FF',
  primaryLight: '#EDEAFF',
  secondary: '#FF6B6B',
  secondaryLight: '#FFE9E9',
  success: '#06D6A0',
  successLight: '#E3FBF3',
  warning: '#FFB703',
  warningLight: '#FFF3D9',
  danger: '#FF5D5D',
  dangerLight: '#FFE8E8',
  sky: '#4EA8DE',
  skyLight: '#E6F4FD',
  text: '#2D2D2D',
  textMuted: '#8A8F98',
  white: '#FFFFFF',
};

// cycling card colors for variety in lists
const KID_CARD_COLORS = [COLORS.primaryLight, COLORS.warningLight, COLORS.skyLight, COLORS.successLight, COLORS.secondaryLight];
const TASK_ACCENT_COLORS = [COLORS.primary, COLORS.sky, COLORS.secondary, COLORS.warning, COLORS.success];

// ---- Date grouping helper for Bonuses / Penalties ----
type DatedItem = { date: string };

function groupByDate<T extends DatedItem>(items: T[]) {
  const map = new Map<string, T[]>();
  items.forEach((item) => {
    const list = map.get(item.date) || [];
    list.push(item);
    map.set(item.date, list);
  });

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // ISO date strings (YYYY-MM-DD) sort correctly with plain string comparison
  const sortedDates = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));

  return sortedDates.map((date) => {
    let label: string;
    if (date === today) label = 'Today';
    else if (date === yesterday) label = 'Yesterday';
    else label = new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

    return { date, label, items: map.get(date)! };
  });
}

export default function KidScreen() {
  const router = useRouter();
  const { kids, tasks, toggleCompletion, hasCompletedToday, getKidStars, getMonthlyStars, completions } = useKids();
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);

  // which tab is active once a kid is selected
  const [activeTab, setActiveTab] = useState<TabKey>('tasks');

  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinTargetId, setPinTargetId] = useState<string | null>(null);

  // jump back to the Tasks tab whenever the active kid changes (new kid or logged out)
  useEffect(() => {
    setActiveTab('tasks');
  }, [selectedKid?.id]);

  function markSubtask(taskId: string, subtaskId: string) {
    if (!selectedKid) {
      Alert.alert(t('kid.select_first'));
      return;
    }
    try {
      const res = toggleCompletion(selectedKid.id, taskId, subtaskId);
      if (res && res.added) {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
          UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        triggerCelebrate();
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
    } else {
      Alert.alert('Incorrect PIN', 'Try again');
    }
  }

  const pinTargetKid = pinTargetId ? kids.find((k) => k.id === pinTargetId) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.screenTitle}>
              {selectedKid ? `Hi, ${selectedKid.name}! 👋` : "Who's Ready? ✨"}
            </Text>
            {!selectedKid && (
              <Text style={styles.screenSubtitle}>🌈🌤️Tap your avatar to start playing 🎈</Text>
            )}
          </View>
          <View style={styles.backButtonPlaceholder} />
        </View>

        {celebrateVisible ? (
          <Animated.View pointerEvents="none" style={[styles.confettiWrapper, { opacity: confettiScale, transform: [{ scale: confettiScale }] }]}>
            <Text style={styles.confettiText}>🎉✨🎉</Text>
          </Animated.View>
        ) : null}

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {!selectedKid ? (
            <FlatList
              data={kids}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.kidHorizontalList}
              contentContainerStyle={styles.kidGridContent}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.kidProfileCard, { backgroundColor: KID_CARD_COLORS[index % KID_CARD_COLORS.length] }]}
                  onPress={() => tryOpenKid(item)}
                >
                  <View style={styles.kidAvatarCircle}>
                    <Text style={styles.kidAvatarEmoji}>{item.avatar}</Text>
                  </View>
                  <Text style={styles.kidProfileName} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.kidProfileStarsPill}>
                    <Text style={styles.kidProfileStarsText}>{getMonthlyStars(item.id)} ⭐</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            (() => {
              const totalBonuses = completions
                .filter((c) => c.kidId === selectedKid.id && c.isBonus)
                .reduce((sum, current) => sum + (current.stars || 0), 0);

              const totalPenalties = completions
                .filter((c) => c.kidId === selectedKid.id && c.isPenalty)
                .reduce((sum, current) => sum + (current.stars || 0), 0);

              return (
                <View style={styles.heroCard}>
                  <View style={styles.heroDecorStar}><Text style={styles.heroDecorStarText}>✨</Text></View>
                  <View style={styles.leftProfileContainer}>
                    <View style={styles.heroAvatarRing}>
                      <KidAvatar item={selectedKid} selected={true} onPress={() => { }} />
                    </View>

                    <View style={styles.compactStatsStackedColumn}>
                      <View style={styles.statsInlineRow}>
                        <View style={styles.statBadgeStars}>
                          <Text style={styles.statBadgeText}>⭐ {getKidStars(selectedKid.id)} Total</Text>
                        </View>
                      </View>

                      <View style={styles.statsInlineRow}>
                        <View style={styles.statBadgeBonuses}>
                          <Text style={styles.statBadgeText}>🎁 +{totalBonuses}</Text>
                        </View>

                        {totalPenalties > 0 && (
                          <View style={styles.statBadgePenalties}>
                            <Text style={styles.statBadgeText}>⚡ -{totalPenalties}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.switchKidBtnCompact}
                    onPress={() => setSelectedKid(null)}
                  >
                    <Text style={styles.switchKidText}>{t('common.switch')}</Text>
                  </TouchableOpacity>
                </View>
              );
            })()
          )}

          {selectedKid && (
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'tasks' && styles.tabItemTasksActive]}
                onPress={() => setActiveTab('tasks')}
              >
                <Text style={[styles.tabText, activeTab === 'tasks' && styles.tabTextActive]}>
                  {t('kid.tasks')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'bonus' && styles.tabItemBonusActive]}
                onPress={() => setActiveTab('bonus')}
              >
                <Text style={[styles.tabText, activeTab === 'bonus' && styles.tabTextActive]}>
                  🎁 Bonus
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'penalty' && styles.tabItemPenaltyActive]}
                onPress={() => setActiveTab('penalty')}
              >
                <Text style={[styles.tabText, activeTab === 'penalty' && styles.tabTextActive]}>
                  ⚡ {t('kid.penalties_title')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {selectedKid && (
            <>
              {/* Bonus tab — always mounted, hidden when inactive */}
              <View style={{ display: activeTab === 'bonus' ? 'flex' : 'none' }}>
                <View style={styles.sectionGroup}>
                  {(() => {
                    const bonusItems = completions.filter((c) => c.kidId === selectedKid.id && c.isBonus);
                    if (bonusItems.length === 0) {
                      return (
                        <View style={styles.emptyRowBonus}>
                          <Text style={styles.emptyEmoji}>✨</Text>
                          <Text style={styles.emptyText}>No bonuses yet — keep being awesome!</Text>
                        </View>
                      );
                    }
                    return groupByDate(bonusItems).map((group) => (
                      <View key={group.date} style={styles.dateGroup}>
                        <View style={styles.dateGroupHeaderRow}>
                          <Text style={styles.dateGroupLabel}>{group.label}</Text>
                          <View style={styles.dateGroupLine} />
                          <Text style={styles.dateGroupCount}>{group.items.length}</Text>
                        </View>
                        {group.items.map((b) => (
                          <View key={b.id} style={styles.bonusCard}>
                            <View style={styles.bonusLeft}>
                              <View style={styles.badge}><Text style={styles.badgeText}>+{b.stars}</Text></View>
                              <Text style={styles.bonusEmoji}>🎊</Text>
                            </View>
                            <View style={styles.cardContent}>
                              <Text style={styles.cardTitle}>{b.reason || t('kid.no_bonuses')}</Text>
                            </View>
                            <View style={styles.viewOnlyBadgeSuccess}>
                              <Text style={styles.viewOnlyTextSuccess}>{t('common.saved')}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    ));
                  })()}
                </View>
              </View>

              {/* Penalty tab — always mounted, hidden when inactive */}
              <View style={{ display: activeTab === 'penalty' ? 'flex' : 'none' }}>
                <View style={styles.sectionGroup}>
                  {(() => {
                    const penaltyItems = completions.filter((c) => c.kidId === selectedKid.id && c.isPenalty);
                    if (penaltyItems.length === 0) {
                      return (
                        <View style={styles.emptyRowPenalty}>
                          <Text style={styles.emptyEmoji}>✅</Text>
                          <Text style={styles.emptyText}>No penalties. Keep it up!</Text>
                        </View>
                      );
                    }
                    return groupByDate(penaltyItems).map((group) => (
                      <View key={group.date} style={styles.dateGroup}>
                        <View style={styles.dateGroupHeaderRow}>
                          <Text style={styles.dateGroupLabel}>{group.label}</Text>
                          <View style={styles.dateGroupLine} />
                          <Text style={styles.dateGroupCount}>{group.items.length}</Text>
                        </View>
                        {group.items.map((p) => (
                          <View key={p.id} style={styles.penaltyCard}>
                            <View style={styles.penaltyLeft}>
                              <View style={styles.penaltyBadge}><Text style={styles.badgeText}>-{p.stars}</Text></View>
                              <Text style={styles.penaltyEmoji}>⚡</Text>
                            </View>
                            <View style={styles.cardContent}>
                              <Text style={styles.penaltyTitle}>{p.reason || t('kid.oops_reminder')}</Text>
                            </View>
                            <View style={styles.viewOnlyBadge}>
                              <Text style={styles.viewOnlyText}>{t('common.saved')}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    ));
                  })()}
                </View>
              </View>
            </>
          )}

          {/* Tasks tab — always mounted, hidden when a kid is selected but tasks tab not active */}
          {/* <View style={{ display: (!selectedKid || activeTab === 'tasks') ? 'flex' : 'none' }}>
            <>
              {!selectedKid && (
                <Text style={styles.sectionHeading}>
                  🔐 {t('kid.available_tasks')}
                </Text>
              )} */}
          <View style={{ display: (!selectedKid || activeTab === 'tasks') ? 'flex' : 'none' }}>
            <>
              {!selectedKid ? (
                <Text style={styles.sectionHeading}>
                  🔐 {t('kid.available_tasks')}
                </Text>
              ) : (
                // <Text style={styles.sectionHeading}>
                //   {t('kid.tasks')}
                // </Text>
                <></>
              )}
              {tasks.map((item, index) => {
                if (!selectedKid) {
                  return (
                    <View key={item.id} style={styles.taskCardLocked}>
                      <Text style={styles.lockedEmoji}>🔒</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.taskTitle}>{item.title}</Text>
                        <Text style={styles.lockedTaskText}>{t('kid.locked_task_text')}</Text>
                      </View>
                    </View>
                  );
                }

                const total = item.subtasks.length;
                const doneCount = item.subtasks.filter((s) =>
                  hasCompletedToday(selectedKid.id, item.id, s.id)
                ).length;
                const pct = total === 0 ? 0 : doneCount / total;
                const accentColor = TASK_ACCENT_COLORS[index % TASK_ACCENT_COLORS.length];
                const barColor = pct >= 1 ? COLORS.success : accentColor;

                return (
                  <View key={item.id} style={styles.taskCard}>
                    <View style={[styles.taskAccentBar, { backgroundColor: accentColor }]} />
                    <View style={styles.taskCardBody}>
                      <View style={styles.taskHeader}>
                        <Text style={styles.taskTitle}>{item.title}</Text>
                        <View style={styles.rightAligned}>
                          <View style={[styles.totalStarsBadge, { backgroundColor: accentColor }]}>
                            <Text style={styles.badgeText}>{item.subtasks.reduce((a, b) => a + b.stars, 0)} ⭐</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.progressWrap}>
                        <View style={styles.progressBarBg}>
                          <View style={[styles.progressBarFill, { width: total === 0 ? '0%' : `${Math.round(pct * 100)}%`, backgroundColor: barColor }]} />
                        </View>
                        <Text style={styles.progressText}>
                          {pct >= 1 ? '🏆 All done!' : `${doneCount}/${total} done`}
                        </Text>
                      </View>

                      <View style={styles.subtasksRow}>
                        {item.subtasks.map((st) => {
                          const done = hasCompletedToday(selectedKid?.id || '', item.id, st.id);
                          return (
                            <View key={st.id} style={styles.subtaskRow}>
                              <View style={[styles.subtaskChip, done ? styles.subtaskDone : styles.subtaskPending]}>
                                <Text style={styles.subtaskEmoji}>{done ? '🎉' : '⭐'}</Text>
                                <View style={styles.subtaskDetails}>
                                  <Text style={done ? styles.subtaskTextDone : styles.subtaskTextPending}>{st.title}</Text>
                                  <Text style={styles.subtaskMeta}>{st.stars} ⭐</Text>
                                </View>
                              </View>
                              {selectedKid && (
                                <TouchableOpacity
                                  onPress={() => markSubtask(item.id, st.id)}
                                  style={[styles.subtaskBtn, done ? styles.subtaskBtnDone : styles.subtaskBtnIdle]}
                                >
                                  <Text style={styles.subtaskBtnText}>{done ? '✓' : t('common.mark')}</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        })}
                      </View>
                      <View style={styles.taskFooter}>
                        <View style={styles.footerLeft}>
                          <View style={[styles.footerBadge, { backgroundColor: accentColor }]}>
                            <Text style={styles.footerBadgeTextLight}>🏆 {item.subtasks.reduce((a, b) => a + b.stars, 0)}</Text>
                          </View>
                          <View style={styles.footerInfo}>
                            <Text style={styles.footerSmall}>{doneCount}/{total} completed</Text>
                          </View>
                        </View>
                        <View style={styles.footerRight} />
                      </View>
                    </View>
                  </View>
                );
              })}
            </>
          </View>
        </ScrollView>

        <Modal visible={pinModalVisible} transparent animationType="fade">
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              {pinTargetKid && (
                <View style={styles.modalAvatarWrap}>
                  <KidAvatar item={pinTargetKid} selected={true} onPress={() => { }} />
                </View>
              )}
              <Text style={styles.modalTitle}>{t('common.enter_pin')}</Text>

              <View style={styles.pinDotsRow}>
                {[0, 1, 2, 3].map((i) => (
                  <View key={i} style={[styles.pinDot, pinValue.length > i && styles.pinDotFilled]} />
                ))}
              </View>

              <TextInput
                value={pinValue}
                onChangeText={(val) => setPinValue(val.replace(/[^0-9]/g, '').slice(0, 4))}
                keyboardType="number-pad"
                style={styles.input}
                placeholder={t('common.pin_placeholder')}
                maxLength={4}
                autoFocus
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.btn, styles.flex1]} onPress={verifyPin}>
                  <Text style={styles.modalPrimaryText}>🔓 {t('common.unlock')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.flex1, styles.btnCancel]} onPress={() => setPinModalVisible(false)}>
                  <Text style={styles.modalSecondaryText}>{t('common.cancel')}</Text>
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
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  screenContainer: { flex: 1, padding: 20, backgroundColor: COLORS.bg },

  // ---- Header ----
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  backButtonText: { fontWeight: '700', fontSize: 18, color: COLORS.primary },
  backButtonPlaceholder: { width: 44 },
  headerTitleWrap: { flex: 1, alignItems: 'center' },
  screenTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  screenSubtitle: { marginTop: 4, fontSize: 13, fontWeight: '600', color: COLORS.textMuted, textAlign: 'center' },

  // ---- Kid picker grid ----
  kidGridRow: { justifyContent: 'space-between', marginBottom: 14 },
  kidHorizontalList: { height: 132, marginBottom: 14 },
  kidGridContent: { paddingVertical: 6, paddingRight: 4 },
  kidProfileCard: {
    width: 90,
    height: 120,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginRight: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  kidAvatarCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  kidAvatarEmoji: { fontSize: 26 },
  kidProfileInfo: { flex: 1 },
  kidProfileName: { fontSize: 12, fontWeight: '600', color: COLORS.text, marginBottom: 5, textAlign: 'center' },
  kidProfileStarsPill: { backgroundColor: 'rgba(255,255,255,0.75)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  kidProfileStarsText: { fontWeight: '700', fontSize: 10, color: COLORS.text },

  // ---- Hero card (selected kid) ----
  heroCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  heroDecorStar: { position: 'absolute', right: 12, top: 8 },
  heroDecorStarText: { fontSize: 18, opacity: 0.5 },
  heroAvatarRing: {
    borderRadius: 999, borderWidth: 4, borderColor: COLORS.white, backgroundColor: COLORS.white,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  leftProfileContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  compactStatsStackedColumn: { flexDirection: 'column', justifyContent: 'center', gap: 8, marginLeft: 14 },
  statsInlineRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statBadgeStars: { backgroundColor: COLORS.warning, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 },
  statBadgeBonuses: { backgroundColor: COLORS.success, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 },
  statBadgePenalties: { backgroundColor: COLORS.secondary, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 },
  statBadgeText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
  switchKidBtnCompact: { backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14 },
  switchKidText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },

  // ---- Tabs ----
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 5,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tabItem: { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tabItemTasksActive: { backgroundColor: COLORS.primary },
  tabItemBonusActive: { backgroundColor: COLORS.success },
  tabItemPenaltyActive: { backgroundColor: COLORS.secondary },
  tabText: { fontWeight: '600', fontSize: 13, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.white },

  // ---- Confetti ----
  confettiWrapper: { position: 'absolute', left: 0, right: 0, top: 120, alignItems: 'center', zIndex: 999, elevation: 999 },
  confettiText: { fontSize: 48 },

  // ---- Section headings ----
  sectionHeading: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginVertical: 18 },
  sectionGroup: {},
  sectionTitleLarge: { fontSize: 17, fontWeight: '600', color: COLORS.text, letterSpacing: 0.2 },
  sectionSpacing: { marginTop: 18 },
  rightAligned: { alignItems: 'flex-end' },

  // ---- Date group headers (Bonus / Penalty lists) ----
  dateGroup: { marginBottom: 18 },
  dateGroupHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  dateGroupLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 },
  dateGroupLine: { flex: 1, height: 1, backgroundColor: '#ECECF2' },
  dateGroupCount: {
    fontSize: 11, fontWeight: '600', color: COLORS.textMuted,
    backgroundColor: '#F2F2F6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },

  // ---- Task cards ----
  taskCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  taskAccentBar: { width: 6 },
  taskCardBody: { flex: 1, padding: 16 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  taskTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  totalStarsBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
  badge: { backgroundColor: COLORS.success, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },

  progressWrap: { marginBottom: 12 },
  progressBarBg: { height: 10, backgroundColor: '#EFEFF4', borderRadius: 10, overflow: 'hidden' },
  progressBarFill: { height: 10, borderRadius: 10 },
  progressText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700', marginTop: 4 },

  subtasksRow: { gap: 8 },
  subtaskRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  subtaskChip: { flex: 1, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginRight: 10, borderWidth: 1.5 },
  subtaskDone: { backgroundColor: COLORS.successLight, borderColor: COLORS.success },
  subtaskPending: { backgroundColor: '#FAFAFC', borderColor: '#ECECF2' },
  subtaskTextDone: { color: '#0B8F66', fontWeight: '600' },
  subtaskTextPending: { color: COLORS.text, fontWeight: '700' },
  subtaskEmoji: { fontSize: 18 },
  subtaskDetails: { marginLeft: 10 },
  subtaskMeta: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  subtaskBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  subtaskBtnDone: { backgroundColor: COLORS.success },
  subtaskBtnIdle: { backgroundColor: COLORS.primary },
  subtaskBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },

  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F2F2F6' },
  footerLeft: { flexDirection: 'row', alignItems: 'center' },
  footerBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
  footerBadgeTextLight: { fontWeight: '700', color: COLORS.white, fontSize: 12 },
  footerInfo: { marginLeft: 12 },
  footerSmall: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700' },
  footerRight: { alignItems: 'center' },
  footerPenaltyCard: { backgroundColor: COLORS.dangerLight, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, minWidth: 56, alignItems: 'center', justifyContent: 'center' },
  footerPenaltyText: { color: COLORS.danger, fontWeight: '700', fontSize: 14 },

  // ---- Locked task (no kid selected) ----
  taskCardLocked: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#EDEDF2',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lockedEmoji: { fontSize: 26 },
  lockedTaskText: { marginTop: 4, color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },

  // ---- Bonus cards ----
  bonusCard: {
    backgroundColor: COLORS.successLight,
    borderWidth: 2,
    borderColor: '#A3E4D7',
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#48C9B0',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  bonusLeft: {
    alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderRadius: 14,
    padding: 6, width: 64, height: 64, borderWidth: 1, borderColor: '#A3E4D7',
  },
  bonusEmoji: { fontSize: 20, marginTop: 2 },

  // ---- Penalty cards ----
  penaltyCard: {
    backgroundColor: COLORS.warningLight,
    borderWidth: 2,
    borderColor: '#FED7B7',
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#E67E22',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  penaltyLeft: {
    alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderRadius: 14,
    padding: 6, width: 64, height: 64, borderWidth: 1, borderColor: '#FED7B7',
  },
  penaltyBadge: { backgroundColor: '#E67E22', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  penaltyEmoji: { fontSize: 20, marginTop: 2 },

  cardContent: { flex: 1, marginLeft: 14 },
  cardTitle: { fontWeight: '700', fontSize: 16, color: '#1A5235' },
  penaltyTitle: { fontWeight: '700', fontSize: 16, color: '#7E5109' },
  cardMeta: { color: COLORS.textMuted, fontSize: 12, marginTop: 3, fontWeight: '600' },

  viewOnlyBadge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  viewOnlyText: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  viewOnlyBadgeSuccess: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.85)', borderWidth: 1, borderColor: 'rgba(6,214,160,0.3)' },
  viewOnlyTextSuccess: { color: '#0B8F66', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },

  // ---- Empty states ----
  emptyRowBonus: {
    paddingVertical: 22, paddingHorizontal: 14, backgroundColor: COLORS.successLight, borderRadius: 18,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#A3E4D7', alignItems: 'center',
  },
  emptyRowPenalty: {
    paddingVertical: 22, paddingHorizontal: 14, backgroundColor: COLORS.warningLight, borderRadius: 18,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#FED7B7', alignItems: 'center',
  },
  emptyEmoji: { fontSize: 28, marginBottom: 6 },
  emptyText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '700', textAlign: 'center' },

  // ---- PIN modal ----
  modalBack: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)' },
  modalCard: { margin: 24, backgroundColor: COLORS.white, padding: 22, borderRadius: 24, alignItems: 'center' },
  modalAvatarWrap: { marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14, color: COLORS.text },
  pinDotsRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  pinDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#EDEDF2', borderWidth: 2, borderColor: '#E0E0E8' },
  pinDotFilled: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  input: { borderWidth: 1.5, borderColor: '#EDEDF2', padding: 12, borderRadius: 12, marginBottom: 10, width: '100%', textAlign: 'center', fontSize: 18, letterSpacing: 4 },
  buttonRow: { flexDirection: 'row', gap: 10, width: '100%' },
  flex1: { flex: 1 },
  btn: { backgroundColor: COLORS.primary, padding: 13, borderRadius: 14 },
  btnCancel: { backgroundColor: '#EDEDF2' },
  modalPrimaryText: { color: COLORS.white, textAlign: 'center', fontWeight: '600' },
  modalSecondaryText: { textAlign: 'center', fontWeight: '700', color: COLORS.textMuted },
});