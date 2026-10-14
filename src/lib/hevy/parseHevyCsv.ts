// Reading a Hevy workout export (Settings → Export & Import Data → Export
// Workouts): one CSV row per set, workouts identified by their start time.
//
// Times are local wall-clock times with no timezone ("13 Sep 2026, 12:49"), so
// they're kept as local parts here and placed in a timezone at import.
// Weights and distances are converted to UltraSync's storage units (lb, feet).

const LB_PER_KG = 2.20462262;
const FEET_PER_MILE = 5280;
const FEET_PER_KM = 3280.8399;

export type SetType = 'normal' | 'warmup' | 'failure' | 'drop';

export interface LocalDateTime {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
}

export interface HevySet {
  setType: SetType;
  weightLbs: number | null;
  reps: number | null;
  distanceFeet: number | null;
  durationSeconds: number | null;
  rpe: number | null;
}

export interface HevyExercise {
  title: string;
  notes: string | null;
  sets: HevySet[];
}

export interface HevyWorkout {
  title: string;
  description: string | null;
  start: LocalDateTime;
  end: LocalDateTime | null;
  exercises: HevyExercise[];
}

export interface HevyExport {
  workouts: HevyWorkout[];
  // The export's units, as the file's column names give them
  weightUnit: 'lbs' | 'kg';
  distanceUnit: 'miles' | 'km';
}

export class HevyCsvError extends Error {}

/** RFC 4180 CSV: quoted fields may hold commas, newlines and "" for a quote. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  // A trailing newline leaves an empty last row
  return rows.filter(r => r.length > 1 || r[0] !== '');
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

/** "13 Sep 2026, 12:49" (Hevy's format), or ISO "2026-09-13 12:49[:ss]" */
export function parseHevyTime(value: string): LocalDateTime | null {
  const text = value.trim();
  const hevy = /^(\d{1,2}) ([A-Za-z]{3})[a-z]* (\d{4}),? (\d{1,2}):(\d{2})/.exec(text);
  if (hevy) {
    const month = MONTHS[hevy[2].toLowerCase()];
    if (!month) return null;
    return { year: +hevy[3], month, day: +hevy[1], hour: +hevy[4], minute: +hevy[5] };
  }
  const iso = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(text);
  if (iso) {
    return { year: +iso[1], month: +iso[2], day: +iso[3], hour: +iso[4], minute: +iso[5] };
  }
  return null;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** "2026-09-13" */
export function localDate(t: LocalDateTime): string {
  return `${t.year}-${pad(t.month)}-${pad(t.day)}`;
}

/** "2026-09-13T12:49": the workout's identity across exports */
export function localKey(t: LocalDateTime): string {
  return `${localDate(t)}T${pad(t.hour)}:${pad(t.minute)}`;
}

/** Minutes since the epoch as if the wall-clock time were UTC; for ordering */
export function localMinutes(t: LocalDateTime): number {
  return Date.UTC(t.year, t.month - 1, t.day, t.hour, t.minute) / 60000;
}

// Offset of a timezone from UTC at an instant, in minutes
function zoneOffsetMinutes(instant: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
  }).formatToParts(new Date(instant));
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return Math.round((asUtc - instant) / 60000);
}

/** The instant a wall-clock time in a timezone names, as an ISO string */
export function toInstant(t: LocalDateTime, timeZone: string): string {
  const wall = Date.UTC(t.year, t.month - 1, t.day, t.hour, t.minute);
  // Twice, so a time just across a DST change settles on the right offset
  let instant = wall - zoneOffsetMinutes(wall, timeZone) * 60000;
  instant = wall - zoneOffsetMinutes(instant, timeZone) * 60000;
  return new Date(instant).toISOString();
}

const SET_TYPES: Record<string, SetType> = {
  normal: 'normal',
  warmup: 'warmup',
  failure: 'failure',
  dropset: 'drop',
  drop: 'drop',
};

function toNumber(value: string | undefined): number | null {
  if (value === undefined) return null;
  const text = value.trim();
  if (text === '') return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

const round = (value: number, places: number) => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

export function parseHevyCsv(text: string): HevyExport {
  const rows = parseCsv(text.replace(/^\uFEFF/, ''));
  if (rows.length === 0) throw new HevyCsvError('The file is empty.');

  const header = rows[0].map(h => h.trim().toLowerCase());
  const column = (name: string) => header.indexOf(name);
  const required = ['title', 'start_time', 'exercise_title'];
  const missing = required.filter(name => column(name) === -1);
  if (missing.length > 0) {
    throw new HevyCsvError(
      "This doesn't look like a Hevy workout export: it has no " +
      missing.map(m => `"${m}"`).join(', ') + ' column.'
    );
  }

  const weightUnit = column('weight_kg') !== -1 && column('weight_lbs') === -1 ? 'kg' : 'lbs';
  const distanceUnit = column('distance_km') !== -1 && column('distance_miles') === -1 ? 'km' : 'miles';
  const weightColumn = column(weightUnit === 'kg' ? 'weight_kg' : 'weight_lbs');
  const distanceColumn = column(distanceUnit === 'km' ? 'distance_km' : 'distance_miles');

  const workouts = new Map<string, HevyWorkout>();
  const cell = (row: string[], index: number) => (index === -1 ? undefined : row[index]);

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const title = (cell(row, column('title')) ?? '').trim();
    const startText = cell(row, column('start_time')) ?? '';
    const start = parseHevyTime(startText);
    if (!start) {
      throw new HevyCsvError(`Row ${r + 1}: couldn't read the start time "${startText}".`);
    }
    const key = `${localKey(start)}|${title}`;

    let workout = workouts.get(key);
    if (!workout) {
      const description = (cell(row, column('description')) ?? '').trim();
      workout = {
        title: title || 'Workout',
        description: description || null,
        start,
        end: parseHevyTime(cell(row, column('end_time')) ?? ''),
        exercises: [],
      };
      workouts.set(key, workout);
    }

    const exerciseTitle = (cell(row, column('exercise_title')) ?? '').trim();
    if (!exerciseTitle) continue;
    // Consecutive rows of the same exercise are one exercise; the same one
    // again later in the workout is a second entry, as Hevy shows it
    let exercise = workout.exercises[workout.exercises.length - 1];
    if (!exercise || exercise.title !== exerciseTitle) {
      const notes = (cell(row, column('exercise_notes')) ?? '').trim();
      exercise = { title: exerciseTitle, notes: notes || null, sets: [] };
      workout.exercises.push(exercise);
    }

    const weight = toNumber(cell(row, weightColumn));
    const distance = toNumber(cell(row, distanceColumn));
    const rpe = toNumber(cell(row, column('rpe')));
    const reps = toNumber(cell(row, column('reps')));
    const duration = toNumber(cell(row, column('duration_seconds')));

    exercise.sets.push({
      setType: SET_TYPES[(cell(row, column('set_type')) ?? '').trim().toLowerCase()] ?? 'normal',
      weightLbs: weight === null ? null : round(weightUnit === 'kg' ? weight * LB_PER_KG : weight, 2),
      reps: reps === null ? null : Math.round(reps),
      distanceFeet: distance === null
        ? null
        : round(distance * (distanceUnit === 'km' ? FEET_PER_KM : FEET_PER_MILE), 1),
      durationSeconds: duration === null ? null : Math.round(duration),
      // UltraSync logs whole-number RPE from 1 to 10
      rpe: rpe === null ? null : Math.min(10, Math.max(1, Math.round(rpe))),
    });
  }

  const sorted = [...workouts.values()].sort((a, b) => localMinutes(a.start) - localMinutes(b.start));
  if (sorted.length === 0) throw new HevyCsvError('The file has no workouts in it.');
  return { workouts: sorted, weightUnit, distanceUnit };
}
