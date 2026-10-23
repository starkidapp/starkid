import { auth, db } from "@/lib/firebase/config";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  LayoutAnimation,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

import { Avatar, Text } from "@/components/ui";
import { colors, palette, radii, shadows, spacing } from "@/constants/theme";
import AvatarPicker from "../components/AvatarPicker";
import ScreenHeader from "../components/ScreenHeader";
import { useKids } from "../context/KidContext";
import { useToast } from "../context/ToastContext";
import { capitalizeWords, joinNames } from "../utils/textUtils";

export default function ParentDashboard() {
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
    getChallengeStars,
    getLeaderIds,
    addBonus,
    addPenalty,
    resetCompetition,
  } = useKids();
  const { showToast } = useToast();

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

  // Edit kid (name + avatar) states
  const [editKidId, setEditKidId] = useState<string | null>(null);
  const [editKidName, setEditKidName] = useState("");
  const [editKidAvatar, setEditKidAvatar] = useState("🧒");

  // Kid PIN reset states
  const [kidPinModalVisible, setKidPinModalVisible] = useState(false);
  const [kidToResetId, setKidToResetId] = useState<string | null>(null);
  const [kidPinInput, setKidPinInput] = useState("");

  // Refs so PIN inputs focus as soon as their popup opens
  const parentUnlockPinRef = useRef<TextInput>(null);
  const parentSetupPinRef = useRef<TextInput>(null);
  const resetPinRef = useRef<TextInput>(null);
  const kidPinRef = useRef<TextInput>(null);
  const focusSoon = (ref: React.RefObject<TextInput | null>) =>
    setTimeout(() => ref.current?.focus(), 60);

  function openEditKid(kid: { id: string; name: string; avatar: string }) {
    setEditKidId(kid.id);
    setEditKidName(kid.name);
    setEditKidAvatar(kid.avatar || "🧒");
  }

  function saveKidEdit() {
    const kid = kids.find((k) => k.id === editKidId);
    if (!kid) {
      setEditKidId(null);
      return;
    }
    if (!editKidName.trim()) {
      Alert.alert("Missing name", "Please type the kid's name.");
      return;
    }
    updateKid({ ...kid, name: editKidName.trim(), avatar: editKidAvatar });
    setEditKidId(null);
    showToast(`✅ ${capitalizeWords(editKidName.trim())} is updated.`);
  }

  function handleAdd() {
    if (!name.trim() || pin.length !== 4 || !/^[0-9]{4}$/.test(pin)) {
      Alert.alert("Missing details", "Please enter the kid's name and a 4-number PIN.");
      return;
    }

    addKid({ name: name.trim(), avatar, pin });
    setName("");
    setPin("");
    setAvatar("🧒");
    setModalVisible(false);
  }

  function handleAddTask() {
    if (subtasks.length === 0) {
      Alert.alert("Add a step", "Please add at least one step to this task.");
      return;
    }

    const cleaned = subtasks.map((s) => ({
      title: s.title.trim() || "Subtask",
      stars: Number(s.stars) || 1,
    }));

    const needsMainTitle = cleaned.length > 1;
    if (needsMainTitle && !taskTitle.trim()) {
      Alert.alert("Missing task name", "Please give this task a name.");
      return;
    }

    const finalTitle = cleaned.length === 1
      ? (taskTitle.trim() || cleaned[0].title)
      : taskTitle.trim();

    addTask({ title: finalTitle, subtasks: cleaned });
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
    if (!editingTaskId || !editTaskTitle.trim() || editSubtasks.length === 0) {
      Alert.alert("Missing details", "Please enter a task name and at least one step.");
      return;
    }

    const original = tasks.find((t) => t.id === editingTaskId);
    const subtasks = editSubtasks.map((s, index) => ({
      id:
        original?.subtasks[index]?.id ??
        Date.now().toString() + "-" + Math.random().toString(36).slice(2, 7),
      title: s.title.trim() || "Subtask",
      stars: Number(s.stars) || 1,
    }));

    updateTask({ id: editingTaskId, title: editTaskTitle.trim(), subtasks });
    setEditTaskModalVisible(false);
    setEditingTaskId(null);
  }

  function handleDeleteTask(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    Alert.alert(
      "Delete task?",
      `Delete "${task.title}"? You can't undo this.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeTask(taskId),
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
    if (authModalVisible) {
      focusSoon(parentPin ? parentUnlockPinRef : parentSetupPinRef);
    }
  }, [authModalVisible, parentPin]);

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
      Alert.alert("Wrong PIN", "That PIN is not correct. Please try again.");
    }
  }

  async function saveParentPin() {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    if (!/^[0-9]{4}$/.test(setupPin)) {
      Alert.alert("Check the PIN", "The PIN must be 4 numbers.");
      return;
    }

    if (setupPin !== setupConfirmPin) {
      Alert.alert("PINs don't match", "Please type the same PIN in both boxes.");
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
      showToast("✅ Your parent PIN is saved.");
    } catch (error) {
      console.error("Error saving parent PIN:", error);
      Alert.alert("Couldn't save", "Please try again.");
    }
  }

  async function saveKidPin() {
    if (!kidToResetId) return;
    if (!/^[0-9]{4}$/.test(kidPinInput)) {
      Alert.alert("Check the PIN", "The PIN must be 4 numbers.");
      return;
    }
    const kid = kids.find((k) => k.id === kidToResetId);
    if (!kid) {
      Alert.alert("Kid not found", "Please go back and try again.");
      return;
    }

    try {
      updateKid({ ...kid, pin: kidPinInput });
      setKidPinModalVisible(false);
      setKidToResetId(null);
      setKidPinInput("");
      showToast(`✅ ${kid.name}'s PIN is changed.`);
    } catch (error) {
      console.error("Error resetting kid PIN", error);
      Alert.alert("Couldn't save", "Please try again.");
    }
  }

  // Everyone tied on the most stars leads together.
  const leaderIds = getLeaderIds();
  const leaders = kids.filter((k) => leaderIds.includes(k.id));
  const leaderNames = joinNames(leaders.map((k) => capitalizeWords(k.name)));
  const leaderStars = leaders.length > 0 ? getChallengeStars(leaders[0].id) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="Parent Dashboard"
        rightButton={{
          icon: "person-circle",
          onPress: () =>
            router.push({
              pathname: "/screens/ParentProfileScreen",
              // Already unlocked here, so don't ask for the access code again.
              params: { fromParentDashboard: !requiresAuth || authenticated ? "1" : "0" },
            }),
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
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
                {kids.reduce((a, k) => a + getChallengeStars(k.id), 0)}
              </Text>
              <Text style={styles.tileLabel}>This challenge ⭐</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.leaderRow}
            activeOpacity={0.8}
            onPress={() => router.push("/screens/LeaderboardScreen")}
          >
            <Text style={styles.leaderEmoji}>🏆</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.leaderLabel}>Top of the challenge</Text>
              <Text style={styles.leaderName} numberOfLines={1}>
                {leaders.length > 0
                  ? `${leaderNames} · ${leaderStars} ⭐`
                  : "No stars earned yet"}
              </Text>
            </View>
            <Text style={styles.leaderChevron}>›</Text>
          </TouchableOpacity>

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
            <Text style={styles.primaryBtnText}>🏆 End Challenge</Text>
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
                      <Avatar
                        emoji={item.avatar}
                        size="md"
                        crowned={leaderIds.includes(item.id)}
                        style={leaderIds.includes(item.id) ? styles.crownedAvatar : undefined}
                      />
                      <View style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
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
                        <Text style={styles.kidStatLabel}>Stars this challenge</Text>
                        <Text style={styles.kidStatValue}>
                          {getChallengeStars(item.id)} ⭐
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
                        onPress={() => openEditKid(item)}
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
                            "Remove kid?",
                            `Remove ${displayName} and all their stars? You can't undo this.`,
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
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "800", fontSize: 16 }}>
                      {item.title}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => openEditTaskModal(item)}
                      >
                        <Text style={{ color: "#fff", fontSize: 12 }}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: "#d32f2f" }]}
                        onPress={() => handleDeleteTask(item.id)}
                      >
                        <Text style={{ color: "#fff", fontSize: 12 }}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
                    {item.subtasks.length} subtasks
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      marginTop: 8,
                      gap: 8,
                    }}
                  >
                    {item.subtasks.map((st) => (
                      <View key={st.id} style={styles.subtaskChip}>
                        <Text style={{ color: "#023047", fontWeight: "700" }}>
                          {st.title}
                        </Text>
                        <Text style={{ marginLeft: 8, color: "#fb8500" }}>
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
            <Text style={[styles.section, { marginTop: 12 }]}>Today’s Completions</Text>
            {(() => {
              const today = new Date().toISOString().slice(0, 10);
              const todayComps = completions.filter((c) => c.date === today);
              if (todayComps.length === 0) {
                return (
                  <View style={{ padding: 12 }}>
                    <Text style={{ color: "#666" }}>
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
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <Avatar emoji={item.kid?.avatar ?? "🧒"} size="sm" />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                          <Text style={styles.todayKidName}>
                            {item.kid?.name}
                          </Text>
                          <Text style={{ color: "#666", fontSize: 12 }}>
                            {item.completionCount} completion(s) today
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: "#6C63FF", fontWeight: "700" }}>
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
            <Text style={[styles.section, { marginTop: 12 }]}>Past Challenges</Text>
            <FlatList
              data={competitions.slice(-3)}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.competitionCard}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.competitionTitle}>Challenge</Text>
                    <Text style={styles.competitionDate}>
                      {new Date(item.startDate).toLocaleDateString()} – {new Date(item.endDate).toLocaleDateString()}
                    </Text>
                  </View>
                  {item.winner && (
                    <View style={{ marginTop: 8 }}>
                      <Text style={styles.winnerText}>
                        {(item.winners?.length ?? 0) > 1 ? "🏆 Winners: " : "🏆 Winner: "}
                        {joinNames((item.winners ?? [item.winner]).map((w) => w.name))}
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
              <Text style={styles.fieldLabel}>Choose a picture</Text>
              <AvatarPicker value={avatar} onChange={setAvatar} />
              <TextInput
                placeholder="4-digit PIN"
                value={pin}
                onChangeText={(t) => setPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
                keyboardType="number-pad"
                style={styles.input}
              />
              <View style={{ flexDirection: "row", gap: 8 }}>
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

        <Modal visible={editKidId !== null} transparent animationType="slide">
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Edit Kid</Text>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                placeholder="Name"
                value={editKidName}
                onChangeText={setEditKidName}
                style={styles.input}
              />
              <Text style={styles.fieldLabel}>Choose a picture</Text>
              <AvatarPicker value={editKidAvatar} onChange={setEditKidAvatar} />
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={saveKidEdit}>
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#ccc" }]}
                  onPress={() => setEditKidId(null)}
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
                <View
                  key={index}
                  style={{
                    marginBottom: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <TextInput
                    placeholder={`Subtask ${index + 1}`}
                    value={subtask.title}
                    onChangeText={(value) => {
                      const updated = [...subtasks];
                      updated[index] = { ...updated[index], title: value };
                      setSubtasks(updated);
                    }}
                    style={[styles.input, { flex: 1 }]}
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
                    style={[styles.input, { width: 64, textAlign: "center" }]}
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
              <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
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

        <Modal
          visible={resetPinModalVisible}
          transparent
          animationType="slide"
          onShow={() => focusSoon(resetPinRef)}
        >
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Reset Parent Passcode</Text>
              <Text style={{ color: "#666", marginBottom: 12 }}>
                Enter a new 4-digit parent access code for this dashboard.
              </Text>
              <TextInput
                ref={resetPinRef}
                autoFocus
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
              <View style={{ flexDirection: "row", gap: 8 }}>
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

        <Modal
          visible={kidPinModalVisible}
          transparent
          animationType="slide"
          onShow={() => focusSoon(kidPinRef)}
        >
          <View style={styles.modalBack}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Reset Kid Passcode</Text>
              <Text style={{ color: "#666", marginBottom: 12 }}>
                {kids.find((k) => k.id === kidToResetId)?.name ?? "Select kid"}
              </Text>
              <TextInput
                ref={kidPinRef}
                autoFocus
                placeholder="New 4-digit PIN"
                value={kidPinInput}
                onChangeText={(t) => setKidPinInput(t.replace(/[^0-9]/g, "").slice(0, 4))}
                keyboardType="number-pad"
                style={styles.input}
              />
              <View style={{ flexDirection: "row", gap: 8 }}>
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
              <Text style={{ color: "#666", marginBottom: 6 }}>
                {kids.find((k) => k.id === penaltyKidId)?.name ?? "Select kid"}
              </Text>
              <Text style={{ color: "#333", marginBottom: 6 }}>
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
              <Text style={{ fontWeight: "700", marginTop: 8 }}>
                Attach to task (optional)
              </Text>
              <FlatList
                data={tasks}
                keyExtractor={(t) => t.id}
                horizontal
                style={{ marginVertical: 8 }}
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
                    <Text style={{ fontWeight: "800" }}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#e63946" }]}
                  onPress={() => {
                    if (!penaltyKidId) {
                      Alert.alert("Choose a kid", "Please tap a kid's name first, then try again.");
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
                      Alert.alert("Couldn't save", "Please try again.");
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
              <Text style={{ color: "#666", marginBottom: 6 }}>
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
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  style={[styles.bonusBtn, { flex: 1 }]}
                  onPress={() => {
                    if (!bonusKidId) {
                      Alert.alert("Choose a kid", "Please tap a kid's name first, then try again.");
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
              <Text style={styles.modalTitle}>End Challenge & Award Prize</Text>
              <Text style={{ color: "#666", marginBottom: 12 }}>
                This will reset every kid&apos;s stars, bonuses, and penalties to zero and start a
                fresh challenge.
              </Text>
              {kids.length > 0 && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontWeight: "800", marginBottom: 8 }}>
                    {leaders.length > 1 ? "🏆 Winners (tied):" : "🏆 Winner:"}
                  </Text>
                  <View style={styles.winnerRow}>
                    <Text style={styles.winnerEmoji}>⭐</Text>
                    <Text style={styles.winnerText}>
                      {leaders.length > 0
                        ? `${leaderNames} (${leaderStars} ⭐)`
                        : "No stars earned yet"}
                    </Text>
                  </View>
                </View>
              )}
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#28a745" }]}
                  onPress={() => {
                    resetCompetition();
                    setResetModalVisible(false);
                    showToast("🚀 New challenge started. Everyone's stars are back to zero.");
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
              <Text style={{ marginTop: 16, fontWeight: "600", marginBottom: 8 }}>
                Subtasks
              </Text>
              {editSubtasks.map((s, idx) => (
                <View
                  key={idx}
                  style={{
                    marginBottom: 8,
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Subtask"
                    value={s.title}
                    onChangeText={(txt) => {
                      const updated = [...editSubtasks];
                      updated[idx].title = txt;
                      setEditSubtasks(updated);
                    }}
                  />
                  <TextInput
                    style={[styles.input, { width: 60, textAlign: "center" }]}
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
                style={[styles.btn, { marginTop: 8, backgroundColor: "#007bff" }]}
                onPress={() => {
                  const updated = [...editSubtasks, { title: "Subtask", stars: "1" }];
                  setEditSubtasks(updated);
                }}
              >
                <Text style={styles.btnText}>+ Add Subtask</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
                <TouchableOpacity
                  style={[styles.btn, { flex: 1, backgroundColor: "#28a745" }]}
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
      {/* The PIN prompt is an in-screen overlay, not a <Modal>: presenting a Modal
          while this screen is still sliding in can freeze the app on iOS. */}
      {authModalVisible && (
        <View style={[StyleSheet.absoluteFill, styles.modalBack]}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {parentPin ? "Enter Parent Access Code" : "Set Parent Access Code"}
            </Text>
            <Text style={{ color: "#666", marginBottom: 12 }}>
              {parentPin
                ? "Enter your 4-digit dashboard access code."
                : "Create a 4-digit dashboard access code to protect parent access."}
            </Text>
            {parentPin ? (
              <>
                <TextInput
                  ref={parentUnlockPinRef}
                  autoFocus
                  placeholder="4-digit PIN"
                  value={parentPinInput}
                  onChangeText={(t) => setParentPinInput(t.replace(/[^0-9]/g, "").slice(0, 4))}
                  keyboardType="number-pad"
                  style={styles.input}
                />
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={verifyParentPin}>
                    <Text style={styles.btnText}>Unlock</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, { flex: 1, backgroundColor: "#ccc" }]}
                    onPress={() => router.back()}
                  >
                    <Text style={[styles.btnText, { color: "#000" }]}>Back</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <TextInput
                  ref={parentSetupPinRef}
                  autoFocus
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
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={saveParentPin}>
                    <Text style={styles.btnText}>Save PIN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, { flex: 1, backgroundColor: "#ccc" }]}
                    onPress={() => router.back()}
                  >
                    <Text style={[styles.btnText, { color: "#000" }]}>Back</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const CARD = {
  backgroundColor: colors.card,
  borderRadius: radii.lg,
  ...shadows.sm,
};

const PILL_BTN = {
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
  borderRadius: radii.md,
  marginTop: spacing.sm,
  marginRight: spacing.sm,
  minWidth: 98,
  alignItems: "center" as const,
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, backgroundColor: colors.bg },
  headerCard: { ...CARD, padding: spacing.lg, marginBottom: spacing.lg },
  title: { fontSize: 26, fontWeight: "800", color: colors.text },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs },
  summaryRow: {
    flexDirection: "row",
    marginTop: spacing.lg,
    justifyContent: "space-between",
  },
  summaryTile: { alignItems: "center", flex: 1 },
  tileNumber: { fontSize: 22, fontWeight: "800", color: colors.primary },
  tileLabel: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: palette.starSoft,
  },
  leaderEmoji: { fontSize: 22 },
  leaderLabel: { fontSize: 11, fontWeight: "700", color: "#8A5B00", letterSpacing: 0.4 },
  leaderName: { fontSize: 15, fontWeight: "800", color: colors.text, marginTop: 2 },
  leaderChevron: { fontSize: 22, color: colors.textFaint },
  crownedAvatar: { marginTop: spacing.lg },
  actionsRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg },
  primaryBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: colors.onPrimary, fontWeight: "800" },
  ghostBtn: {
    flex: 1,
    backgroundColor: palette.accentSoft,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostBtnText: { color: palette.accentDark, fontWeight: "800" },
  sectionCard: { ...CARD, padding: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { fontWeight: "800", marginBottom: spacing.md, fontSize: 16, color: colors.text },
  kidCard: { ...CARD, padding: spacing.lg, marginBottom: spacing.md },
  kidHeaderRow: { flexDirection: "row", alignItems: "center" },
  kidNameLabel: { color: colors.textFaint, fontSize: 11, marginBottom: spacing.xs },
  kidName: { fontWeight: "800", fontSize: 20, color: colors.text },
  kidStatsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  kidStatBlock: { flex: 1, minWidth: 0 },
  kidStatLabel: { color: colors.textMuted, fontSize: 11, marginBottom: spacing.xs },
  kidStatValue: { fontWeight: "800", fontSize: 16, color: colors.text },
  kidActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: spacing.md,
  },
  smallEditBtn: { ...PILL_BTN, backgroundColor: palette.infoSoft },
  smallEditBtnText: { color: colors.info, fontWeight: "800", fontSize: 13 },
  smallPrimaryBtn: { ...PILL_BTN, backgroundColor: colors.primary },
  smallPrimaryBtnText: { color: colors.onPrimary, fontWeight: "800", fontSize: 13 },
  smallPenaltyBtn: { ...PILL_BTN, backgroundColor: colors.danger },
  smallPenaltyBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  smallResetPinBtn: { ...PILL_BTN, backgroundColor: palette.warning },
  smallResetPinBtnText: { color: "#4A3200", fontWeight: "800", fontSize: 13 },
  smallDeleteBtn: { ...PILL_BTN, backgroundColor: "#C22E51" },
  smallDeleteBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  taskCard: {
    backgroundColor: palette.infoSoft,
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  subtaskChip: {
    backgroundColor: colors.card,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalBack: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.overlay,
  },
  modalCard: {
    margin: spacing.xl,
    backgroundColor: colors.card,
    padding: spacing.xl,
    borderRadius: radii.xl,
    ...shadows.lg,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: spacing.md, color: colors.text },
  fieldLabel: { fontSize: 13, fontWeight: "700", color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  penaltyBtn: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  penaltyBtnText: { color: "#fff", fontWeight: "800" },
  penaltyModalCard: {
    margin: spacing.xl,
    backgroundColor: colors.card,
    padding: spacing.xl,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: palette.dangerSoft,
    ...shadows.lg,
  },
  penaltyModalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: spacing.sm,
    color: colors.danger,
  },
  btn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: colors.onPrimary, textAlign: "center", fontWeight: "700" },
  bonusBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  section: { marginTop: spacing.xl, fontWeight: "800", fontSize: 16, color: colors.text },
  todayKidCard: {
    ...CARD,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  todayKidName: { fontWeight: "800", fontSize: 16, color: colors.text },
  competitionCard: { ...CARD, padding: spacing.lg, marginBottom: spacing.md },
  competitionTitle: { fontWeight: "800", fontSize: 16, color: colors.text },
  competitionDate: { fontSize: 12, color: colors.textMuted },
  winnerRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  winnerEmoji: { fontSize: 20, marginRight: spacing.sm },
  winnerText: { fontWeight: "700", fontSize: 14, color: palette.accentDark },
  secondPlaceText: {
    fontWeight: "600",
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  rankingsText: { fontSize: 12, color: colors.textMuted, marginTop: spacing.sm },
});
