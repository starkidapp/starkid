import * as Application from 'expo-application';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { AppText, ListRow, Screen, SectionHeader } from '@/components/ui';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import ScreenHeader from '../components/ScreenHeader';
import { t } from "@/lib/i18n";

export default function ExploreScreen() {
  const appVersion = Application.nativeApplicationVersion || '1.0.0';
  const go = (path: string) => router.push(path as any);

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title={t("explore.title")} showBackButton={false} />
      <Screen scroll topInset={false} contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[palette.primary, palette.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Image
            source={require('../../assets/images/starbo-logo.png')}
            style={styles.heroImg}
            resizeMode="contain"
          />
          <AppText variant="title" color="#fff" align="center">
            {t("explore.welcome")}
          </AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.9)" align="center" style={styles.heroSub}>
            {t("explore.welcome_sub")}
          </AppText>
        </LinearGradient>

        <View style={styles.section}>
          <SectionHeader title={t("explore.support")} emoji="💬" />
          <View style={styles.rows}>
            <ListRow
              emoji="📧"
              iconTone="info"
              title={t("explore.contact")}
              subtitle={t("explore.contact_sub")}
              onPress={() => go('/screens/ContactSupportScreen')}
            />
            <ListRow
              emoji="❓"
              iconTone="accent"
              title={t("explore.faq")}
              subtitle={t("explore.faq_sub")}
              onPress={() => go('/screens/FaqScreen')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title={t("explore.legal")} emoji="📋" />
          <View style={styles.rows}>
            <ListRow
              emoji="🔒"
              iconTone="primary"
              title={t("explore.privacy")}
              subtitle={t("explore.privacy_sub")}
              onPress={() => go('/screens/PrivacyPolicyScreen')}
            />
            <ListRow
              emoji="📜"
              iconTone="success"
              title={t("explore.terms")}
              subtitle={t("explore.terms_sub")}
              onPress={() => go('/screens/TermsAndConditionsScreen')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title={t("explore.about")} emoji="ℹ️" />
          <View style={styles.rows}>
            <ListRow
              emoji="🚀"
              iconTone="star"
              title={t("explore.story")}
              subtitle={t("explore.story_sub")}
              onPress={() => go('/screens/AboutUsScreen')}
            />
            <ListRow
              emoji="🎉"
              iconTone="neutral"
              title={t("explore.version")}
              subtitle={t('explore.version_value', { version: appVersion })}
              showChevron={false}
            />
          </View>
        </View>

        <AppText variant="caption" color="textFaint" align="center" style={styles.footer}>
          {t("explore.footer")}
        </AppText>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing['4xl'] },
  hero: {
    borderRadius: radii.xl,
    padding: spacing['2xl'],
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  heroImg: { width: 120, height: 120, marginBottom: spacing.sm },
  heroSub: { marginTop: spacing.xs },
  section: { marginBottom: spacing.xl },
  rows: { gap: spacing.sm },
  footer: { marginTop: spacing.lg, lineHeight: 20 },
});
