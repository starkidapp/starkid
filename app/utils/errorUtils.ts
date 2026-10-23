// Turn backend errors into short, plain messages for parents.
// Never show error.message directly: it contains technical text like
// "Firebase: Error (auth/invalid-credential)."
const FRIENDLY_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "The email or password is not correct. Please check and try again.",
  "auth/wrong-password": "The password is not correct. Please try again.",
  "auth/user-not-found": "We couldn't find an account with this email. Please sign up first.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/missing-email": "Please enter your email address.",
  "auth/missing-password": "Please enter your password.",
  "auth/email-already-in-use": "This email already has an account. Please log in instead.",
  "auth/weak-password": "Please choose a stronger password with at least 6 characters.",
  "auth/too-many-requests": "Too many tries. Please wait a few minutes and try again.",
  "auth/requires-recent-login": "For your safety, please log out, log in again and then try once more.",
  "auth/user-disabled": "This account has been turned off. Please contact support.",
  "auth/user-token-expired": "Your session has ended. Please log in again.",
  "auth/network-request-failed": "No internet connection. Please check your connection and try again.",
  "permission-denied": "You don't have access to do this. Please log in again.",
  "unavailable": "No internet connection. Please check your connection and try again.",
  "deadline-exceeded": "This is taking too long. Please try again.",
};

export function friendlyErrorMessage(
  error: any,
  fallback = "Something went wrong. Please try again."
): string {
  const code: string = error?.code ?? "";
  return FRIENDLY_MESSAGES[code] ?? fallback;
}
