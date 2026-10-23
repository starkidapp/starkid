import { ReactNode } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText, Card, Screen } from "@/components/ui";
import { spacing } from "@/constants/theme";
import LanguageSwitcher from "./LanguageSwitcher";

interface AuthScreenProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Rendered under the form card (links, secondary actions). */
  footer?: ReactNode;
  /** Hide the brand logo (e.g. confirmation screens). */
  showLogo?: boolean;
}

export default function AuthScreen({
  title,
  subtitle,
  children,
  footer,
  showLogo = true,
}: AuthScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <Screen scroll center contentContainerStyle={styles.content}>
        {showLogo ? (
          <View style={styles.logoWrap}>
            <Image
              source={require("../../assets/images/starbo-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        ) : null}

        <AppText variant="title" align="center">
          {title}
        </AppText>
        {subtitle ? (
          <AppText
            variant="body"
            color="textMuted"
            align="center"
            style={styles.subtitle}
          >
            {subtitle}
          </AppText>
        ) : null}

        <Card style={styles.card} padding="2xl">
          {children}
        </Card>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </Screen>

      {/* Pinned to the top-right corner (also in Arabic/RTL mode). */}
      <View
        pointerEvents="box-none"
        style={[styles.languageBar, { top: insets.top + spacing.sm }]}
      >
        <LanguageSwitcher />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  // Extra top room so the logo never sits under the language toggle.
  content: {
    gap: spacing.sm,
    paddingTop: spacing["4xl"] + spacing["2xl"],
    paddingBottom: spacing["3xl"],
  },
  languageBar: {
    position: "absolute",
    left: 0,
    right: 0,
    direction: "ltr",
    alignItems: "flex-end",
    paddingHorizontal: spacing.xl,
  },
  logoWrap: {
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  logo: { width: 150, height: 150 },
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.md },
  card: { gap: spacing.xs },
  footer: { marginTop: spacing.xl, gap: spacing.sm, alignItems: "center" },
});
