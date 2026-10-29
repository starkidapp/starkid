import { StyleSheet, View } from 'react-native';
import { AppText, Card } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import ArticleScreen from '../components/ArticleScreen';
import { t } from "@/lib/i18n";

const VALUES = [1, 2, 3, 4].map((n) => ({ title: `about.v${n}`, text: `about.v${n}_text` }));

const FEATURES = [1, 2, 3, 4, 5].map((n) => ({ title: `about.f${n}`, text: `about.f${n}_text` }));

function Bullets({ items }: { items: { title: string; text: string }[] }) {
  return (
    <View style={styles.bullets}>
      {items.map((it) => (
        <View key={it.title} style={styles.bullet}>
          <AppText variant="label" color="primary">
            {t(it.title)}
          </AppText>
          <AppText variant="caption" color="textMuted" style={{ marginTop: 2 }}>
            {t(it.text)}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export default function AboutUsScreen() {
  return (
    <ArticleScreen
      navTitle={t('about.nav')}
      title={t('about.title')}
      emoji="🚀"
      subtitle={t('about.subtitle')}
      accent="success"
    >
      <Card>
        <AppText variant="subtitle">{t('about.mission')}</AppText>
        <AppText variant="body" color="textMuted" style={styles.p}>
          {t('about.mission_body')}
        </AppText>
      </Card>

      <Card>
        <AppText variant="subtitle">{t('about.vision')}</AppText>
        <AppText variant="body" color="textMuted" style={styles.p}>
          {t('about.vision_body')}
        </AppText>
      </Card>

      <Card>
        <AppText variant="subtitle" style={styles.h}>
          {t('about.values')}
        </AppText>
        <Bullets items={VALUES} />
      </Card>

      <Card>
        <AppText variant="subtitle" style={styles.h}>
          {t('about.why')}
        </AppText>
        <Bullets items={FEATURES} />
      </Card>

      <Card tone="info" accentBar>
        <AppText variant="subtitle">{t('about.touch')}</AppText>
        <AppText variant="body" color="textMuted" style={styles.p}>
          {t('about.touch_body')}
        </AppText>
        <AppText variant="bodyStrong" color="info" style={styles.p}>
          📧 starkid.app@gmail.com
        </AppText>
      </Card>

      <Card tone="success" accentBar>
        <AppText variant="bodyStrong" color="success" align="center">
          {t('about.thanks')}
        </AppText>
      </Card>
    </ArticleScreen>
  );
}

const styles = StyleSheet.create({
  p: { marginTop: spacing.sm },
  h: { marginBottom: spacing.sm },
  bullets: { gap: spacing.md },
  bullet: {
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
