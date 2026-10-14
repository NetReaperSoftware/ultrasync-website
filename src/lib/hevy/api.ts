// The Hevy import's reads and writes, all as the signed-in user (RLS).

import { supabase } from '../supabase';
import type { CatalogExercise } from './matchExercises';
import type { ExistingWorkout, HistorySession, RoutineLink, RoutinePayload, WorkoutPayload } from './buildImport';

const PAGE = 1000;

const EXERCISE_COLUMNS =
  'id, name, equipment, name_aliases, is_global, uses_weight, uses_reps, uses_duration, uses_distance, bodyweight_mode, muscle_group_primary';

// Every row of a query, a page at a time (PostgREST caps each response)
async function allRows<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await page(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}

/** Global exercises and the user's own */
export async function loadCatalog(userId: string): Promise<CatalogExercise[]> {
  const [global, own] = await Promise.all([
    allRows<CatalogExercise>((from, to) =>
      supabase.schema('fitness').from('exercises').select(EXERCISE_COLUMNS)
        .eq('is_global', true).order('id').range(from, to)),
    allRows<CatalogExercise>((from, to) =>
      supabase.schema('fitness').from('exercises').select(EXERCISE_COLUMNS)
        .eq('created_by', userId).eq('is_global', false).order('id').range(from, to)),
  ]);
  return [...own, ...global];
}

/** The profile bodyweight in lb, for Bodyweight + Weight volume (as the app uses) */
export async function loadBodyweight(): Promise<number | null> {
  const { data, error } = await supabase.schema('social').rpc('get_my_account');
  if (error) return null;
  const weight = Number(data?.fitness_profile?.weight_lbs);
  return weight > 0 ? weight : null;
}

/** The user's workouts around the export's dates, to find ones already there */
export async function loadExistingWorkouts(userId: string, fromIso: string, toIso: string): Promise<ExistingWorkout[]> {
  return allRows<ExistingWorkout>((from, to) =>
    supabase.schema('fitness').from('workouts')
      .select('start_time, end_time, source, import_key')
      .eq('user_id', userId)
      .gte('start_time', fromIso)
      .lte('start_time', toIso)
      .order('start_time')
      .range(from, to));
}

interface HistoryRow {
  exercise_id: string;
  workouts: { start_time: string };
  exercise_sets: { weight_lbs: number | null; reps: number | null }[];
}

/** The user's finished sets for these exercises, for PR badges */
export async function loadHistory(userId: string, exerciseIds: string[]): Promise<HistorySession[]> {
  const sessions: HistorySession[] = [];
  // Keeps each request's URL short
  for (let i = 0; i < exerciseIds.length; i += 50) {
    const ids = exerciseIds.slice(i, i + 50);
    const rows = await allRows<HistoryRow>((from, to) =>
      supabase.schema('fitness').from('workout_exercises')
        .select('exercise_id, workouts!inner(start_time), exercise_sets(weight_lbs, reps)')
        .in('exercise_id', ids)
        // Only the user's own: friends' workouts can be readable too
        .eq('workouts.user_id', userId)
        .not('workouts.end_time', 'is', null)
        .order('id')
        .range(from, to) as unknown as PromiseLike<{ data: HistoryRow[] | null; error: { message: string } | null }>);
    for (const row of rows) {
      sessions.push({
        exerciseId: row.exercise_id,
        time: Date.parse(row.workouts.start_time),
        sets: row.exercise_sets.map(s => ({ weight: s.weight_lbs, reps: s.reps })),
      });
    }
  }
  return sessions;
}

export interface NewExercise {
  name: string;
  muscleGroup: string;
  equipment: string;
  usesWeight: boolean;
  usesReps: boolean;
  usesDuration: boolean;
  usesDistance: boolean;
  bodyweightMode: 'assisted' | 'weighted' | null;
}

// FitSync utils/exerciseCategoryHelper.ts
const LOWER_BODY = ['Glutes', 'Quadriceps', 'Hamstrings', 'Calves', 'Tibialis', 'Adductors', 'Abductors', 'Hip Flexors'];
const CORE = ['Core', 'Abdominals', 'Obliques', 'Lower Back'];

const categoryFor = (muscle: string) =>
  LOWER_BODY.includes(muscle) ? 'Lower Body' : CORE.includes(muscle) ? 'Core' : 'Upper Body';

/** A custom exercise, as the app's Create Exercise screen saves one */
export async function createCustomExercise(userId: string, input: NewExercise): Promise<CatalogExercise> {
  const { data, error } = await supabase.schema('fitness').from('exercises')
    .insert({
      name: input.name.trim(),
      category: categoryFor(input.muscleGroup),
      muscle_group_primary: input.muscleGroup,
      muscle_group_secondary: null,
      equipment: input.equipment,
      is_global: false,
      created_by: userId,
      uses_weight: input.usesWeight,
      uses_reps: input.usesReps,
      uses_duration: input.usesDuration,
      uses_distance: input.usesDistance,
      bodyweight_mode: input.usesWeight ? input.bodyweightMode : null,
      description: 'Imported from Hevy',
      difficulty: 'intermediate',
    })
    .select(EXERCISE_COLUMNS)
    .single();
  if (error) {
    throw new Error(error.code === '23505'
      ? `You already have an exercise named "${input.name.trim()}". Pick it instead of creating a new one.`
      : error.message);
  }
  return data as CatalogExercise;
}

export async function importRoutines(routines: RoutinePayload[]): Promise<Map<string, RoutineLink>> {
  if (routines.length === 0) return new Map();
  const { data, error } = await supabase.schema('fitness').rpc('import_hevy_routines', { p_routines: routines });
  if (error) throw new Error(error.message);
  return new Map(Object.entries((data ?? {}) as Record<string, RoutineLink>));
}

export interface WorkoutBatchResult {
  imported: string[];
  already_imported: string[];
  overlapping: string[];
}

export async function importWorkouts(workouts: WorkoutPayload[]): Promise<WorkoutBatchResult> {
  const { data, error } = await supabase.schema('fitness').rpc('import_hevy_workouts', { p_workouts: workouts });
  if (error) throw new Error(error.message);
  return data as WorkoutBatchResult;
}
