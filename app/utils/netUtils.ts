import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";
import { t } from "@/lib/i18n";


export async function checkInternet(): Promise<boolean> {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    Alert.alert(t("net.no_internet"), t("net.no_internet_msg"));
    return false;
  }
  return true;
}

export function isNetworkError(error: any): boolean {
  const code: string = error?.code ?? "";
  const msg: string  = (error?.message ?? "").toLowerCase();
  return (
    code === "auth/network-request-failed" ||
    code === "unavailable" ||
    msg.includes("network") ||
    msg.includes("failed to fetch") ||
    msg.includes("internet")
  );
}

export function alertNetworkError() {
  Alert.alert(t("net.no_internet"), t("net.no_internet_msg"));
}
