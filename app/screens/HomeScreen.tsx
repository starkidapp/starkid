import { auth, db } from "@/lib/firebase/config";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
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

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFF8E7",
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
});
