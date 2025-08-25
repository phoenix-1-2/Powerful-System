export const storeKey = 'points-todo-v1';

export const loadState = () => {
	try {
		const raw = localStorage.getItem(storeKey);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch (e) {
		console.error('Failed to parse stored state:', e);
		try { localStorage.removeItem(storeKey); } catch (err) {
			console.warn('Failed to clear corrupt localStorage key', err);
		}
		return null;
	}
};

export const saveState = (state) => {
	try {
		localStorage.setItem(storeKey, JSON.stringify(state));
	} catch (e) {
		console.error('Failed to save state:', e);
	}
};

export const defaultState = () => ({
	dailyPoints: 100,
	tasks: [],
	weeklyTotals: {},
	monthlyTotals: {},
	lastSeenDay: new Date().toISOString().slice(0, 10),
});

// IndexedDB support
import { idbGet, idbSet } from './idb.js';

export async function loadStateIDB() {
	const val = await idbGet(storeKey);
	return val || null;
}

export async function saveStateIDB(state) {
	await idbSet(storeKey, state);
} 