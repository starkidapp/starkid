import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Screen } from "@/components/ui";
import { palette, radii, shadows, spacing } from "@/constants/theme";
import ScreenHeader from "./ScreenHeader";

type Accent = "primary" | "accent" | "success" | "danger" | "info" | "star";

const GRADIENTS: Record<Accent, [string, string]> = {
  primary: [palette.primary, palette.primaryDark],
  accent: [palette.accent, palette.accentDark],
  success: [palette.success, "#039e78"],
  danger: [palette.danger, "#C22E51"],
  info: [palette.info, "#2176d6"],
  star: ["#FFD36B", palette.accent],
};

interface ArticleScreenProps {
  /** Text in the top nav bar. */
  navTitle: string;
  /** Big hero title inside the gradient card. */
  title: string;
  emoji?: string;
  subtitle?: string;
  accent?: Accent;
  children: ReactNode;
}

export default function ArticleScreen({
  navTitle,
  title,
  emoji,
  subtitle,
  accent = "primary",
  children,
}: ArticleScreenProps) {
  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title={navTitle} />
      <Screen scroll topInset={false} contentContainerStyle={styles.content}>
        <LinearGradient
          colors={GRADIENTS[accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {emoji ? <AppText style={styles.emoji}>{emoji}</AppText> : null}
          <AppText variant="title" color="#fff" align="center">
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="caption" color="rgba(255,255,255,0.9)" align="center" style={styles.subtitle}>
              {subtitle}
            </AppText>
          ) : null}
        </LinearGradient>

        <View style={styles.body}>{children}</View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing["4xl"] },
  hero: {
    borderRadius: radii.xl,
    padding: spacing["2xl"],
    alignItems: "center",
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  emoji: { fontSize: 48, marginBottom: spacing.sm },
  subtitle: { marginTop: spacing.xs },
  body: { gap: spacing.md },
});
