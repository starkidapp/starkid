export const isVersionLower = (current: string, minimum: string) => {
  const currentParts = current.split(".").map(Number);
  const minimumParts = minimum.split(".").map(Number);

  for (let i = 0; i < Math.max(currentParts.length, minimumParts.length); i++) {
    const currentValue = currentParts[i] || 0;
    const minimumValue = minimumParts[i] || 0;

    if (currentValue < minimumValue) return true;
    if (currentValue > minimumValue) return false;
  }

  return false;
};
