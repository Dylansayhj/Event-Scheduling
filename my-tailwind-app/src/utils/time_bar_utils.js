import { START_HOUR, TOTAL_MINUTES, BAR_HEIGHT } from "./constants/time_bar";

export function minutesToY(minutes) {
  return (minutes / TOTAL_MINUTES) * BAR_HEIGHT;
}

export function yToMinutes(y) {
  const raw = (y / BAR_HEIGHT) * TOTAL_MINUTES;
  return Math.round(raw / 15) * 15; // snap to nearest 15 min
}

export function minutesToLabel(minutes) {
  const totalMins = START_HOUR * 60 + minutes;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

// Converts drag ranges to 15-min slot strings for localStorage
export function rangesToSlots(ranges) {
  const slots = new Set();
  ranges.forEach(({ start, end }) => {
    for (let m = start; m < end; m += 15) {
      const totalMins = START_HOUR * 60 + m;
      const h = Math.floor(totalMins / 60);
      const min = totalMins % 60;
      slots.add(`${h}:${min === 0 ? "00" : min}`);
    }
  });
  return [...slots];
}

// Converts overlap slot map to minute-keyed map for the drag bar
// overlaps: { "9:00": ["Alice","Bob"], ... }
export function buildOverlapMap(overlaps) {
  const map = {};
  Object.entries(overlaps).forEach(([slot, names]) => {
    const [h, m] = slot.split(":").map(Number);
    const minutes = (h - START_HOUR) * 60 + m;
    map[minutes] = names;
  });
  return map;
}

// Merges an incoming range into an existing list, combining overlaps
export function mergeRanges(prev, start, end) {
  const next = [...prev, { start, end }];
  next.sort((a, b) => a.start - b.start);
  const merged = [];
  for (const r of next) {
    if (merged.length && r.start <= merged[merged.length - 1].end) {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, r.end);
    } else {
      merged.push({ ...r });
    }
  }
  return merged;
}