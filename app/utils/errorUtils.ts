import { t } from "@/lib/i18n";

// Turn backend errors into short, plain messages for parents.
// Never show error.message directly: it contains technical text like
// "Firebase: Error (auth/invalid-credential)."
// Codes map to translation keys in lib/locales/*.json (errors.*).
const FRIENDLY_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "errors.invalid_credential",
  "auth/wrong-password": "errors.wrong_password",
  "auth/user-not-found": "errors.user_not_found",
  "auth/invalid-email": "errors.invalid_email",
  "auth/missing-email": "errors.missing_email",
  "auth/missing-password": "errors.missing_password",
  "auth/email-already-in-use": "errors.email_in_use",
  "auth/weak-password": "errors.weak_password",
  "auth/too-many-requests": "errors.too_many",
  "auth/requires-recent-login": "errors.recent_login",
  "auth/user-disabled": "errors.user_disabled",
  "auth/user-token-expired": "errors.token_expired",
  "auth/network-request-failed": "errors.network",
  "permission-denied": "errors.permission_denied",
  "unavailable": "errors.network",
  "deadline-exceeded": "errors.timeout",
};

export function friendlyErrorMessage(
  error: any,
  fallback = t("errors.generic")
): string {
  const code: string = error?.code ?? "";
  const key = FRIENDLY_MESSAGES[code];
  return key ? t(key) : fallback;
}
