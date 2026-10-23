import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

const NO_INTERNET_MSG = "Please check your Wi-Fi or mobile data and try again.";

export async function checkInternet(): Promise<boolean> {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    Alert.alert("No internet", NO_INTERNET_MSG);
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
  Alert.alert("No internet", NO_INTERNET_MSG);
}
