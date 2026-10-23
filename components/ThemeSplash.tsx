import * as SplashScreen from "expo-splash-screen";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, useWindowDimensions } from "react-native";

// Deep purple from the StarBo app icon; also the native launch screen colour
// in app.json, so the hand-off between the two is seamless.
export const THEME_SPLASH_BACKGROUND = "#3B1F8F";

const GRADIENT = ["#2A1580", THEME_SPLASH_BACKGROUND, "#5A3CD3"] as const;
const LOGO = require("../assets/images/starbo-logo.png");

/** Hide the native launch screen; safe to call more than once. */
export function hideNativeSplash() {
  SplashScreen.hideAsync().catch(() => {});
}

/** Full-screen StarBo logo on the brand purple, shown while the app starts up. */
export default function ThemeSplash() {
  const { width, height } = useWindowDimensions();
  // The logo is square: fit it fully inside the screen on phones, tablets and
  // landscape alike, never cropped or zoomed past the screen edges.
  const logoSize = Math.min(width * 0.85, height * 0.6, 560);

  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <LinearGradient colors={GRADIENT} style={styles.root}>
      <StatusBar hidden />
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Image
          source={LOGO}
          style={{ width: logoSize, height: logoSize }}
          resizeMode="contain"
          // Swap the native launch screen for this screen once the logo is on
          // screen, otherwise the launch screen covers it until the first route is ready.
          onLoadEnd={hideNativeSplash}
        />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME_SPLASH_BACKGROUND,
  },
});
