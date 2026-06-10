import { auth, db } from "@/lib/firebase/config";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { useKids } from "../context/KidContext";
import { capitalizeWords } from "../utils/textUtils";

export default function ParentDashboard() {
  const {
    kids,
    addKid,
    updateKid,
    removeKid,
    tasks,
    addTask,
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
  const [subtasks, setSubtasks] = useState<{ title: string; stars: string }[]>([
    { title: "Subtask 1", stars: "1" },
  ]);

  const { from } = useLocalSearchParams();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [parentPinInput, setParentPinInput] = useState("");
  const [setupPin, setSetupPin] = useState("");
  const [setupConfirmPin, setSetupConfirmPin] = useState("");
  const [parentPin, setParentPin] = useState<string | null>(null);
  const [parentPinLoading, setParentPinLoading] = useState(true);
  const [resetPinModalVisible, setResetPinModalVisible] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

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
  const [editSubtasks, setEditSubtasks] = useState<
    { title: string; stars: string }[]
  >([]);

  // Kid PIN reset states
  const [kidPinModalVisible, setKidPinModalVisible] = useState(false);
  const [kidToResetId, setKidToResetId] = useState<string | null>(null);
  const [kidPinInput, setKidPinInput] = useState("");

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
    if (!taskTitle.trim() || subtasks.length === 0) {
      Alert.alert("Validation", "Enter task title and at least one subtask");
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
    if (!editTaskTitle.trim() || editSubtasks.length === 0) {
      Alert.alert("Validation", "Enter task title and at least one subtask");
      return;
    }
    Alert.alert(
      "Info",
      "Task editing feature is ready for backend implementation.",
    );
    setEditTaskModalVisible(false);
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
            Alert.alert(
              "Info",
              "Task deletion requires backend implementation.",
            );
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
      if (!currentUser) {
        setParentPinLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "parents", currentUser.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data() : {};
        setParentPin(data?.parentPin ?? "");
      } catch (error) {
        console.error("Error loading parent PIN:", error);
        setParentPin("");
      } finally {
        setParentPinLoading(false);
      }
    };

    setRequiresAuth(from === "index");
    loadParentPin();
  }, [from]);

  useEffect(() => {
    setAuthModalVisible(requiresAuth && !authenticated && !parentPinLoading);
  }, [authenticated, parentPinLoading, requiresAuth]);

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
    } catch (error) {
      console.error("Error saving parent PIN:", error);
      Alert.alert("Save failed", "Unable to save PIN. Please try again.");
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

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScreenHeader
        title="Parent Dashboard"
        rightButton={{
          icon: "person-circle",
          onPress: () => router.push("/screens/ParentProfileScreen"),
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.headerCard}>
          <Text style={styles.title}>Parent Dashboard</Text>
          <Text style={styles.subtitle}>Manage kids, tasks and rewards</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryTile}>
              <Text style={styles.tileNumber}>{kids.length}</Text>
              <Text style={styles.tileLabel}>Kids</Text>
            </View>
            <View style={styles.summaryTile}>
              <Text style={styles.tileNumber}>{tasks.length}</Text>
              <Text style={styles.tileLabel}>Tasks</Text>
            </View>
            <View style={styles.summaryTile}>
              <Text style={styles.tileNumber}>
                {kids.reduce((a, k) => a + getMonthlyStars(k.id), 0)}
              </Text>
              <Text style={styles.tileLabel}>This month ⭐</Text>
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
            onPress={() => setResetModalVisible(true)}
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
                      <Text style={styles.kidAvatar}>{item.avatar}</Text>
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
                    setSubtasks([{ title: "Subtask 1", stars: "1" }]);
                  }}
                >
                  <Text style={[styles.btnText, { color: "#000" }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={authModalVisible} transparent animationType="slide">
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
                  <TextInput
                    placeholder="4-digit PIN"
                    value={parentPinInput}
                    onChangeText={(t) => setParentPinInput(t.replace(/[^0-9]/g, "").slice(0, 4))}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                  <TouchableOpacity style={styles.btn} onPress={verifyParentPin}>
                    <Text style={styles.btnText}>Unlock</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TextInput
                    placeholder="4-digit PIN"
                    value={setupPin}
                    onChangeText={(t) => setSetupPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Confirm 4-digit PIN"
                    value={setupConfirmPin}
                    onChangeText={(t) => setSetupConfirmPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={saveParentPin}>
                      <Text style={styles.btnText}>Save PIN</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
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
                style={styles.input}
              />
              <TextInput
                placeholder="Confirm PIN"
                value={setupConfirmPin}
                onChangeText={(t) => setSetupConfirmPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
                keyboardType="number-pad"
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
                      Most Stars: {capitalizeWords(kids.reduce((top, k) => getKidStars(k.id) > getKidStars(top.id) ? k : top, kids[0]).name)} ({getKidStars(kids.reduce((top, k) => getKidStars(k.id) > getKidStars(top.id) ? k : top, kids[0]).id)} ⭐)
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: "#FFF8E7" },
  scrollViewContent: { paddingBottom: 40 },
  container: { flex: 1, padding: 20, backgroundColor: "#FFF8E7" },
  headerCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  title: { fontSize: 26, fontWeight: "900" },
  subtitle: { color: "#666", marginTop: 6 },
  summaryRow: {
    flexDirection: "row",
    marginTop: 14,
    justifyContent: "space-between",
  },
  summaryTile: { alignItems: "center", flex: 1 },
  tileNumber: { fontSize: 20, fontWeight: "900" },
  tileLabel: { color: "#666", fontSize: 12, marginTop: 4 },
  actionsRow: { flexDirection: "row", gap: 12, marginTop: 14 },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#03c8A7",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "800" },
  ghostBtn: {
    flex: 1,
    backgroundColor: "#FFF0C9",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostBtnText: { color: "#FB8500", fontWeight: "800" },
  sectionCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  sectionTitle: { fontWeight: "900", marginBottom: 10 },
  kidCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  kidHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  kidAvatar: {
    fontSize: 34,
  },
  kidNameLabel: {
    color: "#999",
    fontSize: 11,
    marginBottom: 4,
  },
  kidName: {
    fontWeight: "900",
    fontSize: 20,
    color: "#000",
  },
  kidStatsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  kidStatBlock: {
    flex: 1,
    minWidth: 0,
  },
  kidStatLabel: {
    color: "#666",
    fontSize: 11,
    marginBottom: 4,
  },
  kidStatValue: {
    fontWeight: "800",
    fontSize: 16,
    color: "#333",
  },
  kidActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 14,
  },
  smallPrimaryBtn: {
    backgroundColor: "#6C63FF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 8,
    marginRight: 8,
    minWidth: 98,
    alignItems: "center",
  },
  smallPrimaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  smallPenaltyBtn: {
    backgroundColor: "#e63946",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 8,
    marginRight: 8,
    minWidth: 98,
    alignItems: "center",
  },
  smallPenaltyBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  smallResetPinBtn: {
    backgroundColor: "#ffb703",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 8,
    marginRight: 8,
    minWidth: 98,
    alignItems: "center",
  },
  smallResetPinBtnText: { color: "#1f1f1f", fontWeight: "800", fontSize: 13 },
  smallDeleteBtn: {
    backgroundColor: "#d62828",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 8,
    marginRight: 8,
    minWidth: 98,
    alignItems: "center",
  },
  smallDeleteBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  taskCard: {
    backgroundColor: "#F1F9FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  subtaskChip: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
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
  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  penaltyBtn: {
    backgroundColor: "#e63946",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  penaltyBtnText: { color: "#fff", fontWeight: "800" },
  penaltyModalCard: {
    margin: 20,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ffe6e9",
  },
  penaltyModalTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
    color: "#b00020",
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#03c8A7",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  bonusBtn: {
    marginTop: 20,
    backgroundColor: "#6C63FF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  section: { marginTop: 20, fontWeight: "800" },
  todayKidCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  todayKidAvatar: { fontSize: 32 },
  todayKidName: { fontWeight: "800", fontSize: 16 },
  competitionCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  competitionTitle: { fontWeight: "800", fontSize: 16 },
  competitionDate: { fontSize: 12, color: "#666" },
  winnerRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  winnerEmoji: { fontSize: 20, marginRight: 8 },
  winnerText: { fontWeight: "700", fontSize: 14, color: "#FFD700" },
  secondPlaceText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#C0C0C0",
    marginTop: 4,
  },
  rankingsText: { fontSize: 12, color: "#666", marginTop: 8 },
  kidNameContainer: { marginLeft: 12, flex: 1, minWidth: 0 },
  taskHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  taskTitleText: { fontWeight: "800", fontSize: 16 },
  actionButtonRow: { flexDirection: "row", gap: 8 },
  editDeleteButtonText: { color: "#fff", fontSize: 12 },
  subtaskCountText: { color: "#666", fontSize: 12, marginTop: 4 },
  subtasksRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 8 },
  subtaskTitleText: { color: "#023047", fontWeight: "700" },
  subtaskStarText: { marginLeft: 8, color: "#fb8500" },
  todayCompletionPlaceholder: { padding: 12 },
  emptyStateText: { color: "#666" },
  todayKidRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  viewDetailsText: { color: "#6C63FF", fontWeight: "700" },
  competitionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  competitionDateText: { color: "#666", fontSize: 12 },
  winnerSectionRow: { marginBottom: 12 },
  winnerListText: { fontWeight: "800", marginBottom: 8 },
  pastCompetitionsMargin: { marginTop: 12 },
  buttonRowGap: { flexDirection: "row", gap: 8 },
  buttonRowMargin: { flexDirection: "row", gap: 8, marginTop: 12 },
  buttonRowMarginLarge: { flexDirection: "row", gap: 8, marginTop: 16 },
  modalDescriptionText: { color: "#666", marginBottom: 6 },
  modalLabelText: { color: "#333", marginBottom: 6 },
  addSubtaskButton: { marginTop: 8, backgroundColor: "#007bff" },
  saveButton: { flex: 1, backgroundColor: "#28a745" },
  cancelButton: { flex: 1, backgroundColor: "#ccc" },
  cancelButtonText: { color: "#000" },
  resetPinBtnMargin: { marginTop: 12 },
  endCompetitionBtn: { backgroundColor: "#f17f0da4", marginTop: 12 },
  resetPinBtnMargin2: { marginTop: 12 },
  kidActionButtonsContainer: { marginTop: 8 },
  subtaskInputRow: { marginBottom: 8, flexDirection: "row", alignItems: "center", gap: 8 },
  subtaskInputFlex: { flex: 1 },
  starInputWidth: { width: 64, textAlign: "center" },
  modalDescriptionText2: { color: "#666", marginBottom: 12 },
  winnersSectionMargin: { marginBottom: 12 },
  winnersTitle: { fontWeight: "800", marginBottom: 8 },
  editTaskModalMargin: { marginBottom: 8 },
  penaltyKidText: { color: "#666", marginBottom: 6 },
  penaltyDescriptionText: { color: "#333", marginBottom: 6 },
  attachTaskLabel: { fontWeight: "700", marginTop: 8 },
  taskChipsRow: { marginVertical: 8 },
  editTaskTitle: { fontWeight: "800" },
  bonusKidText: { color: "#666", marginBottom: 6 },
  resetModalDescription: { color: "#666", marginBottom: 12 },
  winnersSectionView: { marginBottom: 12 },
  competitionWinnersTitle: { fontWeight: "800", marginBottom: 8 },
  editTaskSubtaskLabel: { marginTop: 16, fontWeight: "600", marginBottom: 8 },
  editTaskSubtaskRow: { marginBottom: 8, flexDirection: "row", gap: 8, alignItems: "center" },
  editSubtaskInput: { flex: 1 },
  editSubtaskStarInput: { width: 60, textAlign: "center" },
  addSubtaskButtonMargin: { marginTop: 8, backgroundColor: "#007bff" },
  editTaskButtonRow: { flexDirection: "row", gap: 8, marginTop: 16 },
  editTaskSaveButton: { flex: 1, backgroundColor: "#28a745" },
  editTaskCancelButton: { flex: 1, backgroundColor: "#ccc" },
  todayKidInfoContainer: { marginLeft: 12, flex: 1 },
  completionCountText: { color: "#666", fontSize: 12 },
  competitionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  winnerInfoContainer: { marginTop: 8 },
});

