import { MONTHS } from '../utils/constants/months';
import { DAYS } from '../utils/constants/days';
import { toDateKey } from '../utils/utils';

export default function CalendarGrid({
  calYear, calMonth, setCalYear, setCalMonth,
  selectedDate, setSelectedDate,
  datesWithResponses = {}, totalUsers = 0,
}) {
  const today = new Date();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const calCells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  function responseStyle(count) {
    if (!count || totalUsers === 0) return null;
    const ratio = count / totalUsers;
    if (ratio >= 0.8) return { bg: "bg-[#2d4a3e]", text: "text-white", bar: "bg-[#2d4a3e]" };
    if (ratio >= 0.5) return { bg: "bg-[#4a8c6f]/20", text: "text-[#2d4a3e]", bar: "bg-[#4a8c6f]" };
    return { bg: "bg-[#e8f4ee]", text: "text-[#2d4a3e]", bar: "bg-[#a8c5bc]" };
  }

  return (
    <div className="w-full lg:w-auto bg-white rounded-2xl border border-[#e8dfd3] shadow-[0_2px_16px_rgba(45,74,62,0.07)] p-5 shrink-0 h-fit">

      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-[#f7f3ee] text-[#7a7268] hover:text-[#2d4a3e] transition-colors text-lg flex items-center justify-center">‹</button>
        <span className="font-serif font-bold text-[#1a1a18] text-base">{MONTHS[calMonth]} {calYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-[#f7f3ee] text-[#7a7268] hover:text-[#2d4a3e] transition-colors text-lg flex items-center justify-center">›</button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-[#b5a99a] py-1 w-10">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calCells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="w-10 h-10" />;

          const dateKey = toDateKey(calYear, calMonth, day);
          const isSelected = selectedDate === dateKey;
          const isToday =
            day === today.getDate() &&
            calMonth === today.getMonth() &&
            calYear === today.getFullYear();
          const isPast = new Date(calYear, calMonth, day) <
            new Date(today.getFullYear(), today.getMonth(), today.getDate());

          const count = datesWithResponses[dateKey] || 0;
          const style = !isSelected && !isPast ? responseStyle(count) : null;

          return (
            <button
              key={dateKey}
              onClick={() => !isPast && setSelectedDate(dateKey)}
              disabled={isPast}
              title={count > 0 ? `${count} response${count > 1 ? "s" : ""}` : undefined}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-150 flex flex-col items-center justify-center relative overflow-hidden
                ${isPast ? "text-[#d4cdc6] cursor-not-allowed" : "cursor-pointer"}
                ${isSelected ? "bg-[#2d4a3e] text-white font-bold" : ""}
                ${isToday && !isSelected ? "ring-2 ring-[#2d4a3e] text-[#2d4a3e] font-bold" : ""}
                ${style ? `${style.bg} ${style.text}` : ""}
                ${!isSelected && !isToday && !isPast && !style ? "hover:bg-[#e8dfd3] text-[#1a1a18]" : ""}
              `}
            >
              {style && (
                <span className={`absolute bottom-0 left-1 right-1 h-0.5 rounded-full ${style.bar}`} />
              )}
              {day}
            </button>
          );
        })}
      </div>

      {totalUsers > 0 && (
        <div className="mt-4 pt-3 border-t border-[#e8dfd3] flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-[#b5a99a] font-medium">Responses:</span>
          {[
            ["bg-[#e8f4ee] border border-[#a8c5bc]", "text-[#2d4a3e]", "Few"],
            ["bg-[#4a8c6f]/20", "text-[#2d4a3e]", "Some"],
            ["bg-[#2d4a3e]", "text-white", "Most"],
          ].map(([bg, text, label]) => (
            <span key={label} className="flex items-center gap-1.5 text-[10px] text-[#7a7268]">
              <span className={`w-4 h-4 rounded-md ${bg} ${text} inline-flex items-center justify-center text-[8px] font-bold`}>
                {label === "Few" ? "1" : label === "Some" ? "2" : "3"}
              </span>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}