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

export function findEvent(eventId, events) {
  return events?.find((event) => event.id === eventId);
}

export function findVenue(venueId, venues) {
  return venues?.find((venue) => venue.id === venueId);
}

export function findTicketType(ticketTypeId, ticketTypes) {
  return ticketTypes?.find((type) => type.id === ticketTypeId);
}

export function countDuration(beginssAt, endsAt) {
  const beginsAtTime = new Date(beginssAt);
  const endsAtTime = new Date(endsAt);
  const duration = endsAtTime - beginsAtTime;
  return duration;
}
