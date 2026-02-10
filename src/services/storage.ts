import type { WatchedStop } from '../types';

const STORAGE_KEY = 'tpg-alerting-watched-stops';

export function loadWatchedStops(): WatchedStop[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWatchedStops(stops: WatchedStop[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stops));
}

export function addWatchedStop(stop: WatchedStop): WatchedStop[] {
  const stops = loadWatchedStops();
  stops.push(stop);
  saveWatchedStops(stops);
  return stops;
}

export function removeWatchedStop(id: string): WatchedStop[] {
  const stops = loadWatchedStops().filter((s) => s.id !== id);
  saveWatchedStops(stops);
  return stops;
}

export function updateWatchedStop(id: string, updates: Partial<WatchedStop>): WatchedStop[] {
  const stops = loadWatchedStops().map((s) =>
    s.id === id ? { ...s, ...updates } : s
  );
  saveWatchedStops(stops);
  return stops;
}
