import { Alert, Linking, StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@/components/ui';
import { spacing } from '@/constants/theme';
import ArticleScreen from '../components/ArticleScreen';

const SECTIONS: { title: string; body: string }[] = [
  {
    title: '1. User Agreement',
    body:
      'By using StarBo, you agree to these terms and conditions. If you do not agree, please do not use our application.',
  },
  {
    title: '2. Age Requirements',
    body:
      "StarBo is designed for children with parental supervision. Parents are responsible for ensuring their children's usage complies with these terms.",
  },
  {
    title: '3. User Accounts',
    body:
      'You are responsible for maintaining the confidentiality of your account credentials. Parents must ensure their PIN/password is kept secure.',
  },
  {
    title: '4. Prohibited Activities',
    body:
      '• Unauthorized access or hacking\n• Sending harmful or abusive content\n• Attempting to circumvent parental controls\n• Reverse engineering or copying our app',
  },
  {
    title: '5. Intellectual Property',
    body:
      'All content, features, and functionality of StarBo are owned by us, licensed by our licensors, or otherwise used by permission.',
  },
  {
    title: '6. Limitation of Liability',
    body:
      'StarBo is provided “as is” without warranties. We are not liable for indirect, incidental, or consequential damages arising from your use of the app.',
  },
  {
    title: '7. Termination',
    body:
      'We reserve the right to terminate accounts that violate these terms or engage in prohibited activities.',
  },
  {
    title: '8. Changes to Terms',
    body:
      'We may update these terms periodically. Continued use of StarBo means you accept the updated terms.',
  },
  {
    title: '9. Governing Law',
    body: 'These terms are governed by applicable local and international laws.',
  },
];

export default function TermsAndConditionsScreen() {
  const openEmail = async () => {
    const url = `mailto:starkid.app@gmail.com?subject=${encodeURIComponent('Legal Inquiry')}`;
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
      navTitle="Terms & Conditions"
      title="Terms & Conditions"
      emoji="📜"
      subtitle="Last updated: June 2026"
      accent="success"
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

      <Card tone="success" accentBar>
        <AppText variant="subtitle">10. Contact Us</AppText>
        <AppText variant="body" color="textMuted" style={styles.body}>
          For questions about these terms, contact us:
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
