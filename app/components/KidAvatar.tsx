import { StyleSheet, Text, TouchableOpacity } from 'react-native';
interface KidAvatarProps {
  item: { avatar: string; name: string };
  selected: boolean;
  onPress: () => void;
  monthlyStars?: number;
  bonusCount?: number;
  penaltyCount?: number;
}

export default function KidAvatar({ item, selected, onPress }: KidAvatarProps) {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected]}
      onPress={onPress}
    >
      <Text style={styles.avatar}>{item.avatar}</Text>
      {typeof (null as any) !== 'undefined' && null}
      {/** show monthly stars badge if provided (handled by parent via prop) */}
      <Text style={styles.name}>{item.name}</Text>
      {/* badge is rendered by parent via overlay position in callers */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    width: 70,
  },
  selected: {
    backgroundColor: '#FFD166',
    borderWidth: 2,
    borderColor: '#FB8500',
  },
  avatar: { fontSize: 26 },
  name: { marginTop: 4, fontWeight: '700', fontSize: 12 },
});