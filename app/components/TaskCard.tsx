import { t } from '@/lib/i18n';
import { AppText, Card, StarBadge } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { View } from 'react-native';

interface TaskCardProps {
  task: { title: string; stars: number };
  onPress: () => void;
}

export default function TaskCard({ task, onPress }: TaskCardProps) {
  return (
    <Card tone="info" onPress={onPress} style={{ marginBottom: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppText variant="subtitle" style={{ flex: 1 }}>
          {task.title}
        </AppText>
        <StarBadge count={task.stars} signed />
      </View>
      <AppText variant="caption" color="textMuted" style={{ marginTop: spacing.sm }}>
        {t('task.tap')}
      </AppText>
    </Card>
  );
}
