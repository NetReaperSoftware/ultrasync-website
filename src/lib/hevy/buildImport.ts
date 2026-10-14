// Turning a parsed Hevy export plus the user's choices into what
// fitness.import_hevy_routines / import_hevy_workouts take (FitSync
// supabase/migrations/add-hevy-import.sql).

import { localDate, localKey, toInstant, type HevyExport, type HevySet, type HevyWorkout } from './parseHevyCsv';
import type { CatalogExercise } from './matchExercises';
import { assignPRFlags, type PRExercise, type PRSession } from './prFlags';

// Hevy's names for a workout started empty, not a routine the user made
const AUTOMATIC_TITLE = /^(morning|afternoon|evening|night|late night|midday|early morning) workout\b/i;

export const isAutomaticTitle = (title: string) => AUTOMATIC_TITLE.test(title.trim());

/** What the data has for each Hevy exercise, to warn when a match drops some */
export interface ExerciseUsage {
  title: string;
  setCount: number;
  workoutCount: number;
  hasWeight: boolean;
  hasReps: boolean;
  hasDuration: boolean;
  hasDistance: boolean;
}

export function summarizeExercises(data: HevyExport): ExerciseUsage[] {
  const usage = new Map<string, ExerciseUsage & { workouts: Set<HevyWorkout> }>();
  for (const workout of data.workouts) {
    for (const exercise of workout.exercises) {
      let entry = usage.get(exercise.title);
      if (!entry) {
        entry = {
          title: exercise.title, setCount: 0, workoutCount: 0, workouts: new Set(),
          hasWeight: false, hasReps: false, hasDuration: false, hasDistance: false,
        };
        usage.set(exercise.title, entry);
      }
      entry.workouts.add(workout);
      for (const set of exercise.sets) {
        entry.setCount++;
        if (set.weightLbs) entry.hasWeight = true;
        if (set.reps) entry.hasReps = true;
        if (set.durationSeconds) entry.hasDuration = true;
        if (set.distanceFeet) entry.hasDistance = true;
      }
    }
  }
  return [...usage.values()]
    .map(({ workouts, ...entry }) => ({ ...entry, workoutCount: workouts.size }))
    .sort((a, b) => b.setCount - a.setCount);
}

/** What a Hevy exercise logged that the chosen UltraSync exercise doesn't track */
export function droppedFields(usage: ExerciseUsage, exercise: CatalogExercise): string[] {
  const dropped: string[] = [];
  if (usage.hasWeight && !exercise.uses_weight) dropped.push('weight');
  if (usage.hasReps && !exercise.uses_reps) dropped.push('reps');
  if (usage.hasDuration && !exercise.uses_duration) dropped.push('time');
  if (usage.hasDistance && !exercise.uses_distance) dropped.push('distance');
  return dropped;
}

export interface TitleUsage {
  title: string;
  workoutCount: number;
  latest: HevyWorkout;
}

export function summarizeTitles(data: HevyExport): TitleUsage[] {
  const titles = new Map<string, TitleUsage>();
  for (const workout of data.workouts) {
    const entry = titles.get(workout.title);
    if (entry) {
      entry.workoutCount++;
      entry.latest = workout; // workouts are oldest first
    } else {
      titles.set(workout.title, { title: workout.title, workoutCount: 1, latest: workout });
    }
  }
  return [...titles.values()].sort((a, b) => b.workoutCount - a.workoutCount);
}

// ─── Placing workouts in time ───────────────────────────────────────────────

export interface PlacedWorkout {
  workout: HevyWorkout;
  importKey: string;
  start: string; // ISO instant
  end: string | null;
}

/** Each workout's instants in the timezone, and its import key */
export function placeWorkouts(data: HevyExport, timeZone: string): PlacedWorkout[] {
  const seen = new Map<string, number>();
  return data.workouts.map(workout => {
    // Two workouts started the same minute still get their own key
    const base = `hevy:${localKey(workout.start)}`;
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return {
      workout,
      importKey: count === 1 ? base : `${base}#${count}`,
      start: toInstant(workout.start, timeZone),
      end: workout.end ? toInstant(workout.end, timeZone) : null,
    };
  });
}

export interface ExistingWorkout {
  start_time: string;
  end_time: string | null;
  source: string;
  import_key: string | null;
}

export type WorkoutStatus = 'new' | 'already_imported' | 'overlapping';

/** The same checks import_hevy_workouts makes, for the preview */
export function workoutStatus(placed: PlacedWorkout, existing: ExistingWorkout[]): WorkoutStatus {
  if (existing.some(w => w.import_key === placed.importKey)) return 'already_imported';
  const start = Date.parse(placed.start);
  const end = placed.end ? Date.parse(placed.end) : start;
  const overlaps = existing.some(w => {
    if (w.source !== 'ultrasync') return false;
    const wStart = Date.parse(w.start_time);
    const wEnd = w.end_time ? Date.parse(w.end_time) : wStart;
    return wStart === start || (wStart < end && wEnd > start);
  });
  return overlaps ? 'overlapping' : 'new';
}

// ─── Sets in UltraSync's terms ──────────────────────────────────────────────

export interface ConvertedSet {
  weight: number | null;
  reps: number | null;
  durationSeconds: number | null;
  distanceFeet: number | null;
  setType: HevySet['setType'];
  rpe: number | null;
}

/**
 * A Hevy set as the matched exercise records it: only the measurements it
 * tracks, and for Bodyweight + Weight exercises a signed weight (Hevy logs
 * assistance as a positive number; UltraSync stores it negative). Null when
 * nothing the exercise tracks was logged.
 */
export function convertSet(set: HevySet, exercise: CatalogExercise): ConvertedSet | null {
  let weight: number | null = null;
  if (exercise.uses_weight) {
    if (exercise.bodyweight_mode) {
      const amount = set.weightLbs ?? 0;
      weight = exercise.bodyweight_mode === 'assisted' ? -Math.abs(amount) : amount;
    } else {
      weight = set.weightLbs;
    }
  }
  const converted: ConvertedSet = {
    weight,
    reps: exercise.uses_reps ? set.reps : null,
    durationSeconds: exercise.uses_duration ? set.durationSeconds : null,
    distanceFeet: exercise.uses_distance ? set.distanceFeet : null,
    setType: set.setType,
    rpe: set.rpe,
  };
  const logged = converted.reps || converted.durationSeconds || converted.distanceFeet
    || (exercise.uses_weight && set.weightLbs);
  return logged ? converted : null;
}

export interface ConvertedExercise {
  exercise: CatalogExercise;
  notes: string | null;
  sets: ConvertedSet[];
}

export function convertWorkout(
  workout: HevyWorkout,
  resolve: (hevyTitle: string) => CatalogExercise | null
): ConvertedExercise[] {
  const exercises: ConvertedExercise[] = [];
  for (const hevyExercise of workout.exercises) {
    const exercise = resolve(hevyExercise.title);
    if (!exercise) continue;
    const sets = hevyExercise.sets
      .map(set => convertSet(set, exercise))
      .filter((set): set is ConvertedSet => set !== null);
    if (sets.length > 0) exercises.push({ exercise, notes: hevyExercise.notes, sets });
  }
  return exercises;
}

// ─── Payloads ───────────────────────────────────────────────────────────────

export interface RoutinePayload {
  name: string;
  exercises: Record<string, unknown>[];
}

/** A routine from the title's latest workout, the way the app saves one */
export function routinePayload(title: string, exercises: ConvertedExercise[]): RoutinePayload {
  const rows: Record<string, unknown>[] = [];
  exercises.forEach((entry, exerciseIndex) => {
    const instanceId = crypto.randomUUID();
    entry.sets.forEach((set, setIndex) => {
      rows.push({
        exercise_id: entry.exercise.id,
        instance_id: instanceId,
        sets: 1,
        reps: set.reps || 0,
        weight_lbs: set.weight || 0,
        duration_seconds: set.durationSeconds,
        distance_feet: set.distanceFeet,
        order_in_routine: exerciseIndex + 1,
        set_number: setIndex + 1,
        set_type: set.setType,
      });
    });
  });
  return { name: title, exercises: rows };
}

export interface RoutineLink {
  id: string;
  instances: Record<string, string>;
}

export interface HistorySession {
  exerciseId: string;
  time: number;
  sets: { weight: number | null; reps: number | null }[];
}

export interface WorkoutPayload {
  import_key: string;
  date: string;
  start_time: string;
  end_time: string | null;
  duration_seconds: number | null;
  notes: string | null;
  created_from: string | null;
  exercises: {
    exercise_id: string;
    order: number;
    notes: string | null;
    instance_id: string;
    sets: Record<string, unknown>[];
  }[];
}

/**
 * The workouts to send, with PR badges worked out against `history` (the
 * user's sets already in UltraSync for these exercises).
 */
export function workoutPayloads(
  placed: PlacedWorkout[],
  resolve: (hevyTitle: string) => CatalogExercise | null,
  routines: Map<string, RoutineLink>,
  history: HistorySession[],
  bodyweight: number | null
): WorkoutPayload[] {
  const converted = placed.map(p => ({ placed: p, exercises: convertWorkout(p.workout, resolve) }));

  // PR badges, oldest first across imported and existing sessions
  const prExercises = new Map<string, PRExercise>();
  const sessions: PRSession[] = history.map(h => ({ ...h, wantFlags: false }));
  const importedSessions = converted.map(({ placed: p, exercises }) =>
    exercises.map(entry => {
      prExercises.set(entry.exercise.id, {
        usesWeight: entry.exercise.uses_weight,
        usesReps: entry.exercise.uses_reps,
        bodyweightMode: entry.exercise.bodyweight_mode,
      });
      const session: PRSession = {
        exerciseId: entry.exercise.id,
        time: Date.parse(p.start),
        sets: entry.sets.map(s => ({ weight: s.weight, reps: s.reps })),
        wantFlags: true,
      };
      sessions.push(session);
      return session;
    })
  );
  assignPRFlags(sessions, prExercises, bodyweight);

  return converted
    .filter(({ exercises }) => exercises.length > 0)
    .map(({ placed: p, exercises }) => {
      const routine = routines.get(p.workout.title) ?? null;
      const flagsFor = importedSessions[converted.findIndex(c => c.placed === p)];
      const createdAt = p.end ?? p.start;
      const duration = p.end ? Math.max(0, Math.round((Date.parse(p.end) - Date.parse(p.start)) / 1000)) : null;
      const usedInstances = new Set<string>();

      return {
        import_key: p.importKey,
        date: localDate(p.workout.start),
        start_time: p.start,
        end_time: p.end,
        duration_seconds: duration,
        notes: p.workout.description,
        created_from: routine?.id ?? null,
        exercises: exercises.map((entry, index) => {
          // Shares its routine exercise's instance id, as a workout started
          // from the routine would; the same exercise twice gets a new one
          let instanceId = routine?.instances[entry.exercise.id];
          if (!instanceId || usedInstances.has(instanceId)) instanceId = crypto.randomUUID();
          usedInstances.add(instanceId);
          const flags = flagsFor[index].flags ?? [];

          return {
            exercise_id: entry.exercise.id,
            order: index + 1,
            notes: entry.notes,
            instance_id: instanceId,
            sets: entry.sets.map((set, setIndex) => {
              const f = flags[setIndex] ?? { is1RM: false, isVolume: false, isRep: false };
              return {
                set_number: setIndex + 1,
                reps: set.reps,
                weight_lbs: set.weight,
                duration_seconds: set.durationSeconds,
                distance_feet: set.distanceFeet,
                set_type: set.setType,
                rpe: set.rpe,
                is_record: f.is1RM || f.isVolume || f.isRep,
                is_1rm_pr: f.is1RM,
                is_volume_pr: f.isVolume,
                is_rep_pr: f.isRep,
                created_at: createdAt,
              };
            }),
          };
        }),
      };
    });
}
