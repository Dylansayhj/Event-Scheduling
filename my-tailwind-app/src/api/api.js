export function getEventData(eventId) {
  return JSON.parse(localStorage.getItem(eventId)) || {};
}

// Returns { [slot]: [names] } for a given date
export function getOverlaps(eventId, dateKey) {
  const data = getEventData(eventId);
  const slotNames = {};
  
  Object.entries(data).forEach(([name, userDates]) => {
    const slots = userDates[dateKey] || [];
    slots.forEach((slot) => {
      if (!slotNames[slot]) slotNames[slot] = [];
      slotNames[slot].push(name);
    });
  });
  
  return slotNames;
}

export function getConfirmed(eventId) {
  return (JSON.parse(localStorage.getItem(`${eventId}_meta`)) || {}).confirmed || null;
}