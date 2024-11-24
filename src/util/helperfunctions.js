export function formatDateTime(dateTime) {
  if (!dateTime) return "";
  const formattedDate = new Date(dateTime).toLocaleDateString("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = new Date(dateTime).toLocaleTimeString("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formattedDate} klo ${formattedTime}`;
}
