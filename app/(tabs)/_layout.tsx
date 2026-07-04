import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, StyleSheet, Text, View } from "react-native";

const TABS = [
  { name: "index",   segment: "",        label: "Home",    icon: "home-outline",   activeIcon: "home",   color: "#6C63FF" },
  { name: "explore", segment: "explore", label: "Explore", icon: "rocket-outline", activeIcon: "rocket", color: "#FB8500" },
  { name: "parent",  segment: "parent",  label: "Parent",  icon: "ribbon-outline", activeIcon: "ribbon", color: "#06D6A0" },
];

function getActiveIndex(pathname: string): number {
  if (pathname.includes("explore")) return 1;
  if (pathname.includes("parent"))  return 2;
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
          color={focused ? "#fff" : "#B0B0C0"}
        />
        {focused && (
          <Text style={styles.label}>{label}</Text>
        )}
      </View>
    </Pressable>
  );
}

export default function TabLayout() {
  const pathname  = usePathname();
  const activeIdx = getActiveIndex(pathname);
  const insets    = useSafeAreaInsets();

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
    backgroundColor: "#fff",
    paddingTop: 8,
    borderTopWidth: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 14,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fff",
  },
});
