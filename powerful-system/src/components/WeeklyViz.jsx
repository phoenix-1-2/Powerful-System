import { motion } from 'framer-motion';

export default function WeeklyViz({ weekTotalsByDay, weeklyTotal, dailyTarget }) {
	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const totalsArray = Object.values(weekTotalsByDay);
	const max = Math.max(dailyTarget, ...(totalsArray.length ? totalsArray : [0]));
	return (
		<div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950 text-zinc-100">
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-semibold text-zinc-200">Weekly Tracker</h3>
				<div className="text-sm text-zinc-400">Total: {weeklyTotal} pts</div>
			</div>
			<div className="grid grid-cols-7 gap-2 items-end">
				{days.map((d, idx) => (
					<div key={d} className="flex flex-col items-center gap-2">
						<div className="w-full h-28 bg-zinc-800 rounded-md flex items-end overflow-hidden">
							<motion.div
								initial={{ height: 0 }}
								animate={{ height: `${Math.round(((weekTotalsByDay[idx + 1] || 0) / max) * 100)}%` }}
								transition={{ type: 'spring', stiffness: 120, damping: 14 }}
								className="w-full bg-gradient-to-t from-fuchsia-600 via-pink-500 to-rose-400"
								title={`${d}: ${weekTotalsByDay[idx + 1] || 0} pts`}
							/>
						</div>
						<div className="text-xs text-zinc-400 font-medium">{d}</div>
					</div>
				))}
			</div>
		</div>
	);
} 