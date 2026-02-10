const translations = {
  fr: {
    // Header
    appTitle: 'Départs TPG',
    appSubtitle: 'Alertes bus & trams Genève',
    refresh: 'Actualiser',

    // Empty state
    noStops: 'Aucun arrêt ajouté',
    noStopsHint: 'Ajoutez un arrêt pour voir les prochains départs et être notifié quand partir.',
    addFirstStop: 'Ajouter votre premier arrêt',
    addStop: 'Ajouter un arrêt',

    // DepartureBoard
    notifyMe: 'Me notifier',
    walkTime: 'Temps de marche :',
    min: 'min',
    noDepartures: 'Aucun départ à venir',
    now: 'Maint.',
    delayed: 'retardé',
    leaveNow: 'Partez !',
    remove: 'Supprimer',

    // AddStopModal
    searchStop: 'Rechercher un arrêt',
    searchPlaceholder: 'ex. Petit-Veyrier, Bel-Air...',
    searching: 'Recherche...',
    change: 'Changer',
    loadingLines: 'Chargement des lignes...',
    selectLine: 'Ligne (optionnel)',
    allLines: 'Toutes',
    direction: 'Direction (optionnel)',
    bothDirections: 'Les deux directions',
    walkTimeLabel: "Temps de marche jusqu'à l'arrêt (minutes)",
    addStopButton: "Ajouter l'arrêt",

    // NotificationBanner
    notifBlocked: 'Les notifications sont bloquées. Activez-les dans les paramètres de votre navigateur pour recevoir les alertes de départ.',
    notifPrompt: 'Activez les notifications pour être alerté quand il est temps de partir pour votre bus.',
    enable: 'Activer',

    // Notifications (push)
    notifTitle: (line: string, mins: number) => `Bus ${line} dans ${mins} min`,
    notifBody: (station: string, to: string, walk: number) =>
      `Partez maintenant ! ${station} → ${to}. Temps de marche : ${walk} min.`,
    fetchError: 'Erreur lors du chargement des départs',
  },
  en: {
    appTitle: 'TPG Departures',
    appSubtitle: 'Geneva bus & tram alerts',
    refresh: 'Refresh',

    noStops: 'No stops added yet',
    noStopsHint: 'Add a stop to see upcoming departures and get notified when to leave.',
    addFirstStop: 'Add your first stop',
    addStop: 'Add a stop',

    notifyMe: 'Notify me',
    walkTime: 'Walk time:',
    min: 'min',
    noDepartures: 'No upcoming departures',
    now: 'Now',
    delayed: 'delayed',
    leaveNow: 'Leave now!',
    remove: 'Remove',

    searchStop: 'Search for a stop',
    searchPlaceholder: 'e.g. Petit-Veyrier, Bel-Air...',
    searching: 'Searching...',
    change: 'Change',
    loadingLines: 'Loading available lines...',
    selectLine: 'Select a line (optional)',
    allLines: 'All lines',
    direction: 'Direction (optional)',
    bothDirections: 'Both directions',
    walkTimeLabel: 'Walk time to stop (minutes)',
    addStopButton: 'Add stop',

    notifBlocked: 'Notifications are blocked. Enable them in your browser settings to receive departure alerts.',
    notifPrompt: "Enable notifications to get alerted when it's time to leave for your bus.",
    enable: 'Enable',

    notifTitle: (line: string, mins: number) => `Bus ${line} in ${mins} min`,
    notifBody: (station: string, to: string, walk: number) =>
      `Leave now! ${station} → ${to}. Walk time: ${walk} min.`,
    fetchError: 'Failed to fetch departures',
  },
} as const;

export type Lang = keyof typeof translations;
export type Translations = typeof translations['fr'];

export function getTranslations(lang: Lang): Translations {
  return translations[lang];
}
