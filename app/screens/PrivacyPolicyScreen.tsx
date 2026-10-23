import { Alert, Linking, StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@/components/ui';
import { spacing } from '@/constants/theme';
import ArticleScreen from '../components/ArticleScreen';

const SECTIONS: { title: string; body: string }[] = [
  {
    title: '1. Information We Collect',
    body:
      'We collect information you provide directly to us, such as:\n• Account information (email, password, name)\n• Child information (name, age, PIN)\n• Task and reward data\n• Usage analytics',
  },
  {
    title: '2. How We Use Your Information',
    body:
      'We use your information to:\n• Provide and improve our services\n• Enable parent-child communication\n• Send important notifications\n• Maintain security\n• Comply with legal obligations',
  },
  {
    title: '3. Data Security',
    body:
      'We implement industry-standard security measures to protect your data. All sensitive information is encrypted both in transit and at rest.',
  },
  {
    title: '4. Parental Consent',
    body:
      'Parents are responsible for obtaining appropriate consent for children under 13. By using StarBo with a child, you represent that you have the authority to provide such consent.',
  },
  {
    title: "5. Children's Privacy",
    body:
      'We do not knowingly collect personal information from children under 13 without verifiable parental consent. Parents can request deletion of their child’s information at any time.',
  },
  {
    title: '6. Third-Party Services',
    body:
      'We use secure cloud services from Google to handle sign-in and store your data. Google may process this information as described in its privacy policy.',
  },
  {
    title: '7. Data Retention',
    body:
      'We retain your data for as long as your account is active. You can request deletion of your data at any time.',
  },
  {
    title: '8. Your Rights',
    body:
      'You have the right to:\n• Access your personal data\n• Correct inaccurate data\n• Request deletion of data\n• Export your data',
  },
  {
    title: '9. Privacy Settings',
    body:
      'Parents can manage privacy settings and control what information is shared. Check your account settings for available options.',
  },
];

export default function PrivacyPolicyScreen() {
  const openEmail = async () => {
    const url = `mailto:starkid.app@gmail.com?subject=${encodeURIComponent('Privacy Policy Inquiry')}`;
    try {
      if (await Linking.canOpenURL(url)) await Linking.openURL(url);
      else Alert.alert('Couldn\'t open email', 'Please email us at starkid.app@gmail.com.');
    } catch {
      Alert.alert('Couldn\'t open email', 'Please email us at starkid.app@gmail.com.');
    }
  };

  const openWhatsApp = async () => {
    const url = 'https://wa.me/971561326221';
    try {
      if (await Linking.canOpenURL(url)) await Linking.openURL(url);
      else Alert.alert('Couldn\'t open WhatsApp', 'Please make sure WhatsApp is installed.');
    } catch {
      Alert.alert('Couldn\'t open WhatsApp', 'Please make sure WhatsApp is installed.');
    }
  };

  return (
    <ArticleScreen
      navTitle="Privacy Policy"
      title="Privacy Policy"
      emoji="🔒"
      subtitle="Last updated: June 2026"
      accent="primary"
    >
      <Card>
        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.section}>
            <AppText variant="bodyStrong">{s.title}</AppText>
            <AppText variant="body" color="textMuted" style={styles.body}>
              {s.body}
            </AppText>
          </View>
        ))}
      </Card>

      <Card tone="primary" accentBar>
        <AppText variant="subtitle">10. Contact Us</AppText>
        <AppText variant="body" color="textMuted" style={styles.body}>
          For privacy concerns, reach out through our active channels:
        </AppText>
        <View style={styles.actions}>
          <Button title="📧  Email us" variant="subtle" size="sm" fullWidth onPress={openEmail} />
          <Button title="💬  Chat via WhatsApp" variant="subtle" size="sm" fullWidth onPress={openWhatsApp} />
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
