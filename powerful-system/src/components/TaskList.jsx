import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";

export default function TaskList({ tasks, onToggle, onDelete }) {
  const groupsMap = tasks.reduce((acc, t) => {
    const normTitle = (t.title || "").trim();
    const key = (t.group ? t.group : normTitle).trim().toLowerCase();
    const displayTitle = (t.group ? t.group : normTitle) || "Untitled";
    if (!acc[key])
      acc[key] = { key, title: displayTitle, items: [], totalPoints: 0 };
    acc[key].items.push(t);
    acc[key].totalPoints += Number(t.points || 0);
    return acc;
  }, {});
  const groups = Object.values(groupsMap);

  const [expandedGroups, setExpandedGroups] = useState(() => {
    const init = {};
    for (const g of groups) init[g.key] = true; // expanded by default
    return init;
  });
  const toggleGroup = (key) =>
    setExpandedGroups((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
      {groups.length === 0 ? (
        <div className="text-sm text-zinc-400 p-4">
          No tasks yet. Add one above.
        </div>
      ) : (
        groups.map((g, gi) => {
          const isOpen = expandedGroups[g.key] ?? true;
          return (
            <div
              key={g.key}
              className={gi === 0 ? "" : "border-t border-zinc-800"}
            >
              <button
                onClick={() => toggleGroup(g.key)}
                className="w-full flex items-center justify-between px-4 py-2 bg-zinc-900/50 hover:bg-zinc-900 transition text-left"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                  {isOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                  {g.title}
                </span>
                <span className="text-sm text-zinc-300 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-200 text-xs">
                    {g.items.length}
                  </span>
                  {g.totalPoints} points
                </span>
              </button>
              {isOpen && (
                <div className="divide-y divide-zinc-800">
                  {g.items.map((t) => (
                    <motion.div
                      key={t.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between px-4 py-3 hover:bg-zinc-900 transition"
                    >
                      <label className="flex items-center gap-3 cursor-pointer min-w-0">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => onToggle(t.id)}
                          className="h-5 w-5 rounded accent-fuchsia-500"
                        />
                        <div className="min-w-0">
                          <div
                            className={`font-medium text-base flex items-center gap-2 ${
                              t.completed ? "text-fuchsia-300" : "text-zinc-100"
                            }`}
                          >
                            {t.completed && (
                              <CheckCircle2
                                className="text-fuchsia-500"
                                size={18}
                              />
                            )}
                            <span className="truncate block">{t.title}</span>
                          </div>
                          <div className="text-xs text-zinc-400">
                            {t.points} points
                          </div>
                        </div>
                      </label>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-rose-500"
                        onClick={() => onDelete(t.id)}
                        aria-label={`Delete ${t.title}`}
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
