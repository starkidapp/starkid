import { StyleSheet, View } from 'react-native';
import { AppText, Badge, Card } from '@/components/ui';
import { spacing } from '@/constants/theme';
import ArticleScreen from '../components/ArticleScreen';

const LIBRARIES = [
  { name: 'React Native', license: 'MIT', description: 'A framework for building native apps with React.' },
  { name: 'Expo', license: 'MIT', description: 'An open-source platform for universal native apps with React.' },
  { name: 'Firebase', license: 'Apache 2.0', description: 'A platform for building web and mobile apps.' },
  { name: 'Expo Router', license: 'MIT', description: 'File-based routing for Expo applications.' },
  { name: 'React Navigation', license: 'MIT', description: 'Routing and navigation for React Native apps.' },
  { name: 'Lottie', license: 'Apache 2.0', description: 'Renders After Effects animations natively.' },
];

export default function LicensesScreen() {
  return (
    <ArticleScreen
      navTitle="Open Source Licenses"
      title="Open Source Licenses"
      emoji="⚖️"
      subtitle="Third-party libraries we use"
      accent="danger"
    >
      <Card tone="danger" accentBar>
        <AppText variant="body" color="textMuted">
          StarBo is built with amazing open-source libraries. We&apos;re grateful for the developers
          who maintain these projects.
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
            {lib.description}
          </AppText>
        </Card>
      ))}

      <Card tone="primary" accentBar>
        <AppText variant="subtitle">📝 License Information</AppText>
        <AppText variant="body" color="textMuted" style={{ marginTop: spacing.xs }}>
          Each library is licensed under its respective open-source license. For details, visit each
          project&apos;s repository.
        </AppText>
      </Card>
    </ArticleScreen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
