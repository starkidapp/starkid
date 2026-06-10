import { auth, db } from "@/lib/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, {
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
  toggleCompletion: (
    kidId: string,
    taskId: string,
    subtaskId: string,
  ) => { added: boolean; message?: string };
  getKidStars: (kidId: string) => number;
  removeCompletion: (kidId: string, taskId: string, subtaskId: string) => void;
  getMonthlyStars: (kidId: string) => number;
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

  function getMonthlyStars(kidId: string) {
    const ym = new Date().toISOString().slice(0, 7); // YYYY-MM
    return completions.reduce((acc, c) => {
      if (c.kidId !== kidId) return acc;
      if (!c.date.startsWith(ym)) return acc;
      if (c.isBonus) return acc + (c.stars || 0);
      if (c.isPenalty) return acc - (c.stars || 0);
      const task = tasks.find((t) => t.id === c.taskId);
      const sub = task?.subtasks.find((s) => s.id === c.subtaskId);
      return acc + (sub?.stars || 0);
    }, 0);
  }

  function resetCompetition() {
    // Calculate rankings for the current month before resetting
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const kidRankings = kids
      .map((kid) => ({
        kidId: kid.id,
        name: kid.name,
        stars: getMonthlyStars(kid.id),
      }))
      .sort((a, b) => b.stars - a.stars)
      .map((ranking, index) => ({ ...ranking, rank: index + 1 }));

    const competition: Competition = {
      id: Date.now().toString(),
      month: currentMonth,
      startDate: `${currentMonth}-01`,
      endDate: new Date().toISOString().split("T")[0], // Today's date
      rankings: kidRankings,
      winner: kidRankings[0]
        ? { kidId: kidRankings[0].kidId, name: kidRankings[0].name }
        : undefined,
      secondPlace: kidRankings[1]
        ? { kidId: kidRankings[1].kidId, name: kidRankings[1].name }
        : undefined,
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
        toggleCompletion,
        removeCompletion,
        addBonus,
        addPenalty,
        getKidStars,
        getMonthlyStars,
        hasCompletedToday,
        resetCompetition,
      }}
    >
      {children}
    </KidContext.Provider>
  );
}

export default KidContext;
