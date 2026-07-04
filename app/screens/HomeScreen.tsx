// import { auth, db } from "@/lib/firebase/config";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useKids } from "../context/KidContext";
// import { useWithLoading } from "../context/LoadingContext";
// import { capitalizeWords } from "../utils/textUtils";

// export default function HomeScreen() {
//   const router = useRouter();
//   const { kids } = useKids();
//   const [parentName, setParentName] = useState("");
//   const withLoading = useWithLoading();

//   useEffect(() => {
//     const fetchParentName = async () => {
//       try {
//         await withLoading(async () => {
//           const currentUser = auth.currentUser;
//           if (currentUser) {
//             const docRef = doc(db, "parents", currentUser.uid);
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//               setParentName(docSnap.data()?.parentName || "");
//             }
//           }
//         });
//       } catch (error) {
//         console.error("Error fetching parent name:", error);
//       }
//     };

//     fetchParentName();
//   }, []);

//   const handleKidsAreaPress = () => {
//     if (kids.length === 0) {
//       Alert.alert(
//         "No Kids Added",
//         "Please add kids first from the parents profile.",
//       );
//     } else {
//       router.push("/screens/KidScreen");
//     }
//   };

//   const handleLogout = () => {
//     Alert.alert(
//       "Logout",
//       "Are you sure you want to logout?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Logout",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await signOut(auth);
//               router.replace("/screens/LoginScreen");
//             } catch (error) {
//               console.error("Error logging out:", error);
//               Alert.alert(
//                 "Error",
//                 "Unable to logout. Please try again."
//               );
//             }
//           },
//         },
//       ]
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.switchOffBtn} onPress={handleLogout}>
//           <Ionicons name="power" size={24} color="#FF6B6B" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.mainContent}>
//         {parentName && (
//           <Text style={styles.greeting}>
//             Welcome, {capitalizeWords(parentName)}! 👋
//           </Text>
//         )}
//         <Text style={styles.title}>🌟 Star Kids 🌟</Text>

//         <TouchableOpacity style={styles.btn} onPress={handleKidsAreaPress}>
//           <Text style={styles.text}>Kids Area</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.btn, { backgroundColor: "#FB8500" }]}
//           onPress={() => router.push("/screens/ParentDashboard?from=index")}
//         >
//           <Text style={styles.text}>Parent Area</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF8E7",
//   },
//   header: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     alignItems: "center",
//   },
//   logoutBtn: {
//     flexDirection: "row", // Aligns Icon and Text horizontally
//     alignItems: "center",
//     backgroundColor: "rgba(230, 57, 70, 0.1)",
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "rgba(230, 57, 70, 0.2)",
//     gap: 6,
//   },
//   logoutText: {
//     color: "#E63946",
//     fontWeight: "700",
//     fontSize: 14,
//   },
//   mainContent: {
//     flex: 1,
//     justifyContent: "center",
//     paddingHorizontal: 20,
//     marginTop: -40,
//   },
//   greeting: {
//     fontSize: 18,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#6C63FF",
//   },
//   title: {
//     fontSize: 34,
//     fontWeight: "900",
//     textAlign: "center",
//     marginBottom: 40,
//   },
//   btn: {
//     backgroundColor: "#6C63FF",
//     padding: 20,
//     borderRadius: 20,
//     marginBottom: 16,
//   },
//   text: {
//     textAlign: "center",
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "800",
//   },
//   switchOffBtn: {
//     backgroundColor: "#FFF",
//     padding: 10,
//     borderRadius: 50,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
// });
// ----------------------------------------------

// import { auth, db } from "@/lib/firebase/config";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useKids } from "../context/KidContext";
// import { useWithLoading } from "../context/LoadingContext";
// import { capitalizeWords } from "../utils/textUtils";

// export default function HomeScreen() {
//   const router = useRouter();
//   const { kids } = useKids();
//   const [parentName, setParentName] = useState("");
//   const withLoading = useWithLoading();

//   useEffect(() => {
//     const fetchParentName = async () => {
//       try {
//         await withLoading(async () => {
//           const currentUser = auth.currentUser;
//           if (currentUser) {
//             const docRef = doc(db, "parents", currentUser.uid);
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//               setParentName(docSnap.data()?.parentName || "");
//             }
//           }
//         });
//       } catch (error) {
//         console.error("Error fetching parent name:", error);
//       }
//     };

//     fetchParentName();
//   }, []);

//   const handleKidsAreaPress = () => {
//     if (kids.length === 0) {
//       Alert.alert(
//         "No Kids Added",
//         "Please add kids first from the parents profile.",
//       );
//     } else {
//       router.push("/screens/KidScreen");
//     }
//   };

//   const handleLogout = () => {
//     Alert.alert(
//       "Logout",
//       "Are you sure you want to logout?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Logout",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await signOut(auth);
//               router.replace("/screens/LoginScreen");
//             } catch (error) {
//               console.error("Error logging out:", error);
//               Alert.alert(
//                 "Error",
//                 "Unable to logout. Please try again."
//               );
//             }
//           },
//         },
//       ]
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Playful background design rings */}
//       <View style={styles.bgBlobLeft} />
//       <View style={styles.bgBlobRight} />

//       {/* Top action header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.switchOffBtn} onPress={handleLogout}>
//           <Ionicons name="power" size={24} color="#FF6B6B" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.mainContent}>
//         {/* Labeled local assets image wrapper */}
//         <View style={styles.logoContainer}>
//           <Image
//             source={require("../../assets/images/star-icon.png")}
//             style={styles.starHeroImage}
//             resizeMode="contain"
//           />
//         </View>

//         {/* Dynamic Parental Greeting */}
//         {parentName && (
//           <Text style={styles.greetingText}>
//             Welcome, {capitalizeWords(parentName)}! 👋
//           </Text>
//         )}


//         <View style={styles.buttonContainer}>

//           <TouchableOpacity
//             style={[styles.dashboardCard, styles.kidsCard]}
//             onPress={handleKidsAreaPress}
//             activeOpacity={0.85}
//           >
//             <View style={styles.cardIconBackground}>
//               <Ionicons name="planet" size={30} color="#FFF" />
//             </View>
//             <View style={styles.cardTextContent}>
//               <Text style={styles.cardTitleText}>Kids Area</Text>
//               <Text style={styles.cardSubtitleText}>Fun tasks & rewards await!</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
//           </TouchableOpacity>

//           {/* Parents Management Action Card */}
//           <TouchableOpacity
//             style={[styles.dashboardCard, styles.parentCard]}
//             onPress={() => router.push("/screens/ParentDashboard?from=index")}
//             activeOpacity={0.85}
//           >
//             <View style={[styles.cardIconBackground, { backgroundColor: '#FF9F1C' }]}>
//               <Ionicons name="ribbon" size={30} color="#FFF" />
//             </View>
//             <View style={styles.cardTextContent}>
//               <Text style={styles.cardTitleText}>Parent Area</Text>
//               <Text style={styles.cardSubtitleText}>Manage tasks & settings</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
//           </TouchableOpacity>

//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF8E7", // Restored your original warm off-white cream color
//     overflow: "hidden",
//   },
//   bgBlobLeft: {
//     position: "absolute",
//     top: -40,
//     left: -40,
//     width: 180,
//     height: 180,
//     borderRadius: 90,
//     backgroundColor: "rgba(108, 99, 255, 0.07)",
//   },
//   bgBlobRight: {
//     position: "absolute",
//     top: 160,
//     right: -60,
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     backgroundColor: "rgba(251, 133, 0, 0.06)",
//   },
//   header: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     alignItems: "center",
//   },
//   switchOffBtn: {
//     backgroundColor: "#FFF",
//     padding: 11,
//     borderRadius: 50,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.12,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   mainContent: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 20,
//     marginTop: -20,
//   },
//   logoContainer: {
//     marginBottom: 12,
//     transform: [{ rotate: '-3deg' }],
//   },
//   starHeroImage: {
//     width: 120,
//     height: 120,
//   },
//   titleText: {
//     fontSize: 38,
//     fontWeight: "900",
//     color: "#2D2D2D",
//     marginBottom: 32,
//     letterSpacing: -0.5,
//   },
//   greetingText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#6C63FF",
//     marginBottom: 8,
//     backgroundColor: "rgba(108, 99, 255, 0.09)",
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 20,
//     overflow: "hidden",
//     textAlign: "center",
//   },
//   buttonContainer: {
//     width: "100%",
//     gap: 16,
//   },
//   dashboardCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 18,
//     borderRadius: 24,
//     borderWidth: 2,
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 1,
//     shadowRadius: 0,
//     elevation: 4,
//   },
//   kidsCard: {
//     backgroundColor: "#6C63FF",
//     borderColor: "#4F46E5",
//     shadowColor: "#3B32C0",
//   },
//   parentCard: {
//     backgroundColor: "#FB8500",
//     borderColor: "#E07200",
//     shadowColor: "#B55C00",
//   },
//   cardIconBackground: {
//     width: 52,
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: "rgba(255, 255, 255, 0.25)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cardTextContent: {
//     flex: 1,
//     marginLeft: 14,
//   },
//   cardTitleText: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: "#FFF",
//   },
//   cardSubtitleText: {
//     fontSize: 13,
//     fontWeight: "500",
//     color: "rgba(255, 255, 255, 0.85)",
//     marginTop: 2,
//   },
// });
import { auth, db } from "@/lib/firebase/config";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useKids } from "../context/KidContext";
import { useWithLoading } from "../context/LoadingContext";
import { capitalizeWords } from "../utils/textUtils";

export default function HomeScreen() {
  const router = useRouter();
  const { kids } = useKids();
  const [parentName, setParentName] = useState("");
  const withLoading = useWithLoading();

  useEffect(() => {
    const fetchParentName = async () => {
      try {
        await withLoading(async () => {
          const currentUser = auth.currentUser;
          if (currentUser) {
            const docRef = doc(db, "parents", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setParentName(docSnap.data()?.parentName || "");
            }
          }
        });
      } catch (error) {
        console.error("Error fetching parent name:", error);
      }
    };

    fetchParentName();
  }, []);

  const handleKidsAreaPress = () => {
    if (kids.length === 0) {
      Alert.alert(
        "No Kids Added",
        "Please add kids first from the parents profile.",
      );
    } else {
      router.push("/screens/KidScreen");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/screens/LoginScreen");
            } catch (error) {
              console.error("Error logging out:", error);
              Alert.alert(
                "Error",
                "Unable to logout. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background design elements (Top & Bottom) */}
      <View style={styles.bgBlobLeft} />
      <View style={styles.bgBlobRight} />
      <View style={styles.bgBlobBottomLeft} />
      <View style={styles.bgBlobBottomRight} />

      {/* Top action header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.switchOffBtn} onPress={handleLogout}>
          <Ionicons name="power" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* Labeled local assets image wrapper */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/star-icon.png")}
            style={styles.starHeroImage}
            resizeMode="contain"
          />
        </View>

        {/* Dynamic Parental Greeting */}
        {parentName && (
          <Text style={styles.greetingText}>
            Welcome, {capitalizeWords(parentName)}! 👋
          </Text>
        )}

        {/* Nav Buttons Container */}
        <View style={styles.buttonContainer}>

          {/* Kids Zone Action Card */}
          <TouchableOpacity
            style={[styles.dashboardCard, styles.kidsCard]}
            onPress={handleKidsAreaPress}
            activeOpacity={0.85}
          >
            <View style={styles.cardIconBackground}>
              <Ionicons name="planet" size={30} color="#FFF" />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitleText}>Kids Area</Text>
              <Text style={styles.cardSubtitleText}>Fun tasks & rewards await!</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          {/* Parents Management Action Card */}
          <TouchableOpacity
            style={[styles.dashboardCard, styles.parentCard]}
            onPress={() => router.push("/screens/ParentDashboard?from=index")}
            activeOpacity={0.85}
          >
            <View style={[styles.cardIconBackground, { backgroundColor: '#FF9F1C' }]}>
              <Ionicons name="ribbon" size={30} color="#FFF" />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitleText}>Parent Area</Text>
              <Text style={styles.cardSubtitleText}>Manage tasks & settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
    overflow: "hidden",
  },
  // Top Blobs
  bgBlobLeft: {
    position: "absolute",
    top: -40,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(108, 99, 255, 0.07)",
  },
  bgBlobRight: {
    position: "absolute",
    top: 160,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(251, 133, 0, 0.06)",
  },
  // New Bottom Blobs
  bgBlobBottomLeft: {
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(251, 133, 0, 0.05)",
  },
  bgBlobBottomRight: {
    position: "absolute",
    bottom: 80,
    right: -70,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(108, 99, 255, 0.06)",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: "center",
  },
  switchOffBtn: {
    backgroundColor: "#FFF",
    padding: 11,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: -20,
    zIndex: 1, // Ensures content stays cleanly on top of the background layout shapes
  },
  logoContainer: {
    marginBottom: 12,
    transform: [{ rotate: '-3deg' }],
  },
  starHeroImage: {
    width: 120,
    height: 120,
  },
  titleText: {
    fontSize: 38,
    fontWeight: "900",
    color: "#2D2D2D",
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6C63FF",
    marginBottom: 8,
    backgroundColor: "rgba(108, 99, 255, 0.09)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: "hidden",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  dashboardCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 24,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  kidsCard: {
    backgroundColor: "#6C63FF",
    borderColor: "#4F46E5",
    shadowColor: "#3B32C0",
  },
  parentCard: {
    backgroundColor: "#FB8500",
    borderColor: "#E07200",
    shadowColor: "#B55C00",
  },
  cardIconBackground: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTextContent: {
    flex: 1,
    marginLeft: 14,
  },
  cardTitleText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
  },
  cardSubtitleText: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 2,
  },
});