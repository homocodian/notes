export function removeDefaultPropError() {
  // eslint-disable-next-line no-console
  const originalConsoleError = console.error;
  // remove default props error message
  // eslint-disable-next-line no-console
  console.error = (message, ...args) => {
    if (
      typeof message === "string" &&
      message.includes("defaultProps will be removed")
    ) {
      return;
    }
    originalConsoleError.apply(console, [message, ...args]);
  };
}
