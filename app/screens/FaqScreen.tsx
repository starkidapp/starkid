import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import ArticleScreen from '../components/ArticleScreen';
import { t } from "@/lib/i18n";

// Question/answer text lives in lib/locales/*.json (faq.q1 / faq.a1 …).
const FAQ_ITEMS = [1, 2, 3, 4, 5, 6, 7, 8].map((id) => ({
  id,
  question: `faq.q${id}`,
  answer: `faq.a${id}`,
}));

export default function FaqScreen() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <ArticleScreen
      navTitle={t('faq.nav')}
      title={t('faq.title')}
      emoji="❓"
      subtitle={t('faq.subtitle')}
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
                {t(item.question)}
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
                  {t(item.answer)}
                </AppText>
              </View>
            ) : null}
          </Card>
        );
      })}

      <Card tone="success" accentBar>
        <AppText variant="subtitle">{t('faq.still_help')}</AppText>
        <AppText variant="body" color="textMuted" style={{ marginTop: spacing.xs }}>
          {t('faq.still_help_msg')}
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
