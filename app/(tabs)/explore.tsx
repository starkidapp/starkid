import * as Application from 'expo-application';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { AppText, ListRow, Screen, SectionHeader } from '@/components/ui';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import ScreenHeader from '../components/ScreenHeader';

export default function ExploreScreen() {
  const appVersion = Application.nativeApplicationVersion || '1.0.0';
  const go = (path: string) => router.push(path as any);

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title="Explore" showBackButton={false} />
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
            Welcome to StarBo
          </AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.9)" align="center" style={styles.heroSub}>
            Your guide to rewards and achievements
          </AppText>
        </LinearGradient>

        <View style={styles.section}>
          <SectionHeader title="Get Support" emoji="💬" />
          <View style={styles.rows}>
            <ListRow
              emoji="📧"
              iconTone="info"
              title="Contact Support"
              subtitle="Need help? Get in touch with our team"
              onPress={() => go('/screens/ContactSupportScreen')}
            />
            <ListRow
              emoji="❓"
              iconTone="accent"
              title="FAQ & Help"
              subtitle="Find answers to common questions"
              onPress={() => go('/screens/FaqScreen')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Legal & Policies" emoji="📋" />
          <View style={styles.rows}>
            <ListRow
              emoji="🔒"
              iconTone="primary"
              title="Privacy Policy"
              subtitle="How we protect your information"
              onPress={() => go('/screens/PrivacyPolicyScreen')}
            />
            <ListRow
              emoji="📜"
              iconTone="success"
              title="Terms & Conditions"
              subtitle="Our terms of service"
              onPress={() => go('/screens/TermsAndConditionsScreen')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="About StarBo" emoji="ℹ️" />
          <View style={styles.rows}>
            <ListRow
              emoji="🚀"
              iconTone="star"
              title="Our Story"
              subtitle="Learn about our mission and vision"
              onPress={() => go('/screens/AboutUsScreen')}
            />
            <ListRow
              emoji="🎉"
              iconTone="neutral"
              title="Version"
              subtitle={`StarBo v${appVersion}`}
              showChevron={false}
            />
          </View>
        </View>

        <AppText variant="caption" color="textFaint" align="center" style={styles.footer}>
          Made with 💚 for families everywhere{'\n'}© 2026 StarBo. All rights reserved.
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
