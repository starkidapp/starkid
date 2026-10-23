import { auth, db } from "@/lib/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
// import { auth, db } from "../firebase/config";

export type Kid = { id: string; name: string; avatar: string; pin: string };

export type Subtask = { id: string; title: string; stars: number };
export type NewSubtask = { title: string; stars: number };
export type Task = { id: string; title: string; subtasks: Subtask[] };

export type Completion = {
  id: string;
  kidId: string;
  taskId: string;
  subtaskId: string;
  date: string;
  stars?: number;
  reason?: string;
  isBonus?: boolean;
  isPenalty?: boolean;
};

export type Competition = {
  id: string;
  month: string; // YYYY-MM
  startDate: string;
  endDate: string;
  rankings: { kidId: string; name: string; stars: number; rank: number }[];
  winner?: { kidId: string; name: string };
  /** Every kid tied for first place (older records only have `winner`). */
  winners?: { kidId: string; name: string }[];
  secondPlace?: { kidId: string; name: string };
};

type KidContextType = {
  kids: Kid[];
  tasks: Task[];
  completions: Completion[];
  competitions: Competition[];
  addKid: (kid: Omit<Kid, "id">) => void;
  updateKid: (kid: Kid) => void;
  removeKid: (id: string) => void;
  getKidById: (id: string) => Kid | undefined;
  addTask: (task: { title: string; subtasks: NewSubtask[] }) => void;
  updateTask: (task: Task) => void;
  removeTask: (id: string) => void;
  toggleCompletion: (
    kidId: string,
    taskId: string,
    subtaskId: string,
  ) => { added: boolean; message?: string };
  getKidStars: (kidId: string) => number;
  removeCompletion: (kidId: string, taskId: string, subtaskId: string) => void;
  updateCompletion: (completionId: string, updates: Partial<Completion>) => Promise<void>;
  getChallengeStars: (kidId: string) => number;
  /** Ids of every kid tied for the most stars in the current challenge (empty if nobody has stars). */
  getLeaderIds: () => string[];
  addBonus: (kidId: string, stars: number, reason?: string) => { id: string };
  addPenalty: (
    kidId: string,
    stars: number,
    reason?: string,
    taskId?: string,
  ) => { id: string };
  hasCompletedToday: (
    kidId: string,
    taskId: string,
    subtaskId: string,
  ) => boolean;
  resetCompetition: () => void;
};

const KidContext = createContext<KidContextType | undefined>(undefined);

export function useKids() {
  const ctx = useContext(KidContext);
  if (!ctx) throw new Error("useKids must be used within KidProvider");
  return ctx;
}

export function KidProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [kids, setKids] = useState<Kid[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadData(currentUser.uid);
      } else {
        setKids([]);
        setTasks([]);
        setCompletions([]);
      }
    });
    return unsubscribe;
  }, []);

  const loadData = async (userId: string) => {
    try {
      const docRef = doc(db, "parents", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const loadedKids = (data.kids || []).map((kid: any, idx: number) => {
          const id = kid?.id || `kid-${idx}`;
          const name =
            typeof kid?.name === "string" && kid.name.trim().length > 0
              ? kid.name.trim()
              : `Kid ${idx + 1}`;
          if (!kid?.name) {
            console.warn(`Missing kid name for record ${id}; using fallback '${name}'`);
          }
          return {
            id,
            name,
            avatar:
              typeof kid?.avatar === "string" && kid.avatar.trim().length > 0
                ? kid.avatar
                : "🧒",
            pin: typeof kid?.pin === "string" ? kid.pin : "",
          };
        });

        setKids(loadedKids);
        setTasks(data.tasks || []);
        setCompletions(data.completions || []);
        setCompetitions(data.competitions || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const saveData = async (
    userId: string,
    data: {
      kids?: Kid[];
      tasks?: Task[];
      completions?: Completion[];
      competitions?: Competition[];
    },
  ) => {
    try {
      // Clean the data to remove undefined values that Firestore doesn't accept
      const cleanData: any = {};

      if (data.kids) {
        cleanData.kids = data.kids;
      }
      if (data.tasks) {
        cleanData.tasks = data.tasks;
      }
      if (data.completions) {
        cleanData.completions = data.completions.map((completion) => {
          const cleaned: any = { ...completion };
          // Remove undefined values
          Object.keys(cleaned).forEach((key) => {
            if (cleaned[key] === undefined) {
              delete cleaned[key];
            }
          });
          return cleaned;
        });
      }
      if (data.competitions) {
        cleanData.competitions = data.competitions;
      }

      const docRef = doc(db, "parents", userId);
      await setDoc(docRef, cleanData, { merge: true });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const getActiveUserId = () => user?.uid || auth.currentUser?.uid || null;

  function addKid(k: Omit<Kid, "id">) {
    const id = Date.now().toString();
    const newKid = { id, ...k };
    setKids((s) => {
      const updated = [...s, newKid];
      const uid = getActiveUserId();
      if (uid) saveData(uid, { kids: updated });
      return updated;
    });
  }

  function updateKid(updatedKid: Kid) {
    setKids((s) => {
      const next = s.map((kid) =>
        kid.id === updatedKid.id ? updatedKid : kid,
      );
      const uid = getActiveUserId();
      if (uid) saveData(uid, { kids: next });
      return next;
    });
  }

  function removeKid(id: string) {
    setKids((s) => {
      const updated = s.filter((kid) => kid.id !== id);
      const uid = getActiveUserId();
      if (uid) saveData(uid, { kids: updated });
      return updated;
    });
    setCompletions((s) => {
      const updated = s.filter((completion) => completion.kidId !== id);
      if (user) saveData(user.uid, { completions: updated });
      return updated;
    });
  }

  function getKidById(id: string) {
    return kids.find((k) => k.id === id);
  }

  function addTask(t: { title: string; subtasks: NewSubtask[] }) {
    const id = Date.now().toString();
    const subtasks = t.subtasks.map((st) => ({
      ...st,
      id: Date.now().toString() + "-" + Math.random().toString(36).slice(2, 7),
    }));
    const newTask = { id, title: t.title, subtasks };
    setTasks((s) => {
      const updated = [...s, newTask];
      const uid = getActiveUserId();
      if (uid) saveData(uid, { tasks: updated });
      return updated;
    });
  }

  function updateTask(updatedTask: Task) {
    setTasks((s) => {
      const next = s.map((task) => (task.id === updatedTask.id ? updatedTask : task));
      const uid = getActiveUserId();
      if (uid) saveData(uid, { tasks: next });
      return next;
    });
  }

  function removeTask(id: string) {
    setTasks((s) => {
      const next = s.filter((task) => task.id !== id);
      const uid = getActiveUserId();
      if (uid) saveData(uid, { tasks: next });
      return next;
    });
    setCompletions((s) => {
      const next = s.filter((completion) => completion.taskId !== id);
      const uid = getActiveUserId();
      if (uid) saveData(uid, { completions: next });
      return next;
    });
  }

  function hasCompletedToday(kidId: string, taskId: string, subtaskId: string) {
    const today = new Date().toISOString().slice(0, 10);
    return completions.some(
      (c) =>
        c.kidId === kidId &&
        c.taskId === taskId &&
        c.subtaskId === subtaskId &&
        c.date === today,
    );
  }

  function toggleCompletion(kidId: string, taskId: string, subtaskId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const exists = completions.find(
      (c) =>
        c.kidId === kidId &&
        c.taskId === taskId &&
        c.subtaskId === subtaskId &&
        c.date === today,
    );
    if (exists) {
      return { added: false, message: "Already completed today" };
    }
    const cid =
      Date.now().toString() + "-" + Math.random().toString(36).slice(2, 8);
    setCompletions((s) => {
      const updated = [
        ...s,
        { id: cid, kidId, taskId, subtaskId, date: today },
      ];
      const uid = getActiveUserId();
      if (uid) saveData(uid, { completions: updated });
      return updated;
    });
    return { added: true };
  }

  function removeCompletion(kidId: string, taskId: string, subtaskId: string) {
    const today = new Date().toISOString().slice(0, 10);
    setCompletions((s) => {
      const updated = s.filter(
        (c) =>
          !(
            c.kidId === kidId &&
            c.taskId === taskId &&
            c.subtaskId === subtaskId &&
            c.date === today
          ),
      );
      const uid = getActiveUserId();
      if (uid) saveData(uid, { completions: updated });
      return updated;
    });
  }

  async function updateCompletion(completionId: string, updates: Partial<Completion>) {
    setCompletions((s) => {
      const updated = s.map((completion) =>
        completion.id === completionId ? { ...completion, ...updates } : completion,
      );
      const uid = getActiveUserId();
      if (uid) saveData(uid, { completions: updated });
      return updated;
    });
  }

  function addBonus(kidId: string, stars: number, reason?: string) {
    const id =
      Date.now().toString() + "-" + Math.random().toString(36).slice(2, 8);
    const today = new Date().toISOString().slice(0, 10);
    const subtaskId = "bonus-" + id;
    setCompletions((s) => {
      const updated = [
        ...s,
        {
          id,
          kidId,
          taskId: "__bonus__",
          subtaskId,
          date: today,
          stars,
          reason,
          isBonus: true,
        },
      ];
      const uid = getActiveUserId();
      if (uid) saveData(uid, { completions: updated });
      return updated;
    });
    return { id: subtaskId };
  }

  function addPenalty(
    kidId: string,
    stars: number,
    reason?: string,
    taskId?: string,
  ) {
    // stars should be positive number representing deduction
    const id =
      Date.now().toString() + "-" + Math.random().toString(36).slice(2, 8);
    const today = new Date().toISOString().slice(0, 10);
    const subtaskId = "penalty-" + id;
    const tId = taskId || "__penalty__";
    setCompletions((s) => {
      const updated = [
        ...s,
        {
          id,
          kidId,
          taskId: tId,
          subtaskId,
          date: today,
          stars,
          reason,
          isPenalty: true,
        },
      ];
      const uid = getActiveUserId();
      if (uid) saveData(uid, { completions: updated });
      return updated;
    });
    return { id: subtaskId };
  }

  function getKidStars(kidId: string) {
    // sum stars for completions (includes bonuses and subtracts penalties)
    return completions.reduce((acc, c) => {
      if (c.kidId !== kidId) return acc;
      if (c.isBonus) return acc + (c.stars || 0);
      if (c.isPenalty) return acc - (c.stars || 0);
      const task = tasks.find((t) => t.id === c.taskId);
      const sub = task?.subtasks.find((s) => s.id === c.subtaskId);
      return acc + (sub?.stars || 0);
    }, 0);
  }

  /** ISO date (YYYY-MM-DD) the current challenge started, or null if none has ended yet. */
  function getChallengeStart(): string | null {
    if (competitions.length === 0) return null;
    // The previous challenge's end date is when the current one began.
    return competitions[competitions.length - 1].endDate || null;
  }

  /** Stars a kid has earned in the CURRENT challenge (everything since the last reset). */
  function getChallengeStars(kidId: string) {
    const start = getChallengeStart();
    return completions.reduce((acc, c) => {
      if (c.kidId !== kidId) return acc;
      if (start && c.date < start) return acc;
      if (c.isBonus) return acc + (c.stars || 0);
      if (c.isPenalty) return acc - (c.stars || 0);
      const task = tasks.find((t) => t.id === c.taskId);
      const sub = task?.subtasks.find((s) => s.id === c.subtaskId);
      return acc + (sub?.stars || 0);
    }, 0);
  }

  function getLeaderIds() {
    const stars = kids.map((kid) => ({ id: kid.id, stars: getChallengeStars(kid.id) }));
    const top = Math.max(0, ...stars.map((k) => k.stars));
    if (top <= 0) return [];
    return stars.filter((k) => k.stars === top).map((k) => k.id);
  }

  function resetCompetition() {
    const today = new Date().toISOString().split("T")[0];
    const start =
      getChallengeStart() ??
      [...completions].map((c) => c.date).sort()[0] ??
      today;
    const kidRankings = kids
      .map((kid) => ({
        kidId: kid.id,
        name: kid.name,
        stars: getChallengeStars(kid.id),
      }))
      .sort((a, b) => b.stars - a.stars);
    // Kids with the same stars share a rank, so a tie for first gives several winners.
    const rankedKids = kidRankings.map((ranking) => ({
      ...ranking,
      rank: 1 + kidRankings.filter((other) => other.stars > ranking.stars).length,
    }));
    const winners = rankedKids
      .filter((r) => r.rank === 1 && r.stars > 0)
      .map((r) => ({ kidId: r.kidId, name: r.name }));
    const runnerUp = rankedKids.find((r) => r.rank > 1);

    const competition: Competition = {
      id: Date.now().toString(),
      month: new Date().toISOString().slice(0, 7),
      startDate: start,
      endDate: today,
      rankings: rankedKids,
      winners,
      // Omit (not undefined): competitions are saved to Firestore as-is.
      ...(winners[0] && { winner: winners[0] }),
      ...(runnerUp && { secondPlace: { kidId: runnerUp.kidId, name: runnerUp.name } }),
    };

    setCompetitions((prev) => [...prev, competition]);
    setCompletions([]);

    const uid = getActiveUserId();
    if (uid) {
      saveData(uid, {
        competitions: [...competitions, competition],
        completions: [],
      });
    }
  }

  return (
    <KidContext.Provider
      value={{
        kids,
        tasks,
        completions,
        competitions,
        addKid,
        updateKid,
        removeKid,
        getKidById,
        addTask,
        updateTask,
        removeTask,
        toggleCompletion,
        removeCompletion,
        updateCompletion,
        addBonus,
        addPenalty,
        getKidStars,
        getChallengeStars,
        getLeaderIds,
        hasCompletedToday,
        resetCompetition,
      }}
    >
      {children}
    </KidContext.Provider>
  );
}

export default KidContext;
