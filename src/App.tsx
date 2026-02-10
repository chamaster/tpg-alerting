import { useState, useCallback } from 'react';
import DepartureBoard from './components/DepartureBoard';
import AddStopModal from './components/AddStopModal';
import NotificationBanner from './components/NotificationBanner';
import { useDepartures } from './hooks/useDepartures';
import {
  loadWatchedStops,
  addWatchedStop,
  removeWatchedStop,
  updateWatchedStop,
} from './services/storage';
import type { WatchedStop } from './types';

function App() {
  const [watchedStops, setWatchedStops] = useState<WatchedStop[]>(loadWatchedStops);
  const [modalOpen, setModalOpen] = useState(false);
  const { departures, loading, error, refresh } = useDepartures(watchedStops);

  const handleAdd = useCallback((stop: WatchedStop) => {
    const updated = addWatchedStop(stop);
    setWatchedStops(updated);
  }, []);

  const handleRemove = useCallback((id: string) => {
    const updated = removeWatchedStop(id);
    setWatchedStops(updated);
  }, []);

  const handleToggleNotifications = useCallback((id: string) => {
    const stop = watchedStops.find((s) => s.id === id);
    if (!stop) return;
    const updated = updateWatchedStop(id, {
      notificationsEnabled: !stop.notificationsEnabled,
    });
    setWatchedStops(updated);
  }, [watchedStops]);

  const handleUpdateWalkTime = useCallback((id: string, minutes: number) => {
    const updated = updateWatchedStop(id, { walkTimeMinutes: minutes });
    setWatchedStops(updated);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-700 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Départs TPG</h1>
            <p className="text-red-200 text-sm">Alertes bus & trams Genève</p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="text-red-200 hover:text-white transition-colors disabled:opacity-50"
            title="Actualiser"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <NotificationBanner />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {watchedStops.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚌</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucun arrêt ajouté</h2>
            <p className="text-gray-500 mb-6">
              Ajoutez un arrêt pour voir les prochains départs et être notifié quand partir.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors shadow-md"
            >
              Ajouter votre premier arrêt
            </button>
          </div>
        ) : (
          <>
            {watchedStops.map((stop) => (
              <DepartureBoard
                key={stop.id}
                stop={stop}
                departures={departures.get(stop.id) ?? []}
                onRemove={handleRemove}
                onToggleNotifications={handleToggleNotifications}
                onUpdateWalkTime={handleUpdateWalkTime}
              />
            ))}
          </>
        )}
      </main>

      {/* FAB - Add stop button */}
      {watchedStops.length > 0 && (
        <button
          onClick={() => setModalOpen(true)}
          className="fixed bottom-6 right-6 bg-red-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center text-3xl"
          title="Ajouter un arrêt"
        >
          +
        </button>
      )}

      <AddStopModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}

export default App;
