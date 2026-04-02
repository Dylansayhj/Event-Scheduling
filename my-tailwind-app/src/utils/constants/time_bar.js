export const START_HOUR = 9;
export const END_HOUR = 21;
export const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
export const BAR_HEIGHT = 480; 

export const HOUR_LABELS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => {
  const h = START_HOUR + i;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return { label: `${hour} ${suffix}`, minutes: i * 60 };
});