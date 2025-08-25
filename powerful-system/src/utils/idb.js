const DB_NAME = 'powerful-system';
const DB_VERSION = 1;
const STORE = 'appState';

function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) {
				db.createObjectStore(STORE, { keyPath: 'key' });
			}
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

export async function idbGet(key) {
	try {
		const db = await openDb();
		return await new Promise((resolve, reject) => {
			const tx = db.transaction(STORE, 'readonly');
			const store = tx.objectStore(STORE);
			const getReq = store.get(key);
			getReq.onsuccess = () => resolve(getReq.result ? getReq.result.value : null);
			getReq.onerror = () => reject(getReq.error);
		});
	} catch (e) {
		console.warn('idbGet failed', e);
		return null;
	}
}

export async function idbSet(key, value) {
	try {
		const db = await openDb();
		return await new Promise((resolve, reject) => {
			const tx = db.transaction(STORE, 'readwrite');
			const store = tx.objectStore(STORE);
			const putReq = store.put({ key, value });
			putReq.onsuccess = () => resolve(true);
			putReq.onerror = () => reject(putReq.error);
		});
	} catch (e) {
		console.warn('idbSet failed', e);
		return false;
	}
} 