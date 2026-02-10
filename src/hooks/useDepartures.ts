import { useState, useEffect, useCallback } from 'react';
import { getStationboard, filterByLine, getMinutesUntilDeparture } from '../services/api';
import { sendNotification } from '../services/notifications';
import { useLang } from '../LangContext';
import type { StationboardEntry, WatchedStop } from '../types';

const POLL_INTERVAL = 30_000; // 30 seconds

interface DepartureInfo {
  entry: StationboardEntry;
  minutesUntil: number;
}

export function useDepartures(watchedStops: WatchedStop[]) {
  const [departures, setDepartures] = useState<Map<string, DepartureInfo[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastNotified, setLastNotified] = useState<Map<string, number>>(new Map());
  const { t } = useLang();

  const fetchDepartures = useCallback(async () => {
    if (watchedStops.length === 0) {
      setDepartures(new Map());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const uniqueStations = [...new Set(watchedStops.map((s) => s.stationId))];
      const results = await Promise.all(
        uniqueStations.map((id) => getStationboard(id))
      );

      const stationData = new Map(
        uniqueStations.map((id, i) => [id, results[i].stationboard])
      );

      const newDepartures = new Map<string, DepartureInfo[]>();

      for (const stop of watchedStops) {
        const entries = stationData.get(stop.stationId) ?? [];
        const filtered = stop.lineNumber
          ? filterByLine(entries, stop.lineNumber)
          : entries;

        const dirFiltered = stop.direction
          ? filtered.filter((e) => e.to === stop.direction)
          : filtered;

        const infos: DepartureInfo[] = dirFiltered.map((entry) => ({
          entry,
          minutesUntil: getMinutesUntilDeparture(entry),
        }));

        newDepartures.set(stop.id, infos);

        // Send notification if it's time to leave
        if (stop.notificationsEnabled && infos.length > 0) {
          const nextDep = infos[0];
          const shouldNotify = nextDep.minutesUntil <= stop.walkTimeMinutes + 2
            && nextDep.minutesUntil > 0;

          const lastTime = lastNotified.get(stop.id) ?? 0;
          const now = Date.now();

          if (shouldNotify && now - lastTime > 60_000) {
            sendNotification(
              t.notifTitle(stop.lineNumber, nextDep.minutesUntil),
              t.notifBody(stop.stationName, nextDep.entry.to, stop.walkTimeMinutes)
            );
            setLastNotified((prev) => new Map(prev).set(stop.id, now));
          }
        }
      }

      setDepartures(newDepartures);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.fetchError);
    } finally {
      setLoading(false);
    }
  }, [watchedStops, lastNotified, t]);

  useEffect(() => {
    fetchDepartures();
    const interval = setInterval(fetchDepartures, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchDepartures]);

  return { departures, loading, error, refresh: fetchDepartures };
}
