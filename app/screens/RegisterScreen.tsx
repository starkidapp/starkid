// app/screens/RegisterScreen.tsx

import { auth, db } from "@/lib/firebase/config";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        router.replace("/(tabs)");
      }
    });
    return unsubscribe;
  }, [router]);

  const registerParent = async () => {
    if (!parentName || !email || !password || !confirmPassword) {
      Alert.alert("Required", "Please fill all fields");
      console.log("Required", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords must match");
      console.log("Password Mismatch", "Passwords must match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Password", "Password should be at least 6 characters");
      console.log("Password", "Password should be at least 6 characters");
      return;
    }
    console.log(email.trim(), password.trim());
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim(),
      );

      await setDoc(doc(db, "parents", result.user.uid), {
        parentId: result.user.uid,
        parentName,
        email: email.trim(),
        createdAt: new Date(),
      });

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.icon}>🌟</Text> */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/star-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        /></View>
      <Text style={styles.title}>Create Parent Account</Text>
      <Text style={styles.subtitle}>
        Register once to manage your kids and stars.
      </Text>

      <TextInput
        placeholder="Parent name"
        value={parentName}
        onChangeText={setParentName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Parent password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={registerParent}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/screens/LoginScreen")}>
        <Text style={styles.link}>Already registered? Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFF8E7",
  },
  icon: {
    fontSize: 70,
    textAlign: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    color: "#2D2A32",
    marginTop: 12,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginVertical: 18,
    fontSize: 15,
  },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6C63FF",
    padding: 17,
    borderRadius: 20,
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 17,
    textAlign: "center",
  },
  link: {
    textAlign: "center",
    marginTop: 18,
    color: "#6C63FF",
    fontWeight: "800",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  logo: {
    width: 130,
    height: 130,
  },
});
