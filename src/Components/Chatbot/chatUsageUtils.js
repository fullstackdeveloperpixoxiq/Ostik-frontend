// Shared helpers for the AI chat usage indicator.

export const usageTone = (percentage) => {
  if (percentage >= 95) return { stroke: "#ff3b30", text: "text-[#d93025]", soft: "bg-[#fdecea]", label: "Critical" };
  if (percentage >= 80) return { stroke: "#f59e0b", text: "text-[#b45309]", soft: "bg-[#fef3c7]", label: "Running low" };
  return { stroke: "#00ff03", text: "text-[#2f9e00]", soft: "bg-[#eaffea]", label: "Available" };
};

export const formatResetDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
};
