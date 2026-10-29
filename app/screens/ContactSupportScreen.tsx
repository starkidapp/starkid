import { router } from 'expo-router';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, ListRow } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import ArticleScreen from '../components/ArticleScreen';
import { t } from "@/lib/i18n";

const HOURS = [
  { day: 'contact.mon_fri', time: 'contact.mon_fri_time' },
  { day: 'contact.sat', time: 'contact.sat_time' },
  { day: 'contact.sun', time: 'contact.closed' },
];

export default function ContactSupportScreen() {
  const openEmail = () => {
    Linking.openURL('mailto:starkid.app@gmail.com').catch(() =>
      Alert.alert(t('links.email_fail'), t('links.email_fail_msg')),
    );
  };

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/971561326221').catch(() =>
      Alert.alert(t('links.whatsapp_fail'), t('links.whatsapp_fail_msg')),
    );
  };

  return (
    <ArticleScreen
      navTitle={t('contact.nav')}
      title={t('contact.title')}
      emoji="📞"
      subtitle={t('contact.subtitle')}
      accent="danger"
    >
      <View style={styles.rows}>
        <ListRow
          emoji="📧"
          iconTone="info"
          title={t('contact.email')}
          subtitle="starkid.app@gmail.com"
          onPress={openEmail}
        />
        <ListRow
          emoji="💬"
          iconTone="success"
          title={t('contact.whatsapp')}
          subtitle={t('contact.whatsapp_sub')}
          onPress={openWhatsApp}
        />
      </View>

      <Card tone="primary" accentBar>
        <AppText variant="subtitle">{t('contact.hours')}</AppText>
        <View style={styles.hours}>
          {HOURS.map((h) => (
            <View key={h.day} style={styles.hourRow}>
              <AppText variant="body">{t(h.day)}</AppText>
              <AppText variant="bodyStrong" color="primary">
                {t(h.time)}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <AppText variant="subtitle">{t('contact.faq')}</AppText>
        <AppText variant="body" color="textMuted" style={styles.p}>
          {t('contact.faq_body')}
        </AppText>
        <Button
          title={t('contact.view_faq')}
          variant="subtle"
          size="sm"
          fullWidth
          style={{ marginTop: spacing.md }}
          onPress={() => router.push('/screens/FaqScreen')}
        />
      </Card>

      <Card tone="star" accentBar>
        <AppText variant="subtitle">{t('contact.response')}</AppText>
        <AppText variant="body" color="textMuted" style={styles.p}>
          {t('contact.response_body')}
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
