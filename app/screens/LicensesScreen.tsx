import { StyleSheet, View } from 'react-native';
import { AppText, Badge, Card } from '@/components/ui';
import { spacing } from '@/constants/theme';
import ArticleScreen from '../components/ArticleScreen';
import { t } from "@/lib/i18n";

const LIBRARIES = [
  { name: 'React Native', license: 'MIT', description: 'licenses.rn' },
  { name: 'Expo', license: 'MIT', description: 'licenses.expo' },
  { name: 'Firebase', license: 'Apache 2.0', description: 'licenses.firebase' },
  { name: 'Expo Router', license: 'MIT', description: 'licenses.router' },
  { name: 'React Navigation', license: 'MIT', description: 'licenses.nav' },
  { name: 'Lottie', license: 'Apache 2.0', description: 'licenses.lottie' },
];

export default function LicensesScreen() {
  return (
    <ArticleScreen
      navTitle={t('licenses.title')}
      title={t('licenses.title')}
      emoji="⚖️"
      subtitle={t('licenses.subtitle')}
      accent="danger"
    >
      <Card tone="danger" accentBar>
        <AppText variant="body" color="textMuted">
          {t('licenses.intro')}
        </AppText>
      </Card>

      {LIBRARIES.map((lib) => (
        <Card key={lib.name}>
          <View style={styles.head}>
            <AppText variant="bodyStrong" style={{ flex: 1 }}>
              {lib.name}
            </AppText>
            <Badge tone="primary" size="sm">
              {lib.license}
            </Badge>
          </View>
          <AppText variant="caption" color="textMuted" style={{ marginTop: spacing.xs }}>
            {t(lib.description)}
          </AppText>
        </Card>
      ))}

      <Card tone="primary" accentBar>
        <AppText variant="subtitle">{t('licenses.info')}</AppText>
        <AppText variant="body" color="textMuted" style={{ marginTop: spacing.xs }}>
          {t('licenses.info_body')}
        </AppText>
      </Card>
    </ArticleScreen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
