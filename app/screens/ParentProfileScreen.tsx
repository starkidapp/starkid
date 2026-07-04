import { auth, db } from "@/lib/firebase/config";
import { router, useLocalSearchParams } from "expo-router";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { alertNetworkError, checkInternet, isNetworkError } from "../utils/netUtils";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AppState,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { useKids } from "../context/KidContext";
import { capitalizeWords } from "../utils/textUtils";

export default function ParentProfileScreen() {
  const { fromParentDashboard } = useLocalSearchParams();
  const { kids, updateKid } = useKids();
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState(auth.currentUser?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newParentPin, setNewParentPin] = useState("");
  const [confirmParentPin, setConfirmParentPin] = useState("");
  const [parentPin, setParentPin] = useState<string | null>(null);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [parentPinInputAttempt, setParentPinInputAttempt] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const appState = useRef(AppState.currentState);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingParentName, setSavingParentName] = useState(false);
  const [savingParentPin, setSavingParentPin] = useState(false);
  const [kidPins, setKidPins] = useState<Record<string, string>>({});

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.replace("/screens/LoginScreen");
      return;
    }

    const loadProfile = async () => {
      try {
        const docRef = doc(db, "parents", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setParentName(data.parentName || "");
          setEmail(data.email || currentUser.email || "");
          setParentPin(data.parentPin ?? null);
        }
      } catch (error) {
        console.error("Unable to load parent profile:", error);
      } finally {
        setInitialLoadComplete(true);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (!initialLoadComplete) {
      return;
    }

    const fromDashboard = fromParentDashboard === "1";

    if (parentPin) {
      if (fromDashboard) {
        setAuthenticated(true);
        setAuthModalVisible(false);
      } else {
        setAuthenticated(false);
        setAuthModalVisible(true);
      }
    }
  }, [parentPin, initialLoadComplete, fromParentDashboard]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        if (parentPin) {
          setAuthenticated(false);
          setAuthModalVisible(true);
        }
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [parentPin]);

  useEffect(() => {
    const nextPins = kids.reduce<Record<string, string>>((acc, kid) => {
      acc[kid.id] = kid.pin;
      return acc;
    }, {});
    setKidPins(nextPins);
  }, [kids]);

  const canSaveParentName = useMemo(
    () => parentName.trim().length > 0,
    [parentName],
  );

  const saveParentName = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    if (!canSaveParentName) {
      Alert.alert("Validation", "Please enter a parent name.");
      return;
    }

    if (!(await checkInternet())) return;
    setSavingParentName(true);
    try {
      await setDoc(
        doc(db, "parents", currentUser.uid),
        { parentName: parentName.trim(), email: currentUser.email },
        { merge: true },
      );
      Alert.alert("Saved", "Parent profile updated.");
    } catch (error: any) {
      console.error("Profile save failed:", error);
      if (isNetworkError(error)) { alertNetworkError(); } else { Alert.alert("Save failed", error.message || "Unable to save profile."); }
    } finally {
      setSavingParentName(false);
    }
  };

  const changePassword = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Not signed in", "Please sign in again.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Required", "Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Validation", "New passwords do not match.");
      return;
    }

    if (!(await checkInternet())) return;
    setSavingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email ?? "",
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Success", "Password updated successfully.");
    } catch (error: any) {
      console.error("Password update failed:", error);
      if (isNetworkError(error)) { alertNetworkError(); } else { Alert.alert("Password update failed", error.message || "Unable to update password."); }
    } finally {
      setSavingPassword(false);
    }
  };

  const saveParentPin = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Not signed in", "Please sign in again.");
      return;
    }

    if (!/^[0-9]{4}$/.test(newParentPin)) {
      Alert.alert("Validation", "PIN must be exactly 4 digits.");
      return;
    }

    if (newParentPin !== confirmParentPin) {
      Alert.alert("Validation", "PINs do not match.");
      return;
    }

    if (!(await checkInternet())) return;
    setSavingParentPin(true);

    try {
      await setDoc(
        doc(db, "parents", user.uid),
        { parentPin: newParentPin },
        { merge: true },
      );
      setParentPin(newParentPin);
      setNewParentPin("");
      setConfirmParentPin("");
      Alert.alert("Saved", "Parent access code updated.");
    } catch (error: any) {
      console.error("Parent PIN save failed:", error);
      if (isNetworkError(error)) { alertNetworkError(); } else { Alert.alert("Save failed", error.message || "Unable to update PIN."); }
    } finally {
      setSavingParentPin(false);
    }
  };

  const saveKidPins = () => {
    let changed = false;

    kids.forEach((kid) => {
      const pinValue = kidPins[kid.id] ?? kid.pin;
      if (pinValue && pinValue !== kid.pin) {
        updateKid({ ...kid, pin: pinValue });
        changed = true;
      }
    });

    if (changed) {
      Alert.alert("Saved", "Kid pins have been updated.");
    } else {
      Alert.alert("No changes", "No kid PIN changes were detected.");
    }
  };

  const verifyParentPin = () => {
    if (parentPinInputAttempt === parentPin) {
      setAuthenticated(true);
      setAuthModalVisible(false);
      setParentPinInputAttempt("");
    } else {
      Alert.alert("Incorrect code", "Please try again.");
      setParentPinInputAttempt("");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace("/screens/LoginScreen");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader title="Parent Profile" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatarCircle}>
            <Text style={styles.profileAvatarText}>👤</Text>
          </View>
          <Text style={styles.profileTitle}>Parent Profile</Text>
          <Text style={styles.profileSubtitle}>{email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Profile Info</Text>
          <Text style={styles.label}>Parent Name</Text>
          <TextInput
            value={parentName}
            onChangeText={setParentName}
            placeholder="Enter parent name"
            style={styles.input}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            editable={false}
            style={[styles.input, styles.disabledInput]}
          />
          <TouchableOpacity
            style={[styles.button, !canSaveParentName && styles.disabledButton]}
            disabled={!canSaveParentName || savingParentName}
            onPress={saveParentName}
          >
            <Text style={styles.buttonText}>
              {savingParentName ? "Saving..." : "Save Profile"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current password"
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity
            style={[styles.button, styles.passwordButton]}
            disabled={savingPassword}
            onPress={changePassword}
          >
            <Text style={styles.buttonText}>
              {savingPassword ? "Updating..." : "Update Password"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Parent Access Code</Text>
          <Text style={styles.subtitleText}>
            {parentPin
              ? "Update the 4-digit parent dashboard access code."
              : "Set a 4-digit parent dashboard access code."}
          </Text>
          <TextInput
            value={newParentPin}
            onChangeText={(value) =>
              setNewParentPin(value.replace(/[^0-9]/g, "").slice(0, 4))
            }
            placeholder="New 4-digit code"
            keyboardType="number-pad"
            style={styles.input}
            maxLength={4}
          />
          <TextInput
            value={confirmParentPin}
            onChangeText={(value) =>
              setConfirmParentPin(value.replace(/[^0-9]/g, "").slice(0, 4))
            }
            placeholder="Confirm 4-digit code"
            keyboardType="number-pad"
            style={styles.input}
            maxLength={4}
          />
          <TouchableOpacity
            style={[styles.button, styles.passwordButton]}
            disabled={savingParentPin}
            onPress={saveParentPin}
          >
            <Text style={styles.buttonText}>
              {savingParentPin
                ? "Saving..."
                : parentPin
                  ? "Update Code"
                  : "Set Code"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kids PINs</Text>
          {kids.length === 0 ? (
            <Text style={styles.emptyText}>
              Add kids from the dashboard first.
            </Text>
          ) : (
            <FlatList
              data={kids}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.kidRow}>
                  <View>
                    <Text style={styles.kidName}>
                      {capitalizeWords(item.name)}
                    </Text>
                    <Text style={styles.kidHint}>PIN can be updated here.</Text>
                  </View>
                  <TextInput
                    style={styles.kidInput}
                    value={kidPins[item.id]}
                    onChangeText={(value) =>
                      setKidPins((prev) => ({ ...prev, [item.id]: value }))
                    }
                    keyboardType="number-pad"
                    placeholder="PIN"
                    maxLength={4}
                  />
                </View>
              )}
            />
          )}
          <TouchableOpacity style={styles.button} onPress={saveKidPins}>
            <Text style={styles.buttonText}>Save Kid PINs</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>

        <Modal visible={authModalVisible} animationType="slide" transparent>
          <View style={styles.authModalOverlay}>
            <View style={styles.authModalContainer}>
              <Text style={styles.authModalTitle}>
                Enter Parent Access Code
              </Text>
              <TextInput
                value={parentPinInputAttempt}
                onChangeText={(value) =>
                  setParentPinInputAttempt(
                    value.replace(/[^0-9]/g, "").slice(0, 4),
                  )
                }
                placeholder="4-digit code"
                keyboardType="number-pad"
                secureTextEntry
                style={styles.input}
                maxLength={4}
              />
              <TouchableOpacity style={styles.button} onPress={verifyParentPin}>
                <Text style={styles.buttonText}>Unlock</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5FA' },
  container: { flex: 1, backgroundColor: '#F5F5FA' },
  content: { padding: 20, paddingBottom: 40 },

  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  profileAvatarCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#EDEAFF',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#6C63FF', shadowOpacity: 0.2, shadowRadius: 10, elevation: 4,
  },
  profileAvatarText: { fontSize: 36 },
  profileTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A2E', marginBottom: 4 },
  profileSubtitle: { fontSize: 13, color: '#8A8F98' },

  card: {
    marginBottom: 14,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: '#8A8F98',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F5F5FA',
    borderRadius: 14,
    padding: 13,
    marginBottom: 12,
    fontSize: 15,
    color: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#EDEDF5',
  },
  disabledInput: { opacity: 0.6 },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  passwordButton: { backgroundColor: '#FB8500' },
  signOutButton: { backgroundColor: '#FF5D5D', marginTop: 14 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  disabledButton: { opacity: 0.65 },

  kidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F8',
  },
  kidName: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  kidHint: { color: '#8A8F98', fontSize: 12, marginTop: 2 },
  kidInput: {
    width: 90,
    backgroundColor: '#F5F5FA',
    borderRadius: 12,
    padding: 11,
    textAlign: 'center',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#EDEDF5',
  },
  emptyText: { color: '#8A8F98', fontSize: 14, marginBottom: 14 },

  authModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  authModalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  authModalTitle: {
    fontSize: 18, fontWeight: '700',
    marginBottom: 16, textAlign: 'center', color: '#1A1A2E',
  },

  heading: { fontSize: 26, fontWeight: '700', marginBottom: 20, color: '#1A1A2E' },
  subtitleText: { color: '#8A8F98', marginBottom: 12, fontSize: 13 },
});
