// Formatting and shapes for public workouts (profile and shared workout pages)

export interface PublicSet {
  reps: number | null;
  weight_lbs: number | null;
  duration_seconds: number | null;
  distance_feet: number | null;
  is_pr: boolean;
}

export interface PublicExercise {
  name: string;
  muscle_group: string | null;
  sets: PublicSet[];
}

const FEET_PER_MILE = 5280;

// Same labels the app uses for cardio (utils/cardioFormat.ts)
const ACTIVITY_LABELS: Record<string, string> = {
  running: 'Run',
  walking: 'Walk',
  cycling: 'Ride',
  swimming: 'Swim',
};

export function cardioActivityLabel(activityType: string | null | undefined): string {
  return (activityType && ACTIVITY_LABELS[activityType]) || 'Cardio';
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatDate(date: string): string {
  // date is YYYY-MM-DD; parse as local so it doesn't shift a day in the Americas
  const [y, mo, d] = date.split('-').map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTimestampDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// Minutes per mile as m:ss
export function formatPace(minutesPerMile: number): string {
  const totalSeconds = Math.round(minutesPerMile * 60);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')} /mi`;
}

export function formatSet(set: PublicSet): string {
  const parts: string[] = [];
  if (set.weight_lbs != null && set.weight_lbs > 0) parts.push(`${+set.weight_lbs.toFixed(1)} lb`);
  if (set.reps != null) parts.push(parts.length ? `× ${set.reps}` : `${set.reps} reps`);
  if (set.distance_feet != null && set.distance_feet > 0) {
    parts.push(
      set.distance_feet >= FEET_PER_MILE / 10
        ? `${(set.distance_feet / FEET_PER_MILE).toFixed(2)} mi`
        : `${Math.round(set.distance_feet)} ft`
    );
  }
  if (set.duration_seconds != null && set.duration_seconds > 0) {
    const m = Math.floor(set.duration_seconds / 60);
    const s = set.duration_seconds % 60;
    parts.push(m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`);
  }
  return parts.join(' ') || '—';
}
