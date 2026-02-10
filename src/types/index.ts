export interface Station {
  id: string;
  name: string;
  coordinate: {
    type: string;
    x: number;
    y: number;
  };
}

export interface Prognosis {
  platform: string | null;
  departure: string | null;
  arrival: string | null;
  capacity1st: string | null;
  capacity2nd: string | null;
}

export interface StationboardEntry {
  stop: {
    station: Station;
    departure: string;
    departureTimestamp: number;
    platform: string;
    prognosis: Prognosis;
  };
  name: string;
  category: string;
  number: string;
  operator: string;
  to: string;
}

export interface StationboardResponse {
  station: Station;
  stationboard: StationboardEntry[];
}

export interface LocationResponse {
  stations: Station[];
}

export interface WatchedStop {
  id: string;
  stationId: string;
  stationName: string;
  lineNumber: string;
  direction: string;
  walkTimeMinutes: number;
  notificationsEnabled: boolean;
}
