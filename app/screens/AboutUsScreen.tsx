import { StyleSheet, View } from 'react-native';
import { AppText, Card } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import ArticleScreen from '../components/ArticleScreen';

const VALUES = [
  { title: '🛡️ Safety First', text: "Your family's privacy and safety are our top priority." },
  { title: '👨‍👩‍👧‍👦 Family Focused', text: 'We design everything with families in mind.' },
  { title: '🎨 Creative & Fun', text: 'Learning should be enjoyable for everyone.' },
  { title: '🌱 Growth Mindset', text: 'We believe in continuous improvement and learning.' },
];

const FEATURES = [
  { title: '✓ Easy to Use', text: 'Simple interface designed for kids and parents' },
  { title: '✓ Secure & Private', text: 'Your data is encrypted and protected' },
  { title: '✓ Parent Controls', text: 'Full control over tasks, rewards, and progress' },
  { title: '✓ Real-time Tracking', text: 'Monitor progress instantly' },
  { title: '✓ Fun Gamification', text: 'Earn stars and unlock rewards' },
];

function Bullets({ items }: { items: { title: string; text: string }[] }) {
  return (
    <View style={styles.bullets}>
      {items.map((it) => (
        <View key={it.title} style={styles.bullet}>
          <AppText variant="label" color="primary">
            {it.title}
          </AppText>
          <AppText variant="caption" color="textMuted" style={{ marginTop: 2 }}>
            {it.text}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export default function AboutUsScreen() {
  return (
    <ArticleScreen
      navTitle="About StarBo"
      title="Our Story"
      emoji="🚀"
      subtitle="Making parenting and personal growth fun"
      accent="success"
    >
      <Card>
        <AppText variant="subtitle">🎯 Our Mission</AppText>
        <AppText variant="body" color="textMuted" style={styles.p}>
          StarBo was created with a simple mission: to make parenting easier and help children
          develop good habits in a fun, engaging way. We believe that motivation through positive
          reinforcement creates lasting behavioral change.
        </AppText>
      </Card>

      <Card>
        <AppText variant="subtitle">✨ Our Vision</AppText>
        <AppText variant="body" color="textMuted" style={styles.p}>
          We envision a world where families connect through shared goals and celebrate achievements
          together. We want to empower parents with tools to guide their children and help kids
          understand the value of hard work and persistence.
        </AppText>
      </Card>

      <Card>
        <AppText variant="subtitle" style={styles.h}>
          💜 Our Values
        </AppText>
        <Bullets items={VALUES} />
      </Card>

      <Card>
        <AppText variant="subtitle" style={styles.h}>
          ⭐ Why StarBo?
        </AppText>
        <Bullets items={FEATURES} />
      </Card>

      <Card tone="info" accentBar>
        <AppText variant="subtitle">📞 Get in Touch</AppText>
        <AppText variant="body" color="textMuted" style={styles.p}>
          Have suggestions or feedback? We&apos;d love to hear from you!
        </AppText>
        <AppText variant="bodyStrong" color="info" style={styles.p}>
          📧 starkid.app@gmail.com
        </AppText>
      </Card>

      <Card tone="success" accentBar>
        <AppText variant="bodyStrong" color="success" align="center">
          Thank you for being part of the StarBo family! 💚
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
