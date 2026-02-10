import type { StationboardResponse, LocationResponse } from '../types';

const BASE_URL = 'https://transport.opendata.ch/v1';

export async function searchStations(query: string): Promise<LocationResponse> {
  const params = new URLSearchParams({ query, type: 'station' });
  const res = await fetch(`${BASE_URL}/locations?${params}`);
  if (!res.ok) throw new Error(`Station search failed: ${res.statusText}`);
  return res.json();
}

export async function getStationboard(
  stationId: string,
  limit = 30
): Promise<StationboardResponse> {
  const params = new URLSearchParams({
    id: stationId,
    limit: String(limit),
  });
  const res = await fetch(`${BASE_URL}/stationboard?${params}`);
  if (!res.ok) throw new Error(`Stationboard request failed: ${res.statusText}`);
  return res.json();
}

export function filterByLine(
  entries: StationboardResponse['stationboard'],
  lineNumber: string
) {
  return entries.filter((e) => e.number === lineNumber);
}

export function getDepartureTime(entry: StationboardResponse['stationboard'][0]): Date {
  const realtime = entry.stop.prognosis.departure;
  return new Date(realtime ?? entry.stop.departure);
}

export function getMinutesUntilDeparture(entry: StationboardResponse['stationboard'][0]): number {
  const dep = getDepartureTime(entry);
  return Math.max(0, Math.round((dep.getTime() - Date.now()) / 60000));
}

export function isDelayed(entry: StationboardResponse['stationboard'][0]): boolean {
  return entry.stop.prognosis.departure !== null;
}
