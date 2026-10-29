import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { Text } from "./ui";
import { palette } from "@/constants/theme";
import { t } from "@/lib/i18n";

export default function NoInternetBanner() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [wasOffline, setWasOffline] = useState(false);
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const backOnlineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = !!(state.isConnected && state.isInternetReachable !== false);
      setIsConnected(connected);
      if (!connected) setWasOffline(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isConnected === false) {
      if (backOnlineTimer.current) clearTimeout(backOnlineTimer.current);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    } else if (isConnected === true && wasOffline) {
      backOnlineTimer.current = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -60,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setWasOffline(false));
      }, 1800);
    }
    return () => {
      if (backOnlineTimer.current) clearTimeout(backOnlineTimer.current);
    };
  }, [isConnected, wasOffline, slideAnim]);

  if (!wasOffline && isConnected !== false) return null;

  const offline = isConnected === false;

  return (
    <Animated.View
      style={[
        styles.banner,
        offline ? styles.offlineBanner : styles.onlineBanner,
        { transform: [{ translateY: slideAnim }], pointerEvents: 'none' },
      ]}
    >
      <Text style={styles.icon}>{offline ? '📡' : '✅'}</Text>
      <Text style={styles.text}>
        {offline ? t('net.offline_banner') : t('net.online_banner')}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  offlineBanner: {
    backgroundColor: palette.ink,
  },
  onlineBanner: {
    backgroundColor: palette.success,
  },
  icon: {
    fontSize: 14,
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
