import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import ArticleScreen from '../components/ArticleScreen';

const FAQ_ITEMS = [
  {
    id: 1,
    question: '🎯 How do I earn stars?',
    answer:
      'Stars are earned by completing tasks and activities set by your parent. Each completed task gives you a certain number of stars based on its difficulty.',
  },
  {
    id: 2,
    question: '🏆 What can I redeem my stars for?',
    answer:
      'You can redeem your stars for rewards set up by your parent. These could be screen time, treats, privileges, or other special rewards.',
  },
  {
    id: 3,
    question: '👨‍👩‍👧 How does the parent dashboard work?',
    answer:
      "Parents can create tasks, set rewards, view progress, and manage their child's activities all in one place. The dashboard is passcode-protected for security.",
  },
  {
    id: 4,
    question: '📊 Can I see my progress?',
    answer:
      'Yes! You can see your stars for the current challenge, completed tasks, and leaderboard standings on the home and explore screens.',
  },
  {
    id: 5,
    question: '🔒 Is my information safe?',
    answer:
      'We take privacy seriously. All your information is encrypted and secured. Please review our Privacy Policy for more details.',
  },
  {
    id: 6,
    question: '📱 What devices can I use?',
    answer:
      'StarBo is available on iOS and Android devices. You can sync your account across multiple devices.',
  },
  {
    id: 7,
    question: '🆘 I forgot my PIN. What do I do?',
    answer:
      'A parent can reset your PIN from the Parent Profile screen. Parents can reset their own password from the login screen.',
  },
  {
    id: 8,
    question: '💔 How do I delete my account?',
    answer:
      "Contact our support team to request account deletion. We'll guide you through the process.",
  },
];

export default function FaqScreen() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <ArticleScreen
      navTitle="FAQ & Help"
      title="Frequently Asked Questions"
      emoji="❓"
      subtitle="Find quick answers to your questions"
      accent="accent"
    >
      {FAQ_ITEMS.map((item) => {
        const open = expandedId === item.id;
        return (
          <Card key={item.id} padding="none" style={styles.item}>
            <Pressable
              style={styles.questionRow}
              onPress={() => setExpandedId(open ? null : item.id)}
            >
              <AppText variant="bodyStrong" style={{ flex: 1 }}>
                {item.question}
              </AppText>
              <Ionicons
                name={open ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textFaint}
              />
            </Pressable>
            {open ? (
              <View style={styles.answer}>
                <AppText variant="body" color="textMuted">
                  {item.answer}
                </AppText>
              </View>
            ) : null}
          </Card>
        );
      })}

      <Card tone="success" accentBar>
        <AppText variant="subtitle">🆘 Still need help?</AppText>
        <AppText variant="body" color="textMuted" style={{ marginTop: spacing.xs }}>
          If you couldn&apos;t find your answer, contact our support team — we&apos;re always happy to
          help.
        </AppText>
      </Card>
    </ArticleScreen>
  );
}

const styles = StyleSheet.create({
  item: { overflow: 'hidden' },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  answer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
});
