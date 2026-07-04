// app/screens/LoginScreen.tsx

import { auth } from "@/lib/firebase/config";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { alertNetworkError, checkInternet, isNetworkError } from "../utils/netUtils";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        router.replace("/(tabs)");
      }
    });
    return unsubscribe;
  }, [router]);

  const loginParent = async () => {
    if (!email || !password) {
      Alert.alert("Required", "Please enter email and password");
      return;
    }

    if (!(await checkInternet())) return;

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Login error:", error);
      if (isNetworkError(error)) {
        alertNetworkError();
      } else if (error?.code === "auth/user-not-found") {
        Alert.alert(
          "User Not Registered",
          "This email is not registered. Please register first."
        );
      } else {
        Alert.alert("Login Failed", "Invalid email or password");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/star-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        /></View>
      <Text style={styles.title}>Parent Login</Text>
      <Text style={styles.subtitle}>
        Enter your registered password to continue.
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(t) => setEmail(t.replace(/\s/g, ''))}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(t) => setPassword(t.replace(/\s/g, ''))}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={loginParent}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/screens/ResetPasswordScreen")}
      >
        <Text style={styles.link}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/screens/RegisterScreen")}
      >
        <Text style={styles.link}>New user? Register here</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#F7FBFF",
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
    backgroundColor: "#FB8500",
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
    color: "#FB8500",
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
