export function validatePassword(
  password: string
): { ok: true; error: null } | { ok: false; error: string } {
  // Minimum length check
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters long" };
  }

  // Check for at least one digit
  if (!/\d/.test(password)) {
    return { ok: false, error: "Password must contain at least one digit" };
  }

  // Check for at least one of the allowed special symbols: !@#$%*&
  if (!/[!@#$%*&]/.test(password)) {
    return {
      ok: false,
      error:
        "Password must contain at least one of the following special symbols: !@#$%*&"
    };
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      ok: false,
      error: "Password must contain at least one uppercase letter"
    };
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      ok: false,
      error: "Password must contain at least one lowercase letter"
    };
  }

  // Check for whitespace
  if (/\s/.test(password)) {
    return { ok: false, error: "Password must not contain whitespace" };
  }

  // All checks passed
  return { ok: true, error: null };
}
