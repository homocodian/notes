export function validatePassword(password: string): boolean {
  // Minimum length check
  if (password.length < 8) {
    return false;
  }

  // Check for at least one digit
  if (!/\d/.test(password)) {
    return false;
  }

  // Check for at least one of the allowed special symbols: !@#$%*&
  if (!/[!@#$%*&]/.test(password)) {
    return false;
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Check for whitespace
  if (/\s/.test(password)) {
    return false;
  }

  // All checks passed
  return true;
}
