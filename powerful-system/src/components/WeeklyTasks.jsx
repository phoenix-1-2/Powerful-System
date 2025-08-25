import AddTask from "./AddTask.jsx";
import TaskList from "./TaskList.jsx";
import { isoWeekDays } from "../utils/date.js";

function remarkFor(totalPointsRatio) {
  if (totalPointsRatio > 0.99) return "Incredible day 👏";
  if (totalPointsRatio > 0.79) return "Stellar progress ✨";
  if (totalPointsRatio > 0.49) return "Great going 👍";
  if (totalPointsRatio === 0) return "";
  return "Push harder tomorrow 🔥";
}

export default function WeeklyTasks({
  selectedDateISO,
  tasks,
  onAdd,
  onToggle,
  onDelete,
  dailyTarget = 100,
}) {
  const days = isoWeekDays(selectedDateISO);
  const groupSuggestions = Array.from(
    new Set(
      tasks
        .filter(
          (t) =>
            t.group && typeof t.group === "string" && t.group.trim().length > 0,
        )
        .map((t) => t.group.trim()),
    ),
  ).sort((a, b) => a.localeCompare(b));
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center">
      {days.map((dayISO) => {
        const dayTasks = tasks.filter((t) => t.date === dayISO);
        const label = new Date(dayISO).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        const earnedPoints = dayTasks.reduce(
          (sum, t) => sum + (t.completed ? t.points || 0 : 0),
          0,
        );
        const ratio = earnedPoints / Math.max(1, dailyTarget);
        return (
          <div
            key={dayISO}
            className="w-full max-w-3xl rounded-xl border border-zinc-800 p-6 min-h-64 bg-zinc-950"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{label}</h3>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
                  {earnedPoints} points
                </span>
                <div className="text-sm text-zinc-400 hidden md:block">
                  {dayISO}
                </div>
              </div>
            </div>
            <AddTask
              onAdd={({ title, points, group }) =>
                onAdd({ title, points, group, date: dayISO })
              }
              date={dayISO}
              groupSuggestions={groupSuggestions}
            />
            <div className="mt-3">
              <TaskList
                tasks={dayTasks}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            </div>
            <div className="mt-3 text-sm text-zinc-300">{remarkFor(ratio)}</div>
          </div>
        );
      })}
    </div>
  );
}
