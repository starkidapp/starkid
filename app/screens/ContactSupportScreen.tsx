import { router } from 'expo-router';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, ListRow } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import ArticleScreen from '../components/ArticleScreen';

const HOURS = [
  { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 4:00 PM' },
  { day: 'Sunday', time: 'Closed' },
];

export default function ContactSupportScreen() {
  const openEmail = () => {
    Linking.openURL('mailto:starkid.app@gmail.com').catch(() =>
      Alert.alert('Couldn\'t open email', 'Please email us at starkid.app@gmail.com.'),
    );
  };

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/971561326221').catch(() =>
      Alert.alert('Couldn\'t open WhatsApp', 'Please make sure WhatsApp is installed.'),
    );
  };

  return (
    <ArticleScreen
      navTitle="Contact Support"
      title="Get in Touch"
      emoji="📞"
      subtitle="We're here to help — choose your preferred way to reach us."
      accent="danger"
    >
      <View style={styles.rows}>
        <ListRow
          emoji="📧"
          iconTone="info"
          title="Email Us"
          subtitle="starkid.app@gmail.com"
          onPress={openEmail}
        />
        <ListRow
          emoji="💬"
          iconTone="success"
          title="WhatsApp"
          subtitle="Chat with us instantly"
          onPress={openWhatsApp}
        />
      </View>

      <Card tone="primary" accentBar>
        <AppText variant="subtitle">⏰ Support Hours</AppText>
        <View style={styles.hours}>
          {HOURS.map((h) => (
            <View key={h.day} style={styles.hourRow}>
              <AppText variant="body">{h.day}</AppText>
              <AppText variant="bodyStrong" color="primary">
                {h.time}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <AppText variant="subtitle">❓ Frequently Asked Questions</AppText>
        <AppText variant="body" color="textMuted" style={styles.p}>
          Before reaching out, check our FAQ for quick answers to common questions.
        </AppText>
        <Button
          title="View FAQ"
          variant="subtle"
          size="sm"
          fullWidth
          style={{ marginTop: spacing.md }}
          onPress={() => router.push('/screens/FaqScreen')}
        />
      </Card>

      <Card tone="star" accentBar>
        <AppText variant="subtitle">⚡ Response Time</AppText>
        <AppText variant="body" color="textMuted" style={styles.p}>
          We aim to respond to all inquiries within 24 hours during business days. Thanks for your
          patience!
        </AppText>
      </Card>
    </ArticleScreen>
  );
}

const styles = StyleSheet.create({
  rows: { gap: spacing.sm },
  p: { marginTop: spacing.xs },
  hours: { marginTop: spacing.md, gap: spacing.xs },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
