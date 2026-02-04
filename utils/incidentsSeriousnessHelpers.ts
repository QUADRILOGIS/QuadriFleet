export const getSeverityClass = (severity: number): string => {
  if (severity >= 8) return "bg-red-100 text-red-700";
  if (severity >= 5) return "bg-orange-100 text-orange-700";
  return "bg-green-100 text-green-700";
};
