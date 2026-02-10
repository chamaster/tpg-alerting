// TPG (Transports Publics Genevois) official line colors
// Based on the TPG network map (plan schématique)

const TPG_LINE_COLORS: Record<string, string> = {
  // Trams
  '12': '#BE1622',
  '14': '#009FE3',
  '15': '#00A651',
  '17': '#F39200',
  '18': '#91268F',

  // Major bus lines
  '1': '#1D4289',
  '2': '#E30513',
  '3': '#00A74A',
  '5': '#6F2282',
  '6': '#D4A900',
  '7': '#00B4F0',
  '8': '#8B572A',
  '9': '#F7A600',
  '10': '#E5007D',
  '11': '#84C7A5',
  '19': '#009640',
  '20': '#00ADEF',
  '21': '#5C2D91',
  '22': '#E85D04',
  '23': '#B7BF10',
  '25': '#009B77',
  '28': '#A0006D',
  '31': '#6C6E70',
  '32': '#BDB8AD',
  '33': '#7C8A30',
  '34': '#CE8E00',
  '35': '#D97C00',
  '36': '#00677F',
  '41': '#D86018',
  '42': '#007A6D',
  '43': '#B80050',
  '44': '#3C7D2E',
  '45': '#7E5DA6',
  '46': '#C5003E',
  '47': '#4EA8B6',
  '51': '#6A6EA5',
  '53': '#2DA8A8',
  '57': '#C0A028',

  // Regional / letter lines
  'K': '#0072BC',
  'L': '#E30513',
  'M': '#008C4A',
  'N': '#F39200',
  'O': '#91268F',
  'S': '#00A1DE',
  'V': '#7B2D26',
  'W': '#00843D',
  'Y': '#CE8E00',
};

/**
 * Get the background color for a TPG line.
 * Returns a consistent color from the TPG color map, or generates
 * a deterministic color for unknown lines.
 */
export function getLineColor(lineNumber: string): string {
  if (TPG_LINE_COLORS[lineNumber]) {
    return TPG_LINE_COLORS[lineNumber];
  }

  // Generate a deterministic color for unknown lines
  let hash = 0;
  for (let i = 0; i < lineNumber.length; i++) {
    hash = lineNumber.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 40%)`;
}

/**
 * Get the text color (white or black) that has best contrast
 * against the given background hex color.
 */
export function getLineTextColor(lineNumber: string): string {
  const bg = getLineColor(lineNumber);

  // For HSL-generated colors (dark enough at 40% lightness), use white
  if (bg.startsWith('hsl')) return '#FFFFFF';

  // Parse hex color and compute relative luminance
  const hex = bg.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.55 ? '#000000' : '#FFFFFF';
}
