import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Snackbar({ visible, message, actionLabel, onAction, onHide }: { visible: boolean; message: string; actionLabel?: string; onAction?: () => void; onHide?: () => void; }) {
  const translateY = React.useRef(new Animated.Value(80)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
      const t = setTimeout(() => { onHide && onHide(); }, 4500);
      return () => clearTimeout(t);
    } else {
      Animated.timing(translateY, { toValue: 80, duration: 200, useNativeDriver: true }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <Text style={styles.message}>{message}</Text>
      {actionLabel ? (
        <TouchableOpacity onPress={() => { onAction && onAction(); onHide && onHide(); }}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 16, right: 16, bottom: 20, backgroundColor: '#111', padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 1000 },
  message: { color: '#fff', flex: 1, marginRight: 12 },
  action: { color: '#ffd166', fontWeight: '600' },
});
