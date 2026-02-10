import { isDelayed, getDepartureTime } from '../services/api';
import { getLineColor, getLineTextColor } from '../utils/lineColors';
import type { StationboardEntry, WatchedStop } from '../types';

interface DepartureInfo {
  entry: StationboardEntry;
  minutesUntil: number;
}

interface Props {
  stop: WatchedStop;
  departures: DepartureInfo[];
  onRemove: (id: string) => void;
  onToggleNotifications: (id: string) => void;
  onUpdateWalkTime: (id: string, minutes: number) => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' });
}

export default function DepartureBoard({
  stop,
  departures,
  onRemove,
  onToggleNotifications,
  onUpdateWalkTime,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div
        className={`px-4 py-3 flex items-center justify-between ${!stop.lineNumber ? 'bg-gray-700' : ''}`}
        style={stop.lineNumber ? {
          backgroundColor: getLineColor(stop.lineNumber),
        } : undefined}
      >
        <div className="flex items-center gap-3">
          {stop.lineNumber ? (
            <span
              className="font-bold rounded-lg px-3 py-1 text-lg"
              style={{
                backgroundColor: '#FFFFFF',
                color: getLineColor(stop.lineNumber),
              }}
            >
              {stop.lineNumber}
            </span>
          ) : (
            <span className="bg-white text-gray-700 font-bold rounded-lg px-3 py-1 text-lg">
              All
            </span>
          )}
          <div style={{ color: stop.lineNumber ? getLineTextColor(stop.lineNumber) : '#FFFFFF' }}>
            <div className="font-semibold">{stop.stationName}</div>
            {stop.direction && (
              <div className="text-sm" style={{ opacity: 0.8 }}>→ {stop.direction}</div>
            )}
          </div>
        </div>
        <button
          onClick={() => onRemove(stop.id)}
          className="hover:opacity-100 transition-opacity text-xl leading-none"
          style={{ color: stop.lineNumber ? getLineTextColor(stop.lineNumber) : '#FFFFFF', opacity: 0.7 }}
          title="Supprimer"
        >
          &times;
        </button>
      </div>

      <div className="px-4 py-2 bg-gray-50 flex items-center gap-4 text-sm border-b border-gray-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={stop.notificationsEnabled}
            onChange={() => onToggleNotifications(stop.id)}
            className="rounded accent-red-600"
          />
          <span className="text-gray-700">Me notifier</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-gray-500">Temps de marche :</span>
          <input
            type="number"
            min={1}
            max={60}
            value={stop.walkTimeMinutes}
            onChange={(e) => onUpdateWalkTime(stop.id, Number(e.target.value))}
            className="w-14 px-2 py-0.5 border border-gray-300 rounded text-center text-sm"
          />
          <span className="text-gray-500">min</span>
        </label>
      </div>

      <div className="divide-y divide-gray-100">
        {departures.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-400">
            Aucun départ à venir
          </div>
        ) : (
          departures.slice(0, 6).map((dep, i) => {
            const depTime = getDepartureTime(dep.entry);
            const delayed = isDelayed(dep.entry);
            const urgent = dep.minutesUntil <= stop.walkTimeMinutes;

            return (
              <div
                key={i}
                className={`px-4 py-3 flex items-center justify-between ${
                  urgent ? 'bg-amber-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`text-2xl font-bold tabular-nums ${
                      urgent
                        ? 'text-amber-600'
                        : dep.minutesUntil <= 1
                          ? 'text-red-600'
                          : 'text-gray-900'
                    }`}
                  >
                    {dep.minutesUntil === 0 ? 'Maint.' : `${dep.minutesUntil}'`}
                  </div>
                  <div>
                    <div className="text-gray-700">→ {dep.entry.to}</div>
                    <div className="text-xs text-gray-400">
                      {formatTime(depTime)}
                      {delayed && (
                        <span className="ml-2 text-orange-500 font-medium">retardé</span>
                      )}
                    </div>
                  </div>
                </div>
                {urgent && dep.minutesUntil > 0 && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                    Partez !
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
