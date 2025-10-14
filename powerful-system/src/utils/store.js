// src/store.js
import { db } from '../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const storeKey = 'points-todo-v1';
const userId = 'powerful-system-user'; 
const dbName = 'powerfulSystemAppState';

export const defaultState = () => ({
  dailyPoints: 20,
  tasks: [],
  weeklyTotals: {},
  monthlyTotals: {},
  lastSeenDay: new Date().toISOString().slice(0, 10),
});

export const loadState = async () => {
  try {
    const ref = doc(db, dbName, `${userId}-${storeKey}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      console.log('No stored state found for user, using default.');
      return defaultState();
    }
    return snap.data();
  } catch (e) {
    console.error('Error loading state from Firebase:', e);
    return defaultState();
  }
};

export const saveState = async (state) => {
  try {
    const ref = doc(db, dbName, `${userId}-${storeKey}`);
    await setDoc(ref, state);
    console.log('State saved to Firebase.');
  } catch (e) {
    console.error('Error saving state to Firebase:', e);
  }
};
