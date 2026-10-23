import { ReactNode } from "react";
import { Image, StyleSheet, View } from "react-native";
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
  return (
    <Screen scroll center contentContainerStyle={styles.content}>
      <LanguageSwitcher style={styles.language} />
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
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm, paddingVertical: spacing["3xl"] },
  language: { alignSelf: "flex-end" },
  logoWrap: {
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  logo: { width: 150, height: 150 },
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.md },
  card: { gap: spacing.xs },
  footer: { marginTop: spacing.xl, gap: spacing.sm, alignItems: "center" },
});
