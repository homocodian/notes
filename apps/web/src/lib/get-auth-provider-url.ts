export function getAuthProviderURL(provider: string) {
  const url = new URL(
    `${import.meta.env.VITE_API_BASE_URL}/v1/auth/${provider}`
  );
  url.searchParams.append(
    "callback",
    window.location.origin + window.location.pathname
  );
  url.searchParams.append(
    "redirect",
    window.location.origin + `/login/${provider}/callback`
  );
  return url.toString();
}
