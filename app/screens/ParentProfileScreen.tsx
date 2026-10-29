import { Ionicons } from "@expo/vector-icons";
import { AppText, Button, Card, Dialog, Screen, TextField } from "@/components/ui";
import { colors, palette, radii, spacing } from "@/constants/theme";
import { auth, db } from "@/lib/firebase/config";
import { router, useLocalSearchParams } from "expo-router";
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { friendlyErrorMessage } from "../utils/errorUtils";
import { alertNetworkError, checkInternet, isNetworkError } from "../utils/netUtils";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, AppState, Pressable, StyleSheet, View } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import { useKids } from "../context/KidContext";
import { useLoading } from "../context/LoadingContext";
import { useToast } from "../context/ToastContext";
import { capitalizeWords, joinNames } from "../utils/textUtils";
import { t } from "@/lib/i18n";

export default function ParentProfileScreen() {
  const { fromParentDashboard } = useLocalSearchParams();
  const { kids, updateKid, getChallengeStars, getLeaderIds } = useKids();

  // Kids tied on the most stars lead together.
  const leaderIds = getLeaderIds();
  const leaders = kids.filter((k) => leaderIds.includes(k.id));
  const leader =
    leaders.length > 0
      ? {
          name: joinNames(leaders.map((k) => capitalizeWords(k.name))),
          stars: getChallengeStars(leaders[0].id),
        }
      : null;
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();
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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.replace("/screens/LoginScreen");
      return;
    }

    const loadProfile = async () => {
      showLoading();
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
        hideLoading();
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
      Alert.alert(t("profile.missing_name"), t("profile.missing_name_msg"));
      return;
    }

    if (!(await checkInternet())) return;
    setSavingParentName(true);
    showLoading();
    try {
      await setDoc(
        doc(db, "parents", currentUser.uid),
        { parentName: parentName.trim(), email: currentUser.email },
        { merge: true },
      );
      showToast(t("profile.name_saved"));
    } catch (error: any) {
      console.error("Profile save failed:", error);
      if (isNetworkError(error)) { alertNetworkError(); } else { Alert.alert(t("profile.save_failed"), friendlyErrorMessage(error, t("profile.try_again"))); }
    } finally {
      setSavingParentName(false);
      hideLoading();
    }
  };

  const changePassword = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert(t("profile.login_again"), t("profile.login_again_msg"));
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t("profile.missing_details"), t("profile.fill_passwords"));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t("profile.passwords_mismatch"), t("profile.passwords_mismatch_msg"));
      return;
    }

    if (!(await checkInternet())) return;
    setSavingPassword(true);
    showLoading();
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
      showToast(t("profile.password_changed"));
    } catch (error: any) {
      console.error("Password update failed:", error);
      if (isNetworkError(error)) { alertNetworkError(); } else { Alert.alert(t("profile.password_change_failed"), error?.code === "auth/invalid-credential" || error?.code === "auth/wrong-password" ? t("profile.current_password_wrong") : friendlyErrorMessage(error, t("profile.try_again"))); }
    } finally {
      setSavingPassword(false);
      hideLoading();
    }
  };

  const saveParentPin = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert(t("profile.login_again"), t("profile.login_again_msg"));
      return;
    }

    if (!/^[0-9]{4}$/.test(newParentPin)) {
      Alert.alert(t("profile.check_pin"), t("profile.check_pin_msg"));
      return;
    }

    if (newParentPin !== confirmParentPin) {
      Alert.alert(t("profile.pins_mismatch"), t("profile.pins_mismatch_msg"));
      return;
    }

    if (!(await checkInternet())) return;
    setSavingParentPin(true);
    showLoading();

    try {
      await setDoc(
        doc(db, "parents", user.uid),
        { parentPin: newParentPin },
        { merge: true },
      );
      setParentPin(newParentPin);
      setNewParentPin("");
      setConfirmParentPin("");
      showToast(t("profile.parent_pin_changed"));
    } catch (error: any) {
      console.error("Parent PIN save failed:", error);
      if (isNetworkError(error)) { alertNetworkError(); } else { Alert.alert(t("profile.save_failed"), friendlyErrorMessage(error, t("profile.try_again"))); }
    } finally {
      setSavingParentPin(false);
      hideLoading();
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
      showToast(t("profile.kid_pins_saved"));
    } else {
      showToast(t("profile.no_pin_change"));
    }
  };

  const verifyParentPin = () => {
    if (parentPinInputAttempt === parentPin) {
      setAuthenticated(true);
      setAuthModalVisible(false);
      setParentPinInputAttempt("");
    } else {
      Alert.alert(t("profile.wrong_pin"), t("profile.wrong_pin_msg"));
      setParentPinInputAttempt("");
    }
  };

  const handleSignOut = async () => {
    showLoading();
    try {
      await signOut(auth);
      router.replace("/screens/LoginScreen");
    } finally {
      hideLoading();
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setDeletePassword("");
  };

  const deleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert(t("profile.login_again"), t("profile.login_again_msg"));
      return;
    }

    if (!deletePassword) {
      Alert.alert(t("profile.missing_password"), t("profile.missing_password_msg"));
      return;
    }

    if (!(await checkInternet())) return;
    setDeletingAccount(true);
    showLoading();
    try {
      const credential = EmailAuthProvider.credential(
        user.email ?? "",
        deletePassword,
      );
      await reauthenticateWithCredential(user, credential);
      await deleteDoc(doc(db, "parents", user.uid));
      await deleteUser(user);
      closeDeleteModal();
      showToast(t("profile.account_deleted"));
      router.replace("/screens/LoginScreen");
    } catch (error: any) {
      console.error("Account deletion failed:", error);
      if (isNetworkError(error)) { alertNetworkError(); } else { Alert.alert(t("profile.delete_failed"), error?.code === "auth/invalid-credential" || error?.code === "auth/wrong-password" ? t("profile.password_wrong") : friendlyErrorMessage(error, t("profile.try_again"))); }
    } finally {
      setDeletingAccount(false);
      hideLoading();
    }
  };

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const pinMismatch =
    confirmParentPin.length > 0 && newParentPin !== confirmParentPin;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t("profile.title")}
        right={
          leader ? (
            <Pressable
              onPress={() => router.push("/screens/LeaderboardScreen")}
              style={({ pressed }) => [styles.leaderChip, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="trophy" size={13} color={palette.accentDark} />
              <AppText variant="label" color={palette.accentDark} numberOfLines={1}>
                {`${leader.name} · ${leader.stars}★`}
              </AppText>
            </Pressable>
          ) : undefined
        }
      />
      <Screen scroll topInset={false} contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <AppText style={styles.avatarText}>👤</AppText>
          </View>
          <AppText variant="heading">{t("profile.title")}</AppText>
          <AppText variant="caption" color="textMuted">
            {email}
          </AppText>
        </View>

        <Card style={styles.card}>
          <AppText variant="subtitle" style={styles.cardTitle}>
            {t("profile.profile_info")}
          </AppText>
          <TextField
            label={t("profile.parent_name")}
            value={parentName}
            onChangeText={setParentName}
            placeholder={t("profile.parent_name_placeholder")}
            leftIcon="person-outline"
          />
          <TextField label={t("profile.email")} value={email} editable={false} leftIcon="mail-outline" />
          <Button
            title={savingParentName ? t("profile.saving") : t("profile.save_profile")}
            onPress={saveParentName}
            loading={savingParentName}
            disabled={!canSaveParentName}
            fullWidth
          />
        </Card>

        <Card style={styles.card}>
          <AppText variant="subtitle" style={styles.cardTitle}>
            {t("profile.change_password")}
          </AppText>
          <TextField
            label={t("profile.current_password")}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder={t("profile.current_password")}
            secureToggle
            leftIcon="lock-closed-outline"
          />
          <TextField
            label={t("profile.new_password")}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={t("profile.new_password")}
            secureToggle
            leftIcon="lock-closed-outline"
          />
          <TextField
            label={t("profile.confirm_new_password")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t("profile.confirm_new_password")}
            secureToggle
            leftIcon="lock-closed-outline"
            error={passwordMismatch ? t("profile.passwords_no_match") : undefined}
          />
          <Button
            title={savingPassword ? t("profile.updating") : t("profile.update_password")}
            variant="secondary"
            onPress={changePassword}
            loading={savingPassword}
            fullWidth
          />
        </Card>

        <Card style={styles.card}>
          <AppText variant="subtitle" style={styles.cardTitle}>
            {t("profile.access_code")}
          </AppText>
          <AppText variant="caption" color="textMuted" style={styles.cardHint}>
            {parentPin
              ? t("profile.update_code_msg")
              : t("profile.set_code_msg")}
          </AppText>
          <TextField
            label={t("profile.new_code")}
            value={newParentPin}
            onChangeText={(v) => setNewParentPin(v.replace(/[^0-9]/g, "").slice(0, 4))}
            placeholder="••••"
            keyboardType="number-pad"
            maxLength={4}
          />
          <TextField
            label={t("profile.confirm_code")}
            value={confirmParentPin}
            onChangeText={(v) => setConfirmParentPin(v.replace(/[^0-9]/g, "").slice(0, 4))}
            placeholder="••••"
            keyboardType="number-pad"
            maxLength={4}
            error={pinMismatch ? t("profile.codes_no_match") : undefined}
          />
          <Button
            title={
              savingParentPin ? t("profile.saving") : parentPin ? t("profile.update_code") : t("profile.set_code")
            }
            variant="secondary"
            onPress={saveParentPin}
            loading={savingParentPin}
            fullWidth
          />
        </Card>

        <Card style={styles.card}>
          <AppText variant="subtitle" style={styles.cardTitle}>
            {t("profile.kids_pins")}
          </AppText>
          {kids.length === 0 ? (
            <AppText variant="body" color="textMuted" style={styles.cardHint}>
              {t("profile.add_kids_first")}
            </AppText>
          ) : (
            kids.map((item) => (
              <View key={item.id} style={styles.kidRow}>
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyStrong">{capitalizeWords(item.name)}</AppText>
                  <AppText variant="caption" color="textMuted">
                    {t("profile.pin_hint")}
                  </AppText>
                </View>
                <TextField
                  containerStyle={styles.kidInput}
                  value={kidPins[item.id]}
                  onChangeText={(v) =>
                    setKidPins((prev) => ({ ...prev, [item.id]: v.replace(/[^0-9]/g, "").slice(0, 4) }))
                  }
                  keyboardType="number-pad"
                  placeholder={t("profile.pin")}
                  maxLength={4}
                  textAlign="center"
                />
              </View>
            ))
          )}
          <Button title={t("profile.save_kid_pins")} onPress={saveKidPins} fullWidth />
        </Card>

        <Button
          title={t("profile.sign_out")}
          variant="danger"
          onPress={handleSignOut}
          fullWidth
          style={{ marginTop: spacing.sm }}
        />

        <Button
          title={t("profile.delete_account")}
          variant="ghost"
          onPress={() => setDeleteModalVisible(true)}
          fullWidth
        />
      </Screen>

      <Dialog
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        title={t("profile.delete_account")}
        subtitle={t("profile.delete_account_msg")}
        actions={[
          { label: t("profile.cancel"), variant: "ghost", onPress: closeDeleteModal },
          {
            label: t("profile.delete"),
            variant: "danger",
            onPress: deleteAccount,
            loading: deletingAccount,
          },
        ]}
      >
        <TextField
          label={t("profile.confirm_password")}
          value={deletePassword}
          onChangeText={setDeletePassword}
          placeholder={t("profile.password")}
          secureToggle
          leftIcon="lock-closed-outline"
        />
      </Dialog>

      <Dialog
        visible={authModalVisible}
        onClose={() => {}}
        dismissable={false}
        inline
        title={t("profile.enter_access_code")}
        actions={[
          { label: t("profile.back"), variant: "ghost", onPress: () => router.back() },
          { label: t("profile.unlock"), onPress: verifyParentPin },
        ]}
      >
        <TextField
          value={parentPinInputAttempt}
          onChangeText={(v) =>
            setParentPinInputAttempt(v.replace(/[^0-9]/g, "").slice(0, 4))
          }
          placeholder={t("profile.code_4")}
          keyboardType="number-pad"
          secureToggle
          maxLength={4}
          autoFocus
        />
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: spacing["4xl"], gap: spacing.md },
  profileHeader: { alignItems: "center", paddingVertical: spacing["2xl"], gap: spacing.xs },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EDEAFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  avatarText: { fontSize: 34 },
  card: { gap: spacing.xs },
  cardTitle: { marginBottom: spacing.sm },
  cardHint: { marginBottom: spacing.md },
  kidRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  kidInput: { width: 92, marginBottom: 0 },
  leaderChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    maxWidth: 190,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: palette.accentSoft,
  },
});
