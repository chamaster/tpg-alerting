import { useState, useEffect, useRef } from 'react';
import { searchStations, getStationboard } from '../services/api';
import { getLineColor, getLineTextColor } from '../utils/lineColors';
import { useLang } from '../LangContext';
import type { Station, WatchedStop } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (stop: WatchedStop) => void;
}

export default function AddStopModal({ open, onClose, onAdd }: Props) {
  const [query, setQuery] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [lines, setLines] = useState<{ number: string; directions: string[] }[]>([]);
  const [loadingLines, setLoadingLines] = useState(false);
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('');
  const [walkTime, setWalkTime] = useState(5);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { t } = useLang();

  useEffect(() => {
    if (!open) {
      setQuery('');
      setStations([]);
      setSelectedStation(null);
      setLines([]);
      setSelectedLine('');
      setSelectedDirection('');
      setWalkTime(5);
    }
  }, [open]);

  useEffect(() => {
    if (query.length < 2) {
      setStations([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const result = await searchStations(query);
        setStations(result.stations.filter((s) => s.id));
      } catch {
        setStations([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  async function selectStation(station: Station) {
    setSelectedStation(station);
    setLoadingLines(true);
    try {
      const board = await getStationboard(station.id, 50);
      const lineMap = new Map<string, Set<string>>();
      for (const entry of board.stationboard) {
        const key = entry.number;
        if (!lineMap.has(key)) lineMap.set(key, new Set());
        lineMap.get(key)!.add(entry.to);
      }
      setLines(
        [...lineMap.entries()]
          .map(([number, dirs]) => ({ number, directions: [...dirs] }))
          .sort((a, b) => {
            const na = parseInt(a.number), nb = parseInt(b.number);
            if (!isNaN(na) && !isNaN(nb)) return na - nb;
            return a.number.localeCompare(b.number);
          })
      );
    } catch {
      setLines([]);
    } finally {
      setLoadingLines(false);
    }
  }

  function handleAdd() {
    if (!selectedStation) return;
    onAdd({
      id: crypto.randomUUID(),
      stationId: selectedStation.id,
      stationName: selectedStation.name,
      lineNumber: selectedLine,
      direction: selectedDirection,
      walkTimeMinutes: walkTime,
      notificationsEnabled: true,
    });
    onClose();
  }

  const availableDirections = lines.find((l) => l.number === selectedLine)?.directions ?? [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t.addStop}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4">
          {!selectedStation ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.searchStop}
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                autoFocus
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
              {searching && (
                <p className="text-sm text-gray-400 mt-2">{t.searching}</p>
              )}
              {stations.length > 0 && (
                <ul className="mt-2 border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-48 overflow-y-auto">
                  {stations.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => selectStation(s)}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 text-gray-700 transition-colors"
                      >
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="font-medium text-gray-900">{selectedStation.name}</span>
                <button
                  onClick={() => {
                    setSelectedStation(null);
                    setLines([]);
                    setSelectedLine('');
                    setSelectedDirection('');
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  {t.change}
                </button>
              </div>

              {loadingLines ? (
                <p className="text-sm text-gray-400">{t.loadingLines}</p>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.selectLine}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => { setSelectedLine(''); setSelectedDirection(''); }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        selectedLine === ''
                          ? 'bg-gray-700 text-white border-gray-700'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {t.allLines}
                    </button>
                    {lines.map((l) => (
                      <button
                        key={l.number}
                        onClick={() => { setSelectedLine(l.number); setSelectedDirection(''); }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${
                          selectedLine === l.number
                            ? 'border-transparent'
                            : 'border-gray-300 hover:opacity-80'
                        }`}
                        style={selectedLine === l.number
                          ? { backgroundColor: getLineColor(l.number), color: getLineTextColor(l.number), borderColor: getLineColor(l.number) }
                          : { backgroundColor: getLineColor(l.number) + '18', color: getLineColor(l.number) }
                        }
                      >
                        {l.number}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedLine && availableDirections.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.direction}
                  </label>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedDirection('')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                        selectedDirection === ''
                          ? 'border-transparent text-white'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                      style={selectedDirection === ''
                        ? { backgroundColor: getLineColor(selectedLine), borderColor: getLineColor(selectedLine) }
                        : undefined
                      }
                    >
                      {t.bothDirections}
                    </button>
                    {availableDirections.map((dir) => (
                      <button
                        key={dir}
                        onClick={() => setSelectedDirection(dir)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                          selectedDirection === dir
                            ? 'border-transparent text-white'
                            : 'bg-white text-gray-700 border-gray-300'
                        }`}
                        style={selectedDirection === dir
                          ? { backgroundColor: getLineColor(selectedLine), borderColor: getLineColor(selectedLine) }
                          : undefined
                        }
                      >
                        → {dir}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.walkTimeLabel}
                </label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={walkTime}
                  onChange={(e) => setWalkTime(Number(e.target.value))}
                  className="w-full accent-red-600"
                />
                <div className="text-center text-sm text-gray-600 font-medium">
                  {walkTime} min
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                {t.addStopButton}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
