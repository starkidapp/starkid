// src/screens/MandatoryUpdateScreen.tsx

import { Linking, Platform, StyleSheet, View } from "react-native";
import { AppText, Button, Screen } from "@/components/ui";
import { spacing } from "@/constants/theme";
import { t } from "@/lib/i18n";

type Props = {
  appStoreUrl: string;
  playStoreUrl: string;
};

export default function MandatoryUpdateScreen({
  appStoreUrl,
  playStoreUrl,
}: Props) {
  const openStore = () => {
    const url = Platform.OS === "ios" ? appStoreUrl : playStoreUrl;
    Linking.openURL(url);
  };

  return (
    <Screen center>
      <View style={styles.content}>
        <AppText style={styles.icon}>🚀</AppText>
        <AppText variant="title" align="center">
          {t("mandatoryUpdate.title")}
        </AppText>
        <AppText variant="body" color="textMuted" align="center" style={styles.message}>
          {t("mandatoryUpdate.message")}
        </AppText>
        <Button title={t("mandatoryUpdate.update_now")} onPress={openStore} playful size="lg" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: "center", gap: spacing.md },
  icon: { fontSize: 72, marginBottom: spacing.sm },
  message: { marginBottom: spacing.lg, maxWidth: 320 },
});
