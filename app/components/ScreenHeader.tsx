import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightButton?: {
    icon: string;
    onPress: () => void;
  };
}

export default function ScreenHeader({
  title,
  onBackPress,
  showBackButton = true,
  rightButton,
}: ScreenHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color="#2D2A32" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {rightButton ? (
        <TouchableOpacity
          onPress={rightButton.onPress}
          style={styles.rightButton}
        >
          <Ionicons name={rightButton.icon as any} size={28} color="#6C63FF" />
        </TouchableOpacity>
      ) : (
        <View style={styles.sidePlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  rightButton: {
    padding: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sidePlaceholder: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2D2A32",
    flex: 1,
    textAlign: "center",
  },
});
