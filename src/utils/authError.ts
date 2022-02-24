export default function VerifyErroCode(errorCode: any): string {
  switch (errorCode) {
    case "auth/app-deleted":
      return "App service discontinued";
    case "auth/expired-action-code":
      return "Something went wrong, please try again later";
    case "auth/invalid-action-code":
      return "Something went wrong, please try again later";
    case "auth/user-disabled":
      return "Unauthorized user, please contact developer for more info";
    case "auth/user-not-found":
      return "User not found";
    case "auth/weak-password":
      return "Weak password";
    case "auth/email-already-in-use":
      return "Email already exist";
    case "auth/invalid-email":
      return "Invalid email";
    case "auth/operation-not-allowed":
      return "Operation not allowed";
    case "auth/account-exists-with-different-credential":
      return "Invalid email or password";
    case "auth/auth-domain-config-required":
      return "Something went wrong, please try again later";
    case "auth/credential-already-in-use":
      return "Already in use";
    case "auth/operation-not-supported-in-this-environment":
      return "Something went wrong, please try again later";
    case "auth/timeout":
      return "Timeout error, please try later";
    case "auth/missing-android-pkg-name":
      return "Missing android package name";
    case "auth/missing-continue-uri":
      return "A valid continue URL must be provided in the request";
    case "auth/missing-ios-bundle-id":
      return "Missing iso bundle id";
    case "auth/invalid-continue-uri":
      return "A invalid continue URL provided in the request";
    case "auth/unauthorized-continue-uri":
      return "Unauthorized continue uri";
    case "auth/invalid-dynamic-link-domain":
      return "Invalid dynamic link domain";
    case "auth/argument-error":
      return "Config argument error";
    case "auth/invalid-persistence-type":
      return "Invalid persistence type";
    case "auth/unsupported-persistence-type":
      return "Unsupported persistence type";
    case "auth/invalid-credential":
      return "Invalid credential";
    case "auth/wrong-password":
      return "Incorrect email or password";
    case "auth/invalid-verification-code":
      return "Invalid verification code";
    case "auth/invalid-verification-id":
      return "Invalid verification id";
    case "auth/custom-token-mismatch":
      return "Custom token mismatch";
    case "auth/invalid-custom-token":
      return "Invalid custom token mismatch";
    case "auth/captcha-check-failed":
      return "Captcha check failed";
    case "auth/invalid-phone-number":
      return "Invalid phone number";
    case "auth/missing-phone-number":
      return "Missing phone number";
    case "auth/quota-exceeded":
      return "SMS quota exceeded";
    case "auth/cancelled-popup-request":
      return "Popup request cancelled";
    case "auth/popup-blocked":
      return "Popup blocked";
    case "auth/popup-closed-by-user":
      return "Popup closed by user";
    case "auth/unauthorized-domain":
      return "Unauthorized domain";
    case "auth/invalid-user-token":
      return "Invalid user token.";
    case "auth/user-token-expired":
      return "User token expired.";
    case "auth/null-user":
      return "No user.";
    case "auth/app-not-authorized":
      return "Application no authorized.";
    case "auth/invalid-api-key":
      return "Invalid api key.";
    case "auth/network-request-failed":
      return "Network request failed.";
    case "auth/requires-recent-login":
      return "Requires login";
    case "auth/too-many-requests":
      return "Too many requests, please try later.";
    case "auth/web-storage-unsupported":
      return "Web storage is not supported.";
    case "auth/invalid-claims":
      return "Invalid claims.";
    case "auth/claims-too-large":
      return "Claims are valid upto 1 MB.";
    case "auth/id-token-expired":
      return "Token id expired.";
    case "auth/id-token-revoked":
      return "Token id revoked.";
    case "auth/invalid-argument":
      return "Invalid argument.";
    case "auth/invalid-creation-time":
      return "Invalid creation time.";
    case "auth/invalid-disabled-field":
      return "Invalid disabled field..";
    case "auth/invalid-display-name":
      return "Invalid display name.";
    case "auth/invalid-email-verified":
      return "Invalid email verified.";
    case "auth/invalid-hash-algorithm":
      return "The hash algorithm must match one of the strings in the list of supported algorithms.";
    case "auth/invalid-hash-block-size":
      return "The hash block size must be a valid number.";
    case "auth/invalid-hash-derived-key-length":
      return "The hash derived key length must be a valid number.";
    case "auth/invalid-hash-key":
      return "The hash key must a valid byte buffer.";
    case "auth/invalid-hash-memory-cost":
      return "The hash memory cost must be a valid number.";
    case "auth/invalid-hash-parallelization":
      return "The hash parallelization must be a valid number.";
    case "auth/invalid-hash-rounds":
      return "The hash rounds must be a valid number.";
    case "auth/invalid-hash-salt-separator":
      return "The hashing algorithm salt separator field must be a valid byte buffer.";
    case "auth/invalid-id-token":
      return "The provided ID token is not a valid Firebase ID token.";
    case "auth/invalid-last-sign-in-time":
      return "The last sign-in time must be a valid UTC date string.";
    case "auth/invalid-page-token":
      return "The provided next page token in listUsers() is invalid. It must be a valid non-empty string.";
    case "auth/invalid-password":
      return "The provided value for the password user property is invalid. It must be a string with at least six characters.";
    case "auth/invalid-password-hash":
      return "The password hash must be a valid byte buffer.";
    case "auth/invalid-password-salt":
      return "The password salt must be a valid byte buffer.";
    case "auth/invalid-photo-url":
      return "The provided value for the photoURL user property is invalid. It must be a string URL.";
    case "auth/invalid-provider-id":
      return "The providerId must be a valid supported provider identifier string.";
    case "auth/invalid-session-cookie-duration":
      return "The session cookie duration must be a valid number in milliseconds between 5 minutes and 2 weeks.";
    case "auth/invalid-uid":
      return "Invalid uid.";
    case "auth/invalid-user-import":
      return "The user record to import is invalid.";
    case "auth/invalid-provider-data":
      return "The providerData must be a valid array of UserInfo objects.";
    case "auth/maximum-user-count-exceeded":
      return "The maximum allowed number of users to import has been exceeded.";
    case "auth/missing-hash-algorithm":
      return "Importing users with password hashes requires that the hashing algorithm and its parameters be provided.";
    case "auth/missing-uid":
      return "A uid identifier is required for the current operation.";
    case "auth/reserved-claims":
      return "One or more custom user claims provided to setCustomUserClaims() are reserved.";
    case "auth/session-cookie-revoked":
      return "The Firebase session cookie has been revoked.";
    case "auth/uid-alread-exists":
      return "The provided uid is already in use by an existing user. Each user must have a unique uid.";
    case "auth/email-already-exists":
      return "The provided email is already in use by an existing user. Each user must have a unique email.";
    case "auth/phone-number-already-exists":
      return "The provided phoneNumber is already in use by an existing user. Each user must have a unique phoneNumber.";
    case "auth/project-not-found":
      return "No Firebase project was found for the credential used to initialize the Admin SDKs.";
    case "auth/insufficient-permission":
      return "The credential used to initialize the Admin SDK has insufficient permission to access the requested Authentication resource.";
    case "auth/internal-error":
      return "The Authentication server encountered an unexpected error while trying to process the request.";
    default:
      return errorCode;
  }
}
