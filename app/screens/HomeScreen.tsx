import { auth, db } from "@/lib/firebase/config";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useKids } from "../context/KidContext";
import { capitalizeWords } from "../utils/textUtils";

export default function HomeScreen() {
  const router = useRouter();
  const { kids } = useKids();
  const [parentName, setParentName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParentName = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const docRef = doc(db, "parents", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setParentName(docSnap.data()?.parentName || "");
          }
        }
      } catch (error) {
        console.error("Error fetching parent name:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParentName();
  }, []);

  const handleKidsAreaPress = () => {
    if (kids.length === 0) {
      Alert.alert(
        "No Kids Added",
        "Please add kids first from the parents profile.",
      );
    } else {
      router.push("/screens/KidScreen");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/screens/LoginScreen");
            } catch (error) {
              console.error("Error logging out:", error);
              Alert.alert(
                "Error",
                "Unable to logout. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.switchOffBtn} onPress={handleLogout}>
          <Ionicons name="power" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {parentName && (
          <Text style={styles.greeting}>
            Welcome, {capitalizeWords(parentName)}! 👋
          </Text>
        )}
        <Text style={styles.title}>🌟 Star Kids 🌟</Text>

        <TouchableOpacity style={styles.btn} onPress={handleKidsAreaPress}>
          <Text style={styles.text}>Kids Area</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#FB8500" }]}
          onPress={() => router.push("/screens/ParentDashboard?from=index")}
        >
          <Text style={styles.text}>Parent Area</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: "center",
  },
  logoutBtn: {
    flexDirection: "row", // Aligns Icon and Text horizontally
    alignItems: "center",
    backgroundColor: "rgba(230, 57, 70, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(230, 57, 70, 0.2)",
    gap: 6,
  },
  logoutText: {
    color: "#E63946",
    fontWeight: "700",
    fontSize: 14,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: -40,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#6C63FF",
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 40,
  },
  btn: {
    backgroundColor: "#6C63FF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  text: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  switchOffBtn: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});