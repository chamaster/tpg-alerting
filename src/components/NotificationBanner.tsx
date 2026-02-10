import { useState, useEffect } from 'react';
import { getNotificationStatus, requestNotificationPermission } from '../services/notifications';
import { useLang } from '../LangContext';

export default function NotificationBanner() {
  const [status, setStatus] = useState(getNotificationStatus());
  const { t } = useLang();

  useEffect(() => {
    setStatus(getNotificationStatus());
  }, []);

  if (status === 'granted' || status === 'unsupported') return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center justify-between">
      <div className="text-sm text-amber-800">
        {status === 'denied' ? t.notifBlocked : t.notifPrompt}
      </div>
      {status === 'default' && (
        <button
          onClick={async () => {
            await requestNotificationPermission();
            setStatus(getNotificationStatus());
          }}
          className="ml-3 bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors whitespace-nowrap"
        >
          {t.enable}
        </button>
      )}
    </div>
  );
}
