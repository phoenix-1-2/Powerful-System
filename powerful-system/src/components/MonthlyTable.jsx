import { formatWeekRangeFromKey, monthLabelFromKey } from "../utils/date.js";

function remarkFor(totalPointsRatio) {
  if (totalPointsRatio > 0.99) return "Incredible week 👏";
  if (totalPointsRatio > 0.79) return "Stellar progress ✨";
  if (totalPointsRatio > 0.49) return "Great going 👍";
  if (totalPointsRatio === 0) return "";
  return "Tear apart next week 🔥";
}

export default function MonthlyTable({ monthlyTotals, dailyTarget = 100 }) {
  const months = Object.keys(monthlyTotals).sort().reverse();
  if (months.length === 0)
    return (
      <div className="rounded-xl border border-zinc-800 p-4 text-sm text-zinc-400 bg-zinc-950">
        No monthly data yet.
      </div>
    );
  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950 text-zinc-100">
      <table className="w-full text-sm">
        <thead className="bg-zinc-900">
          <tr>
            <th className="text-left p-3">Month</th>
            <th className="text-left p-3">Weeks</th>
            <th className="text-right p-3">Total Points</th>
            <th className="text-left p-3">Remark</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m) => (
            <tr
              key={m}
              className="border-t border-zinc-800 hover:bg-zinc-900/70 transition"
            >
              <td className="p-3 font-medium">{monthLabelFromKey(m)}</td>
              <td className="p-3">
                <div className="flex flex-col gap-2">
                  {Object.entries(monthlyTotals[m].weeks).map(
                    ([wk, total]) =>
                      total > 0 && (
                        <div
                          key={wk}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="px-2 py-1 rounded-full bg-zinc-800 text-zinc-100 border border-zinc-700">
                            {formatWeekRangeFromKey(wk)}
                          </span>
                          <span className="text-zinc-300">{total} points</span>
                        </div>
                      ),
                  )}
                </div>
              </td>
              <td className="p-3 text-right font-semibold">
                {monthlyTotals[m].total} points
              </td>
              <td className="p-3 text-left text-zinc-300">
                {(() => {
                  const weekEntries = Object.entries(monthlyTotals[m].weeks);
                  if (weekEntries.length === 0) return "";
                  const latestTotal = weekEntries.sort().slice(-1)[0][1];
                  const denom = Math.max(1, dailyTarget * 7);
                  const ratio = latestTotal / denom;
                  return remarkFor(ratio);
                })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
