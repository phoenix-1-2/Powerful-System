import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import AddTask from './components/AddTask.jsx';
import TaskList from './components/TaskList.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import WeeklyViz from './components/WeeklyViz.jsx';
import MonthlyTable from './components/MonthlyTable.jsx';
import WeeklyTasks from './components/WeeklyTasks.jsx';
import { defaultState, loadState, saveState } from './utils/store.js';
import { todayISO, weekKeyFromDate, monthKeyFromDate, formatWeekRangeFromKey, startOfISOWeekFromKey } from './utils/date.js';
import './index.css';

const DEV_SEED = false;
const RUN_TESTS = false;

function weeklyRemark(ratio) {
	if (ratio > 0.99) return 'Incredible week 👏';
	if (ratio > 0.79) return 'Stellar progress ✨';
	if (ratio > 0.49) return 'Great going 👍';
	if (ratio === 0) return '';
	return 'Tear apart next week 🔥';
}

export default function App() {
	const [state, setState] = useState(defaultState());
	const [loading, setLoading] = useState(true);
	const [selectedDate, setSelectedDate] = useState(todayISO());

	// ✅ Load from Firebase once
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const firebaseState = await loadState(); // load from Firestore
				if (mounted && firebaseState) {
					setState(firebaseState);
				}
			} catch (e) {
				console.error('Failed to load from Firebase:', e);
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	// ✅ Auto-save to Firebase (debounced)
	useEffect(() => {
		if (loading) return;
		const timeout = setTimeout(() => {
			saveState(state); // save to Firestore
		}, 600);
		return () => clearTimeout(timeout);
	}, [state, loading]);

	const weekTotalsByDay = useMemo(() => {
		const totals = {};
		for (const t of state.tasks) {
			if (!t.completed) continue;
			if (weekKeyFromDate(t.date) !== weekKeyFromDate(selectedDate)) continue;
			const dow = new Date(t.date).getDay() || 7;
			totals[dow] = (totals[dow] || 0) + t.points;
		}
		return totals;
	}, [state.tasks, selectedDate]);

	const weeklyTotal = useMemo(() => Object.values(weekTotalsByDay).reduce((a, b) => a + b, 0), [weekTotalsByDay]);

	const currentWeekStart = useMemo(() => startOfISOWeekFromKey(weekKeyFromDate(todayISO())).getTime(), []);
	const selectedWeekStart = useMemo(() => startOfISOWeekFromKey(weekKeyFromDate(selectedDate)).getTime(), [selectedDate]);

	const addTask = ({ title, points, date, group }) => {
		setState((s) => ({
			...s,
			tasks: [
				...s.tasks,
				{
					id: crypto?.randomUUID?.() ?? String(Date.now()),
					title,
					points,
					completed: false,
					date,
					group,
				},
			],
		}));
	};

	const toggleTask = (id) => {
		setState((s) => ({
			...s,
			tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
		}));
	};

	const deleteTask = (id) => {
		setState((s) => ({
			...s,
			tasks: s.tasks.filter((t) => t.id !== id),
		}));
	};

	const setDailyPoints = (val) =>
		setState((s) => ({
			...s,
			dailyPoints: val,
		}));

	function logCurrentWeekToMonthly() {
		const wk = weekKeyFromDate(selectedDate);
		const mn = monthKeyFromDate(selectedDate);
		const total = state.tasks.reduce((sum, t) => {
			if (!t.completed) return sum;
			if (weekKeyFromDate(t.date) !== wk) return sum;
			return sum + (t.points || 0);
		}, 0);
		setState((s) => {
			const currentMonth = s.monthlyTotals[mn] || { total: 0, weeks: {} };
			if (currentMonth.weeks[wk] === total) return s;
			const nextWeeks = { ...currentMonth.weeks, [wk]: total };
			const nextMonth = {
				total: Object.values(nextWeeks).reduce((a, b) => a + b, 0),
				weeks: nextWeeks,
			};
			return {
				...s,
				monthlyTotals: { ...s.monthlyTotals, [mn]: nextMonth },
			};
		});
	}

	function changeWeek(deltaWeeks) {
		const start = startOfISOWeekFromKey(weekKeyFromDate(selectedDate));
		const d = new Date(start);
		d.setUTCDate(start.getUTCDate() + deltaWeeks * 7);
		setSelectedDate(d.toISOString().slice(0, 10));
	}

	useEffect(() => {
		if (!RUN_TESTS) return;
		try {
			console.group('PointsTodoTracker Tests');
			console.assert(typeof state.dailyPoints === 'number', 'dailyPoints must be a number');
			console.assert(Array.isArray(state.tasks), 'tasks must be an array');
			console.log('Tasks count:', state.tasks.length);
			console.groupEnd();
		} catch (e) {
			console.error('Tests failed:', e);
		}
	}, [state]);

	if (loading) {
		return (
			<div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
				<p>Loading your data from Firebase...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 overflow-x-hidden">
			<div className="mx-auto max-w-7xl flex flex-col gap-6">
				<Header dailyPoints={state.dailyPoints} setDailyPoints={setDailyPoints} />

				<div className="flex flex-wrap items-center gap-3">
					<label className="text-sm text-zinc-300">Week</label>
					<div className="text-sm text-zinc-400 min-w-0 truncate">
						{formatWeekRangeFromKey(weekKeyFromDate(selectedDate))}
					</div>
					<button
						onClick={() => changeWeek(-1)}
						className={`text-sm px-3 py-2 rounded-md border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors ${
							selectedWeekStart < currentWeekStart ? 'ring-2 ring-fuchsia-500' : ''
						}`}
					>
						Prev
					</button>
					<button
						onClick={() => setSelectedDate(todayISO())}
						className={`text-sm px-3 py-2 rounded-md border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors ${
							selectedWeekStart === currentWeekStart
								? 'bg-fuchsia-600 text-white border-fuchsia-600'
								: ''
						}`}
					>
						This Week
					</button>
					<button
						onClick={() => changeWeek(1)}
						className={`text-sm px-3 py-2 rounded-md border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors ${
							selectedWeekStart > currentWeekStart ? 'ring-2 ring-fuchsia-500' : ''
						}`}
					>
						Next
					</button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
					<div className="lg:col-span-2 flex flex-col gap-12 items-center">
						<WeeklyTasks
							selectedDateISO={selectedDate}
							tasks={state.tasks}
							onAdd={addTask}
							onToggle={toggleTask}
							onDelete={deleteTask}
							dailyTarget={state.dailyPoints}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold">Monthly Tracker</h2>
					</div>
					<MonthlyTable monthlyTotals={state.monthlyTotals} />
				</div>

				<div className="rounded-xl border border-zinc-800 p-4 bg-zinc-950">
					<h3 className="font-semibold mb-2">Weekly Summary</h3>
					<WeeklyViz
						weekTotalsByDay={weekTotalsByDay}
						weeklyTotal={weeklyTotal}
						dailyTarget={state.dailyPoints}
					/>
					<div className="text-xs text-zinc-400 mt-2">
						{weeklyRemark(weeklyTotal / Math.max(1, state.dailyPoints * 7))}
					</div>
				</div>

				<button
					onClick={logCurrentWeekToMonthly}
					className="px-3 py-2 rounded-md bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500 text-white text-sm hover:opacity-90 transition"
				>
					Log current week
				</button>

				<div className="text-xs text-zinc-500 text-center py-6">
					Data synced with Firebase Firestore ⚡
				</div>
			</div>
		</div>
	);
}
