export const value_converter = (value?: string | number): string => {
  if (value === undefined || value === null) return "0";

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "0";

  if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(1) + "M"; // 1.5M
  } else if (numValue >= 1000) {
    return (numValue / 1000).toFixed(1) + "K"; // 1.5K
  } else {
    return numValue.toFixed(0); // 999
  }
};
