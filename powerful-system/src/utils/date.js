export const fmtDate = (d) => new Date(d).toISOString().slice(0, 10);
export const todayISO = () => fmtDate(new Date());

function isoWeek(dIn) {
	const d = new Date(Date.UTC(dIn.getFullYear(), dIn.getMonth(), dIn.getDate()));
	d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
	return { week: weekNo, year: d.getUTCFullYear() };
}

export const weekKeyFromDate = (dateISO) => {
	const { week, year } = isoWeek(new Date(dateISO));
	return `${year}-W${String(week).padStart(2, '0')}`;
};

export const monthKeyFromDate = (dateISO) => dateISO.slice(0, 7);

export function monthLabelFromKey(monthKey) {
	const [y, m] = monthKey.split('-').map(Number);
	const d = new Date(y, m - 1, 1);
	return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export function startOfISOWeekFromKey(weekKey) {
	const [yearStr, weekStr] = weekKey.split('-W');
	const year = Number(yearStr);
	const week = Number(weekStr);
	const jan4 = new Date(Date.UTC(year, 0, 4));
	const jan4Dow = jan4.getUTCDay() || 7;
	const week1Monday = new Date(jan4);
	week1Monday.setUTCDate(jan4.getUTCDate() - (jan4Dow - 1));
	const start = new Date(week1Monday);
	start.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);
	return start;
}

export function endOfISOWeekFromKey(weekKey) {
	const start = startOfISOWeekFromKey(weekKey);
	const end = new Date(start);
	end.setUTCDate(start.getUTCDate() + 6);
	return end;
}

export function formatWeekRangeFromKey(weekKey) {
	const start = startOfISOWeekFromKey(weekKey);
	const end = endOfISOWeekFromKey(weekKey);
	const startStr = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
	const endStr = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
	return `${startStr} – ${endStr}`;
}

export function isoWeekDays(dateISO) {
	const wkKey = weekKeyFromDate(dateISO);
	const start = startOfISOWeekFromKey(wkKey);
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(start);
		d.setUTCDate(start.getUTCDate() + i);
		return fmtDate(d);
	});
} 