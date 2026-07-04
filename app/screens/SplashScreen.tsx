// import { router } from "expo-router";
// import { useEffect } from "react";
// import {
//     Image,
//     StyleSheet,
//     Text,
//     View,
// } from "react-native";

// export default function SplashScreen() {
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             router.replace("/screens/LoginScreen");
//         }, 2500);

//         return () => clearTimeout(timer);
//     }, []);

//     return (
//         <View style={styles.container}>
//             <Image
//                 source={require("../../assets/images/star-icon.png")}
//                 style={styles.logo}
//                 resizeMode="contain"
//             />

//             <Text style={styles.subtitle}>
//                 Learn • Play • Earn Stars
//             </Text>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#FFF8E7",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     logo: {
//         width: 180,
//         height: 180,
//     },
//     title: {
//         fontSize: 32,
//         fontWeight: "900",
//         color: "#6C63FF",
//         marginTop: 20,
//     },
//     subtitle: {
//         fontSize: 16,
//         color: "#666",
//         marginTop: 8,
//     },
// });
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function SplashScreen() {
    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/screens/LoginScreen");
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient
            colors={["#8FD3FF", "#D8F7FF", "#FFFBEA"]}
            style={styles.container}
        >
            {/* Floating stars */}

            <MaterialCommunityIcons
                name="star-four-points"
                size={28}
                color="#FFD93D"
                style={[styles.star, { top: 80, left: 40 }]}
            />

            <MaterialCommunityIcons
                name="star-four-points"
                size={20}
                color="#FFD93D"
                style={[styles.star, { top: 140, right: 50 }]}
            />

            <MaterialCommunityIcons
                name="star-four-points"
                size={16}
                color="#FFE45C"
                style={[styles.star, { bottom: 200, left: 60 }]}
            />

            <MaterialCommunityIcons
                name="cloud"
                size={65}
                color="#FFFFFF"
                style={[styles.cloud, { top: 120, right: -10 }]}
            />

            <MaterialCommunityIcons
                name="cloud"
                size={55}
                color="#FFFFFF"
                style={[styles.cloud, { top: 220, left: -10 }]}
            />

            {/* Logo */}

            <Image
                source={require("../../assets/images/star-icon.png")}
                style={styles.logo}
                resizeMode="contain"
            />


            <Text style={styles.subtitle}>
                Learn • Play • Earn Stars
            </Text>

            {/* Bottom decorations */}

            <View style={styles.bottomRow}>
                <Text style={styles.emoji}>🎈</Text>
                <Text style={styles.emoji}>🌈</Text>
                <Text style={styles.emoji}>🚀</Text>
                <Text style={styles.emoji}>⭐</Text>
                <Text style={styles.emoji}>🎉</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        width: 200,
        height: 200,
    },

    title: {
        marginTop: 20,
        fontSize: 38,
        fontWeight: "900",
        color: "#FF7A00",
        letterSpacing: 1,
    },

    subtitle: {
        marginTop: 12,
        fontSize: 18,
        color: "#4E5D6C",
        fontWeight: "600",
    },

    star: {
        position: "absolute",
    },

    cloud: {
        position: "absolute",
        opacity: 0.8,
    },

    bottomRow: {
        position: "absolute",
        bottom: 60,
        flexDirection: "row",
    },

    emoji: {
        fontSize: 28,
        marginHorizontal: 10,
    },
});