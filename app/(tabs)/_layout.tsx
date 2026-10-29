import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fontFamilyForWeight, palette, radii, shadows } from "@/constants/theme";
import { t } from "@/lib/i18n";

const TABS = [
  { name: "index", label: "tabs.home", icon: "home-outline", activeIcon: "home", color: palette.primary },
  { name: "explore", label: "tabs.explore", icon: "rocket-outline", activeIcon: "rocket", color: palette.accent },
  { name: "parent", label: "tabs.parent", icon: "ribbon-outline", activeIcon: "ribbon", color: palette.success },
] as const;

function getActiveIndex(pathname: string): number {
  if (pathname.includes("explore")) return 1;
  if (pathname.includes("parent")) return 2;
  return 0;
}

function TabButton({ props, focused, label, icon, activeIcon, color }: {
  props: any;
  focused: boolean;
  label: string;
  icon: string;
  activeIcon: string;
  color: string;
}) {
  return (
    <Pressable {...props} style={styles.tabBtn}>
      <View style={[styles.pill, focused && { backgroundColor: color }]}>
        <Ionicons
          name={(focused ? activeIcon : icon) as any}
          size={22}
          color={focused ? colors.onPrimary : colors.textFaint}
        />
        {focused && <Text style={styles.label}>{t(label)}</Text>}
      </View>
    </Pressable>
  );
}

export default function TabLayout() {
  const pathname = usePathname();
  const activeIdx = getActiveIndex(pathname);
  const insets = useSafeAreaInsets();

  const tabBarHeight = 56 + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: tabBarHeight,
          paddingBottom: insets.bottom,
        },
      }}
    >
      {TABS.map(({ name, label, icon, activeIcon, color }, index) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            headerShown: false,
            tabBarButton: (props) => (
              <TabButton
                props={props}
                focused={activeIdx === index}
                label={label}
                icon={icon}
                activeIcon={activeIcon}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    paddingTop: 8,
    borderTopWidth: 0,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    ...shadows.lg,
    shadowOffset: { width: 0, height: -4 },
  },
  tabBtn: { flex: 1, alignItems: "center", justifyContent: "center" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: radii.lg,
    gap: 6,
  },
  label: {
    fontFamily: fontFamilyForWeight("700"),
    fontSize: 13,
    fontWeight: "700",
    color: colors.onPrimary,
  },
});
