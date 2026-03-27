import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells: Array<number | null> = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

export function CalendarView({ year, month }: { year: number; month: number }) {
  const monthDate = new Date(year, month, 1);
  const monthLabel = monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const cells = buildCalendar(year, month);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Previous month">
            <ChevronLeft size={16} />
          </button>
          <h3 className="text-2xl font-semibold text-slate-900">{monthLabel}</h3>
          <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Next month">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200">
          <button type="button" className="border-r border-slate-200 px-4 py-2 text-xs font-medium text-slate-500">Day</button>
          <button type="button" className="border-r border-slate-200 px-4 py-2 text-xs font-medium text-slate-500">Week</button>
          <button type="button" className="bg-indigo-500 px-4 py-2 text-xs font-medium text-white">Month</button>
        </div>
      </div>

      <div className="grid grid-cols-7 overflow-hidden rounded-lg border border-slate-200">
        {WEEK.map((day) => (
          <div key={day} className="border-b border-slate-200 bg-slate-50 py-3 text-center text-xs font-semibold text-slate-500">
            {day}
          </div>
        ))}

        {cells.map((day, index) => (
          <div key={index} className="h-24 border-b border-r border-slate-100 p-2 text-right text-sm text-slate-700">
            {day ? day : ""}
          </div>
        ))}
      </div>
    </>
  );
}
