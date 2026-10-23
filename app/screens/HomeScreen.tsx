
import { AppText, Badge, IconButton } from "@/components/ui";
import { colors, palette, radii, shadows, spacing } from "@/constants/theme";
import { auth, db } from "@/lib/firebase/config";
import { t } from "@/lib/i18n";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useKids } from "../context/KidContext";
import { useLoading, useWithLoading } from "../context/LoadingContext";
import { capitalizeWords } from "../utils/textUtils";

export default function HomeScreen() {
  const router = useRouter();
  const { kids } = useKids();
  const [parentName, setParentName] = useState("");
  const withLoading = useWithLoading();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const fetchParentName = async () => {
      try {
        await withLoading(async () => {
          const currentUser = auth.currentUser;
          if (currentUser) {
            const docRef = doc(db, "parents", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setParentName(docSnap.data()?.parentName || "");
            }
          }
        });
      } catch (error) {
        console.error("Error fetching parent name:", error);
      }
    };

    fetchParentName();
  }, []);

  const handleKidsAreaPress = () => {
    if (kids.length === 0) {
      Alert.alert(
        t("home.no_kids_title"),
        t("home.no_kids_msg"),
      );
    } else {
      router.push("/screens/KidScreen");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t("home.logout_title"),
      t("home.logout_msg"),
      [
        {
          text: t("home.cancel"),
          style: "cancel",
        },
        {
          text: t("home.logout_confirm"),
          style: "destructive",
          onPress: async () => {
            showLoading();
            try {
              await signOut(auth);
              router.replace("/screens/LoginScreen");
            } catch (error) {
              console.error("Error logging out:", error);
              Alert.alert(
                t("home.error_logout"),
                t("home.error_logout_msg")
              );
            } finally {
              hideLoading();
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Soft background blobs */}
      <View style={styles.bgBlobLeft} />
      <View style={styles.bgBlobRight} />
      <View style={styles.bgBlobBottomLeft} />
      <View style={styles.bgBlobBottomRight} />

      <View style={styles.header}>
        <LanguageSwitcher />
        <IconButton
          icon="power"
          variant="surface"
          color={colors.danger}
          onPress={handleLogout}
          accessibilityLabel={t("home.logout_confirm")}
        />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/starbo-logo.png")}
            style={styles.starHeroImage}
            resizeMode="contain"
          />
        </View>

        {parentName ? (
          <Badge tone="primary" style={styles.greeting}>
            {t("home.welcome", { name: capitalizeWords(parentName) })}
          </Badge>
        ) : null}

        <View style={styles.buttonContainer}>
          <ActionCard
            onPress={handleKidsAreaPress}
            icon="planet"
            title={t("home.kids_area")}
            subtitle={t("home.kids_area_subtitle")}
            bg={palette.primary}
            border={palette.primaryDark}
            shadowColor="#3B32C0"
          />
          <ActionCard
            onPress={() => router.push("/screens/ParentDashboard?from=index")}
            icon="ribbon"
            title={t("home.parent_area")}
            subtitle={t("home.parent_area_subtitle")}
            bg={palette.accent}
            border={palette.accentDark}
            shadowColor="#B55C00"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function ActionCard({
  onPress,
  icon,
  title,
  subtitle,
  bg,
  border,
  shadowColor,
}: {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  bg: string;
  border: string;
  shadowColor: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.dashboardCard,
        { backgroundColor: bg, borderColor: border, shadowColor },
        pressed && styles.cardPressed,
      ]}
    >
      {/* Own clipping layer so the circles stay inside without cutting off the card's shadow. */}
      <View pointerEvents="none" style={styles.cardDecor}>
        <View style={[styles.cardCircle, styles.cardCircleA]} />
        <View style={[styles.cardCircle, styles.cardCircleB]} />
        <View style={styles.cardRing} />
      </View>
      <View style={styles.cardIconBackground}>
        <Ionicons name={icon} size={28} color="#FFF" />
      </View>
      <View style={styles.cardTextContent}>
        <AppText variant="heading" color="#fff">
          {title}
        </AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.9)" style={{ marginTop: 2 }}>
          {subtitle}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.75)" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    overflow: "hidden",
  },
  bgBlobLeft: {
    position: "absolute",
    top: -40,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(108, 99, 255, 0.08)",
    pointerEvents: "none",
  },
  bgBlobRight: {
    position: "absolute",
    top: 160,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(251, 133, 0, 0.07)",
    pointerEvents: "none",
  },
  bgBlobBottomLeft: {
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(251, 133, 0, 0.06)",
    pointerEvents: "none",
  },
  bgBlobBottomRight: {
    position: "absolute",
    bottom: 80,
    right: -70,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(108, 99, 255, 0.07)",
    pointerEvents: "none",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    alignItems: "center",
    zIndex: 10,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    marginTop: -20,
    zIndex: 2,
  },
  // The StarBo logo already carries the app name, so no separate title text.
  logoContainer: {
    marginBottom: spacing.xs,
  },
  starHeroImage: {
    width: 210,
    height: 210,
  },
  greeting: {
    alignSelf: "center",
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    width: "100%",
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  dashboardCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 2,
    ...shadows.playful,
  },
  cardDecor: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.xl - 2,
    overflow: "hidden",
  },
  cardCircle: {
    position: "absolute",
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  cardCircleA: { width: 110, height: 110, top: -50, right: 20 },
  cardCircleB: { width: 70, height: 70, bottom: -34, right: -14 },
  cardRing: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.25)",
    bottom: 8,
    left: "45%",
  },
  cardPressed: { transform: [{ translateY: 2 }], opacity: 0.95 },
  cardIconBackground: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTextContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
});