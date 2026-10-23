// src/screens/MandatoryUpdateScreen.tsx

import { Linking, Platform, StyleSheet, View } from "react-native";
import { AppText, Button, Screen } from "@/components/ui";
import { spacing } from "@/constants/theme";

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
          Update Required
        </AppText>
        <AppText variant="body" color="textMuted" align="center" style={styles.message}>
          A new version of StarBo is available. Please update the app to keep using it.
        </AppText>
        <Button title="Update Now" onPress={openStore} playful size="lg" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: "center", gap: spacing.md },
  icon: { fontSize: 72, marginBottom: spacing.sm },
  message: { marginBottom: spacing.lg, maxWidth: 320 },
});
