import { Alert, Linking, StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@/components/ui';
import { spacing } from '@/constants/theme';
import ArticleScreen from '../components/ArticleScreen';
import { t } from "@/lib/i18n";

// Section text lives in lib/locales/*.json (terms.s1 / terms.s1_body …).
const SECTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
  title: `terms.s${n}`,
  body: `terms.s${n}_body`,
}));

export default function TermsAndConditionsScreen() {
  const openEmail = async () => {
    const url = `mailto:starkid.app@gmail.com?subject=${encodeURIComponent('Legal Inquiry')}`;
    try {
      if (await Linking.canOpenURL(url)) await Linking.openURL(url);
      else Alert.alert(t('links.email_fail'), t('links.email_fail_msg'));
    } catch {
      Alert.alert(t('links.email_fail'), t('links.email_fail_msg'));
    }
  };

  const openWhatsApp = async () => {
    const url = 'https://wa.me/971561326221';
    try {
      if (await Linking.canOpenURL(url)) await Linking.openURL(url);
      else Alert.alert(t('links.whatsapp_fail'), t('links.whatsapp_fail_msg'));
    } catch {
      Alert.alert(t('links.whatsapp_fail'), t('links.whatsapp_fail_msg'));
    }
  };

  return (
    <ArticleScreen
      navTitle={t('terms.title')}
      title={t('terms.title')}
      emoji="📜"
      subtitle={t('links.last_updated')}
      accent="success"
    >
      <Card>
        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.section}>
            <AppText variant="bodyStrong">{t(s.title)}</AppText>
            <AppText variant="body" color="textMuted" style={styles.body}>
              {t(s.body)}
            </AppText>
          </View>
        ))}
      </Card>

      <Card tone="success" accentBar>
        <AppText variant="subtitle">{t('links.contact_us')}</AppText>
        <AppText variant="body" color="textMuted" style={styles.body}>
          {t('terms.contact_body')}
        </AppText>
        <View style={styles.actions}>
          <Button title={t('links.email_us')} variant="subtle" size="sm" fullWidth onPress={openEmail} />
          <Button title={t('links.chat_whatsapp')} variant="subtle" size="sm" fullWidth onPress={openWhatsApp} />
        </View>
      </Card>
    </ArticleScreen>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  body: { marginTop: spacing.xs },
  actions: { marginTop: spacing.md, gap: spacing.sm },
});
