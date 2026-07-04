import { auth, db } from "@/lib/firebase/config";
import { t } from "@/lib/i18n";
import { router, useLocalSearchParams } from "expo-router";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  FlatList,
  LayoutAnimation,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { useKids } from "../context/KidContext";
// import { useWithLoading } from "../context/LoadingContext";
import { capitalizeWords } from "../utils/textUtils";
import { alertNetworkError, checkInternet, isNetworkError } from "../utils/netUtils";

export default function ParentDashboard() {
  // const {
  //   kids,
  //   addKid,
  //   updateKid,
  //   removeKid,
  //   tasks,
  //   addTask,
  //   completions,
  //   competitions,
  //   removeCompletion,
  //   getMonthlyStars,
  //   addBonus,
  //   addPenalty,
  //   resetCompetition,
  //   getKidStars,
  // } = useKids();

  const {
    kids,
    addKid,
    updateKid,
    removeKid,
    tasks,
    addTask,
    updateTask,
    removeTask,
    completions,
    competitions,
    removeCompletion,
    getMonthlyStars,
    addBonus,
    addPenalty,
    resetCompetition,
    getKidStars,
  } = useKids();
  const [modalVisible, setModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🧒");
  const [pin, setPin] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [subtasks, setSubtasks] = useState<{ title: string; stars: string }[]>([]);

  const { from } = useLocalSearchParams();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [parentPinInput, setParentPinInput] = useState("");
  const [setupPin, setSetupPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const appState = useRef(AppState.currentState);
  const authPinInputRef = useRef<TextInput>(null);
  const [setupConfirmPin, setSetupConfirmPin] = useState("");
  const [parentPin, setParentPin] = useState<string | null>(null);
  const [parentPinLoading, setParentPinLoading] = useState(true);
  const [resetPinModalVisible, setResetPinModalVisible] = useState(false);

  const [bonusModalVisible, setBonusModalVisible] = useState(false);
  const [bonusKidId, setBonusKidId] = useState<string | null>(null);
  const [bonusStars, setBonusStars] = useState("1");
  const [bonusReason, setBonusReason] = useState("");
  const [penaltyModalVisible, setPenaltyModalVisible] = useState(false);
  const [penaltyKidId, setPenaltyKidId] = useState<string | null>(null);
  const [penaltyStars, setPenaltyStars] = useState("1");
  const [penaltyReason, setPenaltyReason] = useState("");
  const [penaltyAttachTaskId, setPenaltyAttachTaskId] = useState<string | null>(
    null,
  );
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackActionLabel] = useState<string | undefined>("Undo");
  const [lastPenalty, setLastPenalty] = useState<{
    kidId: string;
    subtaskId: string;
    taskId?: string;
  } | null>(null);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [editTaskModalVisible, setEditTaskModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [forgotPinModalVisible, setForgotPinModalVisible] = useState(false);
  const [parentPassword, setParentPassword] = useState("");
  const [editSubtasks, setEditSubtasks] = useState<
    { title: string; stars: string }[]
  >([]);

  // Kid PIN reset states
  const [kidPinModalVisible, setKidPinModalVisible] = useState(false);
  const [kidToResetId, setKidToResetId] = useState<string | null>(null);
  const [kidPinInput, setKidPinInput] = useState("");

  // Kid edit states
  const [editKidModalVisible, setEditKidModalVisible] = useState(false);
  const [editingKidId, setEditingKidId] = useState<string | null>(null);
  const [editKidName, setEditKidName] = useState("");
  const [editKidAvatar, setEditKidAvatar] = useState("🧒");

  function handleEditKid() {
    if (!editingKidId) return;
    if (!editKidName.trim()) {
      Alert.alert("Validation", "Name cannot be empty.");
      return;
    }
    const kid = kids.find((k) => k.id === editingKidId);
    if (!kid) return;
    updateKid({ ...kid, name: editKidName.trim(), avatar: editKidAvatar });
    setEditKidModalVisible(false);
    setEditingKidId(null);
    setEditKidName("");
    setEditKidAvatar("🧒");
  }

  function handleAdd() {
    if (!name.trim() || pin.length !== 4 || !/^[0-9]{4}$/.test(pin)) {
      Alert.alert("Validation", "Enter name and a 4-digit numeric PIN");
      return;
    }

    addKid({ name: name.trim(), avatar, pin });
    setName("");
    setPin("");
    setAvatar("🧒");
    setModalVisible(false);
  }

  function handleAddTask() {
    if (!taskTitle.trim()) {
      Alert.alert("Validation", "Enter a task title");
      return;
    }

    const cleaned = subtasks.map((s) => ({
      title: s.title.trim() || "Subtask",
      stars: Number(s.stars) || 1,
    }));
    addTask({ title: taskTitle.trim(), subtasks: cleaned });
    setTaskTitle("");
    setSubtasks([{ title: "Subtask 1", stars: "1" }]);
    setTaskModalVisible(false);
  }

  async function verifyParentPasswordForPinReset() {
    const currentUser = auth.currentUser;

    if (!currentUser?.email) {
      Alert.alert(t('parentDashboard.error_parent_email_not_found'));
      return;
    }

    if (!parentPassword.trim()) {
      Alert.alert(t('parentDashboard.validation_enter_password'));
      return;
    }

    if (!(await checkInternet())) return;

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        parentPassword
      );

      await reauthenticateWithCredential(currentUser, credential);

      setForgotPinModalVisible(false);
      setParentPassword("");
      setSetupPin("");
      setSetupConfirmPin("");
      setResetPinModalVisible(true);
    } catch (error: any) {
      console.error("Reauthentication failed:", error);
      if (isNetworkError(error)) {
        alertNetworkError();
      } else {
        Alert.alert(t('parentDashboard.incorrect_password'), t('parentDashboard.incorrect_password_msg'));
      }
    }
  }

  function openEditTaskModal(task: any) {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditSubtasks(
      task.subtasks.map((st: any) => ({
        title: st.title,
        stars: String(st.stars),
      })),
    );
    setEditTaskModalVisible(true);
  }


  function handleEditTask() {
    if (!editingTaskId) return;

    if (!editTaskTitle.trim() || editSubtasks.length === 0) {
      Alert.alert("Validation", "Enter task title and at least one subtask");
      return;
    }

    const cleanedSubtasks = editSubtasks.map((s, index) => ({
      id: `${editingTaskId}_subtask_${index + 1}`,
      title: s.title.trim() || "Subtask",
      stars: Number(s.stars) || 1,
    }));

    updateTask(editingTaskId, {
      title: editTaskTitle.trim(),
      subtasks: cleanedSubtasks,
    });

    setEditTaskModalVisible(false);
    setEditingTaskId(null);
    setEditTaskTitle("");
    setEditSubtasks([]);

    Alert.alert("Success", "Task updated successfully.");
  }


  function handleDeleteTask(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeTask(taskId);
            Alert.alert("Deleted", "Task deleted successfully.");
          },
        },
      ],
    );
  }

  function getBonusCount(kidId: string) {
    return completions.filter((c) => c.kidId === kidId && c.isBonus).length;
  }

  function getPenaltyCount(kidId: string) {
    return completions.filter((c) => c.kidId === kidId && c.isPenalty)
      .length;
  }
  useEffect(() => {
    const loadParentPin = async () => {
      const currentUser = auth.currentUser;

      try {
        if (currentUser) {
          const docRef = doc(db, "parents", currentUser.uid);
          const docSnap = await getDoc(docRef);
          const data = docSnap.exists() ? docSnap.data() : {};
          setParentPin(data?.parentPin ?? "");
        } else {
          setParentPin("");
        }
      } catch (error) {
        console.error("Error loading parent PIN:", error);
        setParentPin("");
      } finally {
        setParentPinLoading(false);
        setRequiresAuth(true);
        setAuthModalVisible(true);
      }
    };

    loadParentPin();
  }, []);
  // useEffect(() => {
  //   const loadParentPin = async () => {
  //     const currentUser = auth.currentUser;
  //     if (!currentUser) {
  //       setParentPinLoading(false);
  //       return;
  //     }

  //     try {
  //       const docRef = doc(db, "parents", currentUser.uid);
  //       const docSnap = await getDoc(docRef);
  //       const data = docSnap.exists() ? docSnap.data() : {};
  //       setParentPin(data?.parentPin ?? "");
  //     } catch (error) {
  //       console.error("Error loading parent PIN:", error);
  //       setParentPin("");
  //     } finally {
  //       setParentPinLoading(false);
  //     }
  //   };

  //   setRequiresAuth(from === "index");
  //   loadParentPin();
  // }, []);

  useEffect(() => {
    if (requiresAuth && !authenticated) {
      setAuthModalVisible(true);
    }
  }, [requiresAuth, authenticated]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        if (requiresAuth) {
          setAuthenticated(false);
          setAuthModalVisible(true);
        }
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [requiresAuth]);

  // auth modal visibility is controlled on mount and by auth actions

  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  function verifyParentPin() {
    if (!parentPin) {
      return;
    }

    if (parentPinInput === parentPin) {
      setAuthenticated(true);
      setAuthModalVisible(false);
      setParentPinInput("");
    } else {
      Alert.alert("Incorrect PIN");
    }
  }

  async function saveParentPin() {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    if (!/^[0-9]{4}$/.test(setupPin)) {
      Alert.alert("Validation", "PIN must be exactly 4 digits.");
      return;
    }

    if (setupPin !== setupConfirmPin) {
      Alert.alert("Validation", "PINs do not match.");
      return;
    }

    if (!(await checkInternet())) return;

    try {
      await setDoc(
        doc(db, "parents", currentUser.uid),
        { parentPin: setupPin },
        { merge: true },
      );
      setParentPin(setupPin);
      setAuthenticated(true);
      setAuthModalVisible(false);
      setResetPinModalVisible(false);
      setSetupPin("");
      setSetupConfirmPin("");
      setParentPinInput("");
      Alert.alert("Success", "Parent PIN has been set.");
    } catch (error: any) {
      console.error("Error saving parent PIN:", error);
      if (isNetworkError(error)) { alertNetworkError(); } else { Alert.alert("Save failed", "Unable to save PIN. Please try again."); }
    }
  }

  async function saveKidPin() {
    if (!kidToResetId) return;
    if (!/^[0-9]{4}$/.test(kidPinInput)) {
      Alert.alert("Validation", "Enter a 4-digit numeric PIN");
      return;
    }
    const kid = kids.find((k) => k.id === kidToResetId);
    if (!kid) {
      Alert.alert("Error", "Kid not found");
      return;
    }

    try {
      updateKid({ ...kid, pin: kidPinInput });
      setKidPinModalVisible(false);
      setKidToResetId(null);
      setKidPinInput("");
      Alert.alert("Success", `PIN reset for ${kid.name}`);
    } catch (error) {
      console.error("Error resetting kid PIN", error);
      Alert.alert("Error", "Unable to reset PIN. Please try again.");
    }
  }

  const topKid =
    kids.length > 0
      ? kids.reduce((top, kid) =>
        getMonthlyStars(kid.id) > getMonthlyStars(top.id) ? kid : top
      )
      : null;

  const topKidStars = topKid ? getMonthlyStars(topKid.id) : 0;

  const maxStars =
    kids.length > 0
      ? Math.max(...kids.map((kid) => getMonthlyStars(kid.id)))
      : 0;

  const topKids =
    maxStars > 0
      ? kids.filter((kid) => getMonthlyStars(kid.id) === maxStars)
      : [];

  const topKidNames =
    topKids.length > 0
      ? topKids.map((kid) => capitalizeWords(kid.name)).join(", ")
      : "No Winner";

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScreenHeader
        title="Parent Dashboard"
        rightButton={{
          icon: "person-circle",
          onPress: () =>
            router.push("/screens/ParentProfileScreen?fromParentDashboard=1"),
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.headerCard}>
          <Text style={styles.subtitle}>Manage kids, tasks and rewards</Text>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryTile, { backgroundColor: '#EDEAFF' }]}>
              <Text style={styles.tileNumber}>{kids.length}</Text>
              <Text style={styles.tileLabel}>Kids</Text>
            </View>
            <View style={[styles.summaryTile, { backgroundColor: '#FFF3DC' }]}>
              <Text style={styles.tileNumber}>{tasks.length}</Text>
              <Text style={styles.tileLabel}>Tasks</Text>
            </View>
            {/* <View style={styles.summaryTile}>
              <Text style={styles.tileNumber}>
                {topKid ? `${topKidStars}⭐` : "0⭐"}
              </Text>
              <Text style={styles.tileLabel}>
                {topKid ? capitalizeWords(topKid.name) : "No Winner"}
              </Text>
            </View> */}
            <View style={[styles.summaryTile, { backgroundColor: '#E3FBF3' }]}>
              <Text style={styles.tileNumber}>{maxStars}⭐</Text>
              <Text style={styles.tileLabel} numberOfLines={2}>
                {topKidNames}
              </Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.primaryBtn, { flex: 1 }]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.primaryBtnText}>＋ Add Kid</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ghostBtn, { flex: 1 }]}
              onPress={() => setTaskModalVisible(true)}
            >
              <Text style={styles.ghostBtnText}>＋ Add Task</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.ghostBtn, { marginTop: 12 }]}
            onPress={() => setResetPinModalVisible(true)}
          >
            <Text style={styles.ghostBtnText}>Reset Parent Passcode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              { backgroundColor: "#f17f0da4", marginTop: 12 },
            ]}
            onPress={() => {
              const hasActiveCompetition =
                completions.length > 0 ||
                kids.some((kid) => getKidStars(kid.id) > 0);

              if (!hasActiveCompetition) {
                Alert.alert(
                  "No Active Competition",
                  "There is no ongoing competition at the moment. "
                );
                return;
              }

              setResetModalVisible(true);
            }}
          >
            <Text style={styles.primaryBtnText}>🏆 End Competition</Text>
          </TouchableOpacity>
        </View>

        {kids.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Kids</Text>
            <FlatList
              data={kids}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => {
                const displayName = item.name?.trim()
                  ? capitalizeWords(item.name.trim())
                  : `Kid ${item.id}`;
                const bonusCount = getBonusCount(item.id);
                const penaltyCount = getPenaltyCount(item.id);

                return (
                  <View style={styles.kidCard}>
                    <View style={styles.kidHeaderRow}>
                      <View style={styles.kidAvatarBg}><Text style={styles.kidAvatar}>{item.avatar}</Text></View>
                      <View style={styles.kidNameContainer}>
                        <Text style={styles.kidNameLabel}>Name</Text>
                        <Text
                          style={styles.kidName}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {displayName}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.kidStatsGrid}>
                      <View style={styles.kidStatBlock}>
                        <Text style={styles.kidStatLabel}>Stars this month</Text>
                        <Text style={styles.kidStatValue}>
                          {getMonthlyStars(item.id)} ⭐
                        </Text>
                      </View>
                      <View style={styles.kidStatBlock}>
                        <Text style={styles.kidStatLabel}>Bonuses</Text>
                        <Text style={styles.kidStatValue}>{bonusCount}</Text>
                      </View>
                      <View style={styles.kidStatBlock}>
                        <Text style={styles.kidStatLabel}>Penalties</Text>
                        <Text style={styles.kidStatValue}>{penaltyCount}</Text>
                      </View>
                    </View>
                    <View style={styles.kidActions}>
                      <TouchableOpacity
                        style={styles.smallEditBtn}
                        onPress={() => {
                          setEditingKidId(item.id);
                          setEditKidName(item.name);
                          setEditKidAvatar(item.avatar);
                          setEditKidModalVisible(true);
                        }}
                      >
                        <Text style={styles.smallEditBtnText}>✏️ Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.smallPrimaryBtn}
                        onPress={() => {
                          setBonusKidId(item.id);
                          setBonusModalVisible(true);
                        }}
                      >
                        <Text style={styles.smallPrimaryBtnText}>＋ Bonus</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.smallPenaltyBtn}
                        onPress={() => {
                          setPenaltyKidId(item.id);
                          setPenaltyModalVisible(true);
                        }}
                      >
                        <Text style={styles.smallPenaltyBtnText}>⚠️ Penalty</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.smallResetPinBtn}
                        onPress={() => {
                          setKidToResetId(item.id);
                          setKidPinInput(item.pin || "");
                          setKidPinModalVisible(true);
                        }}
                      >
                        <Text style={styles.smallResetPinBtnText}>🔒 Reset PIN</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.smallDeleteBtn}
                        onPress={() => {
                          Alert.alert(
                            "Delete Kid",
                            `Are you sure you want to delete ${displayName}? This action cannot be undone.`,
                            [
                              { text: "Cancel", style: "cancel" },
                              {
                                text: "Delete",
                                style: "destructive",
                                onPress: () => removeKid(item.id),
                              },
                            ],
                          );
                        }}
                      >
                        <Text style={styles.smallDeleteBtnText}>🗑️ Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        )}

        {tasks.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Tasks</Text>
            <FlatList
              data={tasks}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <View style={styles.taskCard}>
                  <View style={styles.taskAccentBar} />
                  <View style={styles.taskCardBody}>
                    <View style={styles.taskHeaderRow}>
                      <Text style={styles.taskTitleText}>
                        {item.title}
                      </Text>
                      <View style={styles.actionButtonRow}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => openEditTaskModal(item)}
                        >
                          <Text style={styles.editDeleteButtonText}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: "#d32f2f" }]}
                          onPress={() => handleDeleteTask(item.id)}
                        >
                          <Text style={styles.editDeleteButtonText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.subtaskCountText}>
                      {item.subtasks.length} subtasks
                    </Text>
                    <View style={styles.subtasksRow}>
                      {item.subtasks.map((st) => (
                        <View key={st.id} style={styles.subtaskChip}>
                          <Text style={styles.subtaskTitleText}>
                            {st.title}
                          </Text>
                          <Text style={styles.subtaskStarText}>
                            {st.stars}⭐
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        )}

        {completions.length > 0 && (
          <>
            <Text style={[styles.section, { marginTop: 12 }]}>Today's Completions</Text>
            {(() => {
              const today = new Date().toISOString().slice(0, 10);
              const todayComps = completions.filter((c) => c.date === today);
              if (todayComps.length === 0) {
                return (
                  <View style={styles.todayCompletionPlaceholder}>
                    <Text style={styles.emptyStateText}>
                      No completions yet today.
                    </Text>
                  </View>
                );
              }

              const groupedKids = new Set(todayComps.map((c) => c.kidId));
              const uniqueKids = Array.from(groupedKids).map((kidId) => {
                const kid = kids.find((k) => k.id === kidId);
                const completionCount = todayComps.filter(
                  (c) => c.kidId === kidId,
                ).length;
                return { kid, kidId, completionCount };
              });

              return (
                <FlatList
                  data={uniqueKids}
                  keyExtractor={(item) => item.kidId}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.todayKidCard}
                      onPress={() =>
                        router.push(
                          `/screens/KidDetailsScreen?kidId=${item.kidId}`,
                        )
                      }
                    >
                      <View style={styles.todayKidRow}>
                        <Text style={styles.todayKidAvatar}>
                          {item.kid?.avatar}
                        </Text>
                        <View style={styles.todayKidInfoContainer}>
                          <Text style={styles.todayKidName}>
                            {item.kid?.name}
                          </Text>
                          <Text style={styles.completionCountText}>
                            {item.completionCount} completion(s) today
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.viewDetailsText}>
                        View Details →
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              );
            })()}
          </>
        )}

        {competitions.length > 0 && (
          <>
            <Text style={[styles.section, { marginTop: 12 }]}>Past Competitions</Text>
            <FlatList
              data={competitions.slice(-3)}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.competitionCard}>
                  <View style={styles.competitionHeaderRow}>
                    <Text style={styles.competitionTitle}>
                      {new Date(item.startDate).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })} Competition
                    </Text>
                    <Text style={styles.competitionDate}>
                      {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                    </Text>
                  </View>
                  {item.winner && (
                    <View style={styles.winnerInfoContainer}>
                      <Text style={styles.winnerText}>
                        🏆 Winner: {item.winner.name}
                      </Text>
                      {item.secondPlace && (
                        <Text style={styles.secondPlaceText}>
                          🥈 2nd: {item.secondPlace.name}
                        </Text>
                      )}
                    </View>
                  )}
                  <Text style={styles.rankingsText}>
                    Rankings: {item.rankings.slice(0, 3).map((r) => `${r.name} (${r.stars}⭐)`).join(", ")}
                    {item.rankings.length > 3 && ` +${item.rankings.length - 3} more`}
                  </Text>
                </View>
              )}
            />
          </>
        )}

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add Kid</Text>
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Avatar (emoji)"
                value={avatar}
                onChangeText={setAvatar}
                style={styles.input}
              />
              <TextInput
                placeholder="4-digit PIN"
                value={pin}
                onChangeText={(t) => setPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
                keyboardType="number-pad"
                style={styles.input}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1 }]}
                  onPress={handleAdd}
                >
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#ccc" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.btnText, { color: "#000" }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={taskModalVisible} transparent animationType="slide">
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add Task</Text>
              <TextInput
                placeholder="Task title"
                value={taskTitle}
                onChangeText={setTaskTitle}
                style={styles.input}
              />
              {subtasks.map((subtask, index) => (
                <View key={index} style={styles.subtaskInputRow}>
                  <TextInput
                    placeholder={`Subtask ${index + 1}`}
                    value={subtask.title}
                    onChangeText={(value) => {
                      const updated = [...subtasks];
                      updated[index] = { ...updated[index], title: value };
                      setSubtasks(updated);
                    }}
                    style={[styles.input, styles.subtaskInputFlex]}
                  />
                  <TextInput
                    placeholder="Stars"
                    value={subtask.stars}
                    onChangeText={(value) => {
                      const updated = [...subtasks];
                      updated[index] = { ...updated[index], stars: value.replace(/[^0-9]/g, "") };
                      setSubtasks(updated);
                    }}
                    keyboardType="number-pad"
                    style={[styles.input, styles.starInputWidth]}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#6C63FF" }]}
                onPress={() =>
                  setSubtasks((prev) => [...prev, { title: `Subtask ${prev.length + 1}`, stars: "1" }])
                }
              >
                <Text style={styles.btnText}>+ Add Subtask</Text>
              </TouchableOpacity>
              <View style={styles.buttonRowMargin}>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1 }]}
                  onPress={handleAddTask}
                >
                  <Text style={styles.btnText}>Save Task</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#ccc" }]}
                  onPress={() => {
                    setTaskModalVisible(false);
                    setTaskTitle("");
                    setSubtasks([]);
                  }}
                >
                  <Text style={[styles.btnText, { color: "#000" }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={forgotPinModalVisible} transparent animationType="slide">
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Forgot Parent PIN</Text>
              <Text style={styles.modalDescriptionText2}>
                To reset the parent access code, re-enter your account password for verification.
              </Text>
              <TextInput
                placeholder="Account password"
                value={parentPassword}
                onChangeText={(t) => setParentPassword(t.replace(/\s/g, ''))}
                secureTextEntry
                style={styles.input}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1 }]}
                  onPress={verifyParentPasswordForPinReset}
                >
                  <Text style={styles.btnText}>Verify</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#ccc" }]}
                  onPress={() => setForgotPinModalVisible(false)}
                >
                  <Text style={[styles.btnText, { color: "#000" }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={resetPinModalVisible} transparent animationType="slide">
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Reset Parent Passcode</Text>
              <Text style={styles.modalDescriptionText2}>
                Enter a new 4-digit parent access code for this dashboard.
              </Text>
              <TextInput
                placeholder="New 4-digit PIN"
                value={setupPin}
                onChangeText={(t) => setSetupPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
                keyboardType="number-pad"
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                placeholder="Confirm PIN"
                value={setupConfirmPin}
                onChangeText={(t) => setSetupConfirmPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
                keyboardType="number-pad"
                secureTextEntry
                style={styles.input}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={saveParentPin}>
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#ccc" }]}
                  onPress={() => setResetPinModalVisible(false)}
                >
                  <Text style={[styles.btnText, { color: "#000" }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={kidPinModalVisible} transparent animationType="slide">
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Reset Kid Passcode</Text>
              <Text style={styles.penaltyKidText}>
                {kids.find((k) => k.id === kidToResetId)?.name ?? "Select kid"}
              </Text>
              <TextInput
                placeholder="New 4-digit PIN"
                value={kidPinInput}
                onChangeText={(t) => setKidPinInput(t.replace(/[^0-9]/g, "").slice(0, 4))}
                keyboardType="number-pad"
                secureTextEntry
                style={styles.input}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={saveKidPin}>
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#ccc" }]}
                  onPress={() => { setKidPinModalVisible(false); setKidToResetId(null); setKidPinInput(""); }}
                >
                  <Text style={[styles.btnText, { color: "#000" }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={editKidModalVisible} transparent animationType="slide">
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Edit Kid</Text>
              <Text style={styles.modalDescriptionText2}>Update name and avatar emoji.</Text>
              <TextInput
                placeholder="Name"
                value={editKidName}
                onChangeText={setEditKidName}
                style={styles.input}
              />
              <TextInput
                placeholder="Avatar emoji"
                value={editKidAvatar}
                onChangeText={setEditKidAvatar}
                style={styles.input}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={handleEditKid}>
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#F5F5FA" }]}
                  onPress={() => setEditKidModalVisible(false)}
                >
                  <Text style={[styles.btnText, { color: "#1A1A2E" }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={penaltyModalVisible} transparent animationType="slide">
          <View style={styles.modalBack}>
            <View style={styles.penaltyModalCard}>
              <Text style={styles.penaltyModalTitle}>Apply Penalty / Alert</Text>
              <Text style={styles.penaltyKidText}>
                {kids.find((k) => k.id === penaltyKidId)?.name ?? "Select kid"}
              </Text>
              <Text style={styles.penaltyDescriptionText}>
                Deduct points from the kid&apos;s total. Use sparingly and add a short reason.
              </Text>
              <TextInput
                placeholder="Points to deduct"
                value={penaltyStars}
                onChangeText={(t) => setPenaltyStars(t.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                style={styles.input}
              />
              <TextInput
                placeholder="Reason (optional)"
                value={penaltyReason}
                onChangeText={setPenaltyReason}
                style={styles.input}
              />
              <Text style={styles.attachTaskLabel}>
                Attach to task (optional)
              </Text>
              <FlatList
                data={tasks}
                keyExtractor={(t) => t.id}
                horizontal
                style={styles.taskChipsRow}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      setPenaltyAttachTaskId((prev) =>
                        prev === item.id ? null : item.id,
                      )
                    }
                    style={[
                      styles.subtaskChip,
                      penaltyAttachTaskId === item.id
                        ? { borderWidth: 2, borderColor: "#6C63FF" }
                        : {},
                    ]}
                  >
                    <Text style={styles.editTaskTitle}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#e63946" }]}
                  onPress={() => {
                    if (!penaltyKidId) {
                      Alert.alert("Select a kid first");
                      return;
                    }
                    const pts = Number(penaltyStars) || 1;
                    const attachId = penaltyAttachTaskId || "__penalty__";
                    try {
                      const res = addPenalty(
                        penaltyKidId,
                        pts,
                        penaltyReason || undefined,
                        penaltyAttachTaskId || undefined,
                      );
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setLastPenalty({
                        kidId: penaltyKidId,
                        subtaskId: res.id,
                        taskId: attachId,
                      });
                      setSnackMsg(`Deducted ${pts} point(s)`);
                      setSnackVisible(true);
                      setPenaltyStars("1");
                      setPenaltyReason("");
                      setPenaltyKidId(null);
                      setPenaltyAttachTaskId(null);
                      setPenaltyModalVisible(false);
                    } catch (err) {
                      console.warn("addPenalty error", err);
                      Alert.alert("Error", "Could not apply penalty");
                    }
                  }}
                >
                  <Text style={styles.btnText}>Apply Penalty</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#ccc" }]}
                  onPress={() => setPenaltyModalVisible(false)}
                >
                  <Text style={[styles.btnText, { color: "#000" }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={bonusModalVisible} transparent animationType="slide">
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Give Bonus</Text>
              <Text style={styles.bonusKidText}>
                {kids.find((k) => k.id === bonusKidId)?.name ?? "Select kid"}
              </Text>
              <TextInput
                placeholder="Stars"
                value={bonusStars}
                onChangeText={(t) => setBonusStars(t.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                style={styles.input}
              />
              <TextInput
                placeholder="Reason (optional)"
                value={bonusReason}
                onChangeText={setBonusReason}
                style={styles.input}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.bonusBtn, { flex: 1 }]}
                  onPress={() => {
                    if (!bonusKidId) {
                      Alert.alert("Select a kid first");
                      return;
                    }
                    const stars = Number(bonusStars) || 1;
                    addBonus(bonusKidId, stars, bonusReason || undefined);
                    setBonusStars("1");
                    setBonusReason("");
                    setBonusKidId(null);
                    setBonusModalVisible(false);
                  }}
                >
                  <Text style={styles.btnText}>Give</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#ccc" }]}
                  onPress={() => setBonusModalVisible(false)}
                >
                  <Text style={[styles.btnText, { color: "#000" }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={resetModalVisible} transparent animationType="slide">
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>End Competition & Award Prize</Text>
              <Text style={styles.resetModalDescription}>
                This will reset all stars, bonuses, and penalties to zero after awarding the prize.
              </Text>
              {kids.length > 0 && (
                <View style={styles.winnersSectionView}>
                  <Text style={styles.competitionWinnersTitle}>🏆 Winners:</Text>
                  <View style={styles.winnerRow}>
                    <Text style={styles.winnerEmoji}>⭐</Text>
                    <Text style={styles.winnerText}>
                      Most Stars: {topKidNames} ({maxStars}⭐)
                    </Text>
                  </View>
                </View>
              )}
              <View style={styles.buttonRowMargin}>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#28a745" }]}
                  onPress={() => {
                    resetCompetition();
                    setResetModalVisible(false);
                    Alert.alert(
                      "Competition Reset",
                      "All stars, bonuses, and penalties have been reset. New competition started!",
                    );
                  }}
                >
                  <Text style={styles.btnText}>Confirm & Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#ccc" }]}
                  onPress={() => setResetModalVisible(false)}
                >
                  <Text style={[styles.btnText, { color: "#000" }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={editTaskModalVisible} transparent animationType="slide">
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Edit Task</Text>
              <TextInput
                style={styles.input}
                placeholder="Task Title"
                value={editTaskTitle}
                onChangeText={setEditTaskTitle}
              />
              <Text style={styles.editTaskSubtaskLabel}>
                Subtasks
              </Text>
              {editSubtasks.map((s, idx) => (
                <View key={idx} style={styles.editTaskSubtaskRow}>
                  <TextInput
                    style={[styles.input, styles.editSubtaskInput]}
                    placeholder="Subtask"
                    value={s.title}
                    onChangeText={(txt) => {
                      const updated = [...editSubtasks];
                      updated[idx].title = txt;
                      setEditSubtasks(updated);
                    }}
                  />
                  <TextInput
                    style={[styles.input, styles.editSubtaskStarInput]}
                    placeholder="⭐"
                    value={s.stars}
                    onChangeText={(txt) => {
                      const updated = [...editSubtasks];
                      updated[idx].stars = txt;
                      setEditSubtasks(updated);
                    }}
                    keyboardType="numeric"
                  />
                </View>
              ))}
              <TouchableOpacity
                style={[styles.btn, styles.addSubtaskButtonMargin]}
                onPress={() => {
                  const updated = [...editSubtasks, { title: "Subtask", stars: "1" }];
                  setEditSubtasks(updated);
                }}
              >
                <Text style={styles.btnText}>+ Add Subtask</Text>
              </TouchableOpacity>
              <View style={styles.editTaskButtonRow}>
                <TouchableOpacity
                  style={[styles.btn, styles.editTaskSaveButton]}
                  onPress={handleEditTask}
                >
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#ccc" }]}
                  onPress={() => setEditTaskModalVisible(false)}
                >
                  <Text style={[styles.btnText, { color: "#000" }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <Modal
        visible={authModalVisible}
        transparent
        animationType="slide"
        onShow={() => setTimeout(() => authPinInputRef.current?.focus(), 150)}
      >
        <View style={styles.modalBack}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {parentPin ? "Enter Parent Access Code" : "Set Parent Access Code"}
            </Text>
            <Text style={styles.modalDescriptionText2}>
              {parentPin
                ? "Enter your 4-digit dashboard access code."
                : "Create a 4-digit dashboard access code to protect parent access."}
            </Text>
            {parentPin ? (
              <>
                <View style={styles.pinDotsRow}>
                  {[0, 1, 2, 3].map((i) => (
                    <View key={i} style={[styles.pinDot, parentPinInput.length > i && styles.pinDotFilled]} />
                  ))}
                </View>
                <TextInput
                  ref={authPinInputRef}
                  placeholder="4-digit PIN"
                  value={parentPinInput}
                  secureTextEntry={true}
                  onChangeText={(t) => setParentPinInput(t.replace(/[^0-9]/g, "").slice(0, 4))}
                  keyboardType="number-pad"
                  style={styles.input}
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.btn, { flex: 1 }]}
                    onPress={verifyParentPin}
                  >
                    <Text style={styles.btnText}>Unlock</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.btn,
                      {
                        flex: 1,
                        backgroundColor: "#ccc",
                      },
                    ]}
                    onPress={() => {
                      setAuthModalVisible(false);
                      router.replace("/");
                    }}
                  >
                    <Text style={[styles.btnText, { color: "#000" }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{ marginTop: 12, alignSelf: "center" }}
                  onPress={() => {
                    setForgotPinModalVisible(true);
                    setAuthModalVisible(false);
                  }}
                >
                  <Text style={{ color: "#6C63FF", fontWeight: "700" }}>Forgot PIN?</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.pinDotsRow}>
                  {[0, 1, 2, 3].map((i) => (
                    <View key={i} style={[styles.pinDot, setupPin.length > i && styles.pinDotFilled]} />
                  ))}
                </View>
                <TextInput
                  ref={authPinInputRef}
                  placeholder="4-digit PIN"
                  value={setupPin}
                  onChangeText={(t) => setSetupPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
                  keyboardType="number-pad"
                  secureTextEntry
                  style={styles.input}
                />
                <View style={styles.pinDotsRow}>
                  {[0, 1, 2, 3].map((i) => (
                    <View key={i} style={[styles.pinDot, setupConfirmPin.length > i && styles.pinDotFilled]} />
                  ))}
                </View>
                <TextInput
                  placeholder="Confirm 4-digit PIN"
                  value={setupConfirmPin}
                  onChangeText={(t) => setSetupConfirmPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
                  keyboardType="number-pad"
                  secureTextEntry
                  style={styles.input}
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.btn, { flex: 1 }]}
                    onPress={saveParentPin}
                  >
                    <Text style={styles.btnText}>Save PIN</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.btn,
                      {
                        flex: 1,
                        backgroundColor: "#ccc",
                      },
                    ]}
                    onPress={() => {
                      setAuthModalVisible(false);
                      router.replace("/");
                    }}
                  >
                    <Text style={[styles.btnText, { color: "#000" }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: '#F5F5FA' },
  scrollViewContent: { paddingBottom: 40 },
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5FA' },

  headerCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 4 },
  subtitle: { color: '#8A8F98', fontSize: 13, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  summaryTile: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  tileNumber: { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },
  tileLabel: { color: '#8A8F98', fontSize: 11, marginTop: 3, textAlign: 'center' },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#6C63FF',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  ghostBtn: {
    flex: 1,
    backgroundColor: '#FFF3DC',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtnText: { color: '#FB8500', fontWeight: '700', fontSize: 14 },

  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 14 },

  kidCard: {
    backgroundColor: '#F8F8FE',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EDEDF5',
  },
  kidHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  kidAvatarBg: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#EDEAFF',
    alignItems: 'center', justifyContent: 'center',
  },
  kidAvatar: { fontSize: 26 },
  kidNameContainer: { marginLeft: 12, flex: 1, minWidth: 0 },
  kidNameLabel: { color: '#8A8F98', fontSize: 11, marginBottom: 2 },
  kidName: { fontWeight: '700', fontSize: 17, color: '#1A1A2E' },
  kidStatsGrid: { flexDirection: 'row', gap: 8 },
  kidStatBlock: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEDF5',
  },
  kidStatLabel: { fontSize: 10, color: '#8A8F98', marginBottom: 4, textAlign: 'center' },
  kidStatValue: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  kidActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  smallEditBtn: {
    backgroundColor: '#E3FBF3',
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 10,
  },
  smallEditBtnText: { color: '#06D6A0', fontWeight: '600', fontSize: 13 },
  smallPrimaryBtn: {
    backgroundColor: '#EDEAFF',
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 10,
  },
  smallPrimaryBtnText: { color: '#6C63FF', fontWeight: '600', fontSize: 13 },
  smallPenaltyBtn: {
    backgroundColor: '#FFE8E8',
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 10,
  },
  smallPenaltyBtnText: { color: '#FF5D5D', fontWeight: '600', fontSize: 13 },
  smallResetPinBtn: {
    backgroundColor: '#FFF3DC',
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 10,
  },
  smallResetPinBtnText: { color: '#FB8500', fontWeight: '600', fontSize: 13 },
  smallDeleteBtn: {
    backgroundColor: '#FFE8E8',
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 10,
  },
  smallDeleteBtnText: { color: '#D62828', fontWeight: '600', fontSize: 13 },

  taskCard: {
    backgroundColor: '#F8F8FE',
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EDEDF5',
  },
  taskAccentBar: { width: 4, backgroundColor: '#6C63FF' },
  taskCardBody: { flex: 1, padding: 12 },
  taskHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  taskTitleText: { fontWeight: '700', fontSize: 15, color: '#1A1A2E', flex: 1 },
  actionButtonRow: { flexDirection: 'row', gap: 6 },
  actionButton: {
    width: 32, height: 32,
    borderRadius: 10,
    backgroundColor: '#6C63FF',
    alignItems: 'center', justifyContent: 'center',
  },
  editDeleteButtonText: { fontSize: 14 },
  subtaskCountText: { color: '#8A8F98', fontSize: 12, marginBottom: 8 },
  subtasksRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  subtaskChip: {
    backgroundColor: '#fff',
    paddingVertical: 5, paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#EDEDF5',
  },
  subtaskTitleText: { color: '#1A1A2E', fontSize: 12, fontWeight: '500' },
  subtaskStarText: { marginLeft: 6, color: '#FB8500', fontSize: 12 },

  section: { marginTop: 20, fontWeight: '700', fontSize: 15, color: '#1A1A2E' },
  todayKidCard: {
    backgroundColor: '#F8F8FE',
    padding: 12, borderRadius: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#EDEDF5',
  },
  todayKidRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  todayKidAvatar: { fontSize: 30 },
  todayKidInfoContainer: { marginLeft: 12, flex: 1 },
  todayKidName: { fontWeight: '700', fontSize: 15, color: '#1A1A2E' },
  completionCountText: { color: '#8A8F98', fontSize: 12, marginTop: 2 },
  viewDetailsText: { color: '#6C63FF', fontWeight: '600', fontSize: 13 },
  todayCompletionPlaceholder: { padding: 12 },
  emptyStateText: { color: '#8A8F98', fontSize: 14 },

  competitionCard: {
    backgroundColor: '#F8F8FE',
    padding: 14, borderRadius: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#EDEDF5',
  },
  competitionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  competitionTitle: { fontWeight: '700', fontSize: 14, color: '#1A1A2E', flex: 1 },
  competitionDate: { fontSize: 11, color: '#8A8F98' },
  winnerInfoContainer: { marginTop: 6 },
  winnerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  winnerEmoji: { fontSize: 18, marginRight: 8 },
  winnerText: { fontWeight: '600', fontSize: 13, color: '#1A1A2E' },
  secondPlaceText: { fontWeight: '500', fontSize: 13, color: '#8A8F98', marginTop: 2 },
  rankingsText: { fontSize: 12, color: '#8A8F98', marginTop: 6 },

  pinDotsRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 14 },
  pinDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#EDEDF5', borderWidth: 2, borderColor: '#E0E0E8' },
  pinDotFilled: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  modalBack: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)' },
  authOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 9999 },
  authModalCard: { width: '90%', maxWidth: 420 },
  modalCard: { margin: 20, backgroundColor: '#fff', padding: 22, borderRadius: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14, color: '#1A1A2E' },
  input: {
    backgroundColor: '#F5F5FA',
    borderRadius: 14, padding: 13,
    marginBottom: 10, fontSize: 15,
    borderWidth: 1, borderColor: '#EDEDF5',
  },
  penaltyBtn: { backgroundColor: '#FF5D5D', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  penaltyBtnText: { color: '#fff', fontWeight: '600' },
  penaltyModalCard: { margin: 20, backgroundColor: '#fff', padding: 22, borderRadius: 24, borderWidth: 1.5, borderColor: '#FFE8E8' },
  penaltyModalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#D62828' },
  btn: { marginTop: 16, backgroundColor: '#6C63FF', padding: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  bonusBtn: { marginTop: 16, backgroundColor: '#06D6A0', padding: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  buttonRowMargin: { flexDirection: 'row', gap: 10, marginTop: 14 },
  buttonRowMarginLarge: { flexDirection: 'row', gap: 10, marginTop: 16 },
  buttonRowGap: { flexDirection: 'row', gap: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },

  modalDescriptionText: { color: '#8A8F98', marginBottom: 8 },
  modalDescriptionText2: { color: '#8A8F98', marginBottom: 14, fontSize: 13 },
  modalLabelText: { color: '#1A1A2E', marginBottom: 6 },
  penaltyKidText: { color: '#8A8F98', marginBottom: 8, fontSize: 14 },
  penaltyDescriptionText: { color: '#1A1A2E', marginBottom: 8, fontSize: 13 },
  attachTaskLabel: { fontWeight: '600', marginTop: 10, marginBottom: 6, color: '#1A1A2E' },
  taskChipsRow: { marginVertical: 8 },
  editTaskTitle: { fontWeight: '600', fontSize: 13 },
  bonusKidText: { color: '#8A8F98', marginBottom: 8, fontSize: 14 },
  resetModalDescription: { color: '#8A8F98', marginBottom: 14, fontSize: 13 },
  winnersSectionView: { marginBottom: 14 },
  competitionWinnersTitle: { fontWeight: '700', marginBottom: 8, color: '#1A1A2E' },
  editTaskSubtaskLabel: { marginTop: 14, fontWeight: '600', marginBottom: 8, color: '#1A1A2E' },
  editTaskSubtaskRow: { marginBottom: 8, flexDirection: 'row', gap: 8, alignItems: 'center' },
  editSubtaskInput: { flex: 1 },
  editSubtaskStarInput: { width: 60, textAlign: 'center' },
  addSubtaskButtonMargin: { marginTop: 8, backgroundColor: '#6C63FF' },
  editTaskButtonRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  editTaskSaveButton: { flex: 1, backgroundColor: '#06D6A0' },
  editTaskCancelButton: { flex: 1, backgroundColor: '#F5F5FA' },
  subtaskInputRow: { marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  subtaskInputFlex: { flex: 1 },
  starInputWidth: { width: 64, textAlign: 'center' },
  cancelButton: { flex: 1, backgroundColor: '#F5F5FA' },
  cancelButtonText: { color: '#1A1A2E' },
  saveButton: { flex: 1, backgroundColor: '#06D6A0' },
  addSubtaskButton: { marginTop: 8, backgroundColor: '#6C63FF' },
  endCompetitionBtn: { backgroundColor: 'rgba(241,127,13,0.85)', marginTop: 12 },
  resetPinBtnMargin: { marginTop: 12 },
  resetPinBtnMargin2: { marginTop: 12 },
  kidActionButtonsContainer: { marginTop: 8 },
  pastCompetitionsMargin: { marginTop: 12 },
  winnerSectionRow: { marginBottom: 12 },
  winnerListText: { fontWeight: '700', marginBottom: 8 },
  competitionDateText: { color: '#8A8F98', fontSize: 12 },
  editTaskModalMargin: { marginBottom: 8 },
  winnersSectionMargin: { marginBottom: 12 },
  winnersTitle: { fontWeight: '700', marginBottom: 8 },
});

