import { t } from '@/lib/i18n';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface TaskCardProps {
  task: { title: string; stars: number };
  onPress: () => void;
}
export default function TaskCard({ task, onPress }: TaskCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.star}>+{task.stars} ⭐</Text>
      <Text style={styles.tap}>{t('task.tap')}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#90E0EF',
    padding: 20,
    borderRadius: 24,
    marginBottom: 14,
  },
  title: { fontSize: 22, fontWeight: '600' },
  star: { fontSize: 18, marginTop: 6 },
  tap: { marginTop: 8, fontWeight: '600' },
});