import { auth } from "@/lib/firebase/config";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("screen");

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setTimeout(() => {
        if (firebaseUser) {
          router.replace("/(tabs)");
        } else {
          router.replace("/screens/LoginScreen");
        }
      }, 2200);
    });
    return unsubscribe;
  }, [router]);

  return (
    <View style={styles.root}>
      <Image
        source={require("../assets/images/theme.png")}
        style={{ width, height }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width,
    height,
    overflow: "hidden",
  },
});
