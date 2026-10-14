// PR badges for imported sets, by the app's rules (FitSync
// hooks/usePRCalculations.ts computeExercisePRFlags): gold for the workout's
// heaviest set if it beats the heaviest ever, silver for its biggest-volume set
// if it beats the best volume ever, bronze for its most reps at a weight if
// they beat the most ever done at that weight. A first time is never a PR.
//
// The app compares against everything logged before; here "before" is every
// earlier session, imported or already in UltraSync, walked oldest first.

export interface PRExercise {
  usesWeight: boolean;
  usesReps: boolean;
  bodyweightMode: 'assisted' | 'weighted' | null;
}

export interface PRSet {
  weight: number | null;
  reps: number | null;
}

export interface PRFlags {
  is1RM: boolean;
  isVolume: boolean;
  isRep: boolean;
}

interface Record {
  maxWeight: number | null; // null: no weight ever logged
  maxVolume: number;
  repRecords: Map<string, number>;
}

/** One exercise's sets in one session; flags are computed only when wanted */
export interface PRSession {
  exerciseId: string;
  time: number; // ms since epoch
  sets: PRSet[];
  // Imported sessions get flags; existing UltraSync ones only set the record
  wantFlags: boolean;
  flags?: PRFlags[];
}

const weightKey = (weight: number | null) => String(Math.round((weight || 0) * 100) / 100);

function effectiveLoad(weight: number | null, bodyweight: number | null): number | null {
  if (!bodyweight || bodyweight <= 0) return null;
  return Math.max(bodyweight + (weight || 0), 0);
}

function setVolume(exercise: PRExercise, set: PRSet, bodyweight: number | null): number {
  if (exercise.bodyweightMode) {
    const load = effectiveLoad(set.weight, bodyweight);
    return load !== null && set.reps ? load * set.reps : 0;
  }
  if (exercise.usesWeight && set.weight && set.reps) return set.weight * set.reps;
  if (exercise.usesReps && set.reps && !exercise.usesWeight) return set.reps * 0.8 * (bodyweight || 0);
  return 0;
}

// The volume the app's record holds (get_exercise_pr_data: weight × reps;
// get_bodyweight_load_records for Bodyweight + Weight). Reps-only exercises
// have no volume record, so never a silver medal - the same as in the app.
function recordVolume(exercise: PRExercise, set: PRSet, bodyweight: number | null): number {
  if (exercise.bodyweightMode) return setVolume(exercise, set, bodyweight);
  return set.weight !== null && set.reps !== null ? set.weight * set.reps : 0;
}

function computeFlags(exercise: PRExercise, sets: PRSet[], record: Record | undefined, bodyweight: number | null): PRFlags[] {
  let best1RM: number | null = null;
  let bestVolume: number | null = null;
  const bestRepsByWeight = new Map<string, number>();

  sets.forEach((set, index) => {
    const hasWeight = exercise.bodyweightMode ? set.weight !== null : !!(exercise.usesWeight && set.weight);
    if (hasWeight && set.weight !== null) {
      const leader = best1RM === null ? null : sets[best1RM];
      const heavier = !leader || set.weight > (leader.weight ?? 0);
      const sameWeightMoreReps = !!leader && set.weight === (leader.weight ?? 0) && (set.reps || 0) > (leader.reps || 0);
      if (heavier || sameWeightMoreReps) best1RM = index;
    }
    if (exercise.usesReps && set.reps) {
      const key = weightKey(set.weight);
      const leader = bestRepsByWeight.get(key);
      if (leader === undefined || set.reps > (sets[leader].reps || 0)) bestRepsByWeight.set(key, index);
    }
    const volume = setVolume(exercise, set, bodyweight);
    if (volume > 0) {
      const leaderVolume = bestVolume === null ? 0 : setVolume(exercise, sets[bestVolume], bodyweight);
      if (volume > leaderVolume) bestVolume = index;
    }
  });

  const beatsWeight = (set: PRSet) => {
    if (!record || record.maxWeight === null || set.weight === null) return false;
    if (exercise.bodyweightMode) return set.weight > record.maxWeight;
    if (!exercise.usesWeight || !set.weight || record.maxWeight === 0) return false;
    return set.weight > record.maxWeight;
  };
  const beatsVolume = (set: PRSet) => {
    if (!record || record.maxVolume === 0) return false;
    const volume = setVolume(exercise, set, bodyweight);
    return volume > 0 && volume > record.maxVolume;
  };
  const beatsReps = (set: PRSet) => {
    if (!exercise.usesReps || !set.reps) return false;
    const previous = record?.repRecords.get(weightKey(set.weight));
    return previous !== undefined && set.reps > previous;
  };

  return sets.map((set, index) => ({
    is1RM: index === best1RM && beatsWeight(set),
    isVolume: index === bestVolume && beatsVolume(set),
    isRep: bestRepsByWeight.get(weightKey(set.weight)) === index && beatsReps(set),
  }));
}

function addToRecord(record: Record, exercise: PRExercise, sets: PRSet[], bodyweight: number | null) {
  for (const set of sets) {
    if (set.weight !== null) {
      record.maxWeight = record.maxWeight === null ? set.weight : Math.max(record.maxWeight, set.weight);
    }
    record.maxVolume = Math.max(record.maxVolume, recordVolume(exercise, set, bodyweight));
    if (set.reps !== null) {
      const key = weightKey(set.weight);
      record.repRecords.set(key, Math.max(record.repRecords.get(key) ?? 0, set.reps));
    }
  }
}

/** Fills in `flags` on every session with wantFlags */
export function assignPRFlags(
  sessions: PRSession[],
  exercises: Map<string, PRExercise>,
  bodyweight: number | null
): void {
  const records = new Map<string, Record>();
  const ordered = [...sessions].sort((a, b) => a.time - b.time);

  // Sessions at the same time are one workout: flags against what came before
  // it, then all of it goes into the record
  let i = 0;
  while (i < ordered.length) {
    let j = i;
    while (j < ordered.length && ordered[j].time === ordered[i].time) j++;
    const group = ordered.slice(i, j);
    for (const session of group) {
      const exercise = exercises.get(session.exerciseId);
      if (!exercise) continue;
      if (session.wantFlags) {
        session.flags = computeFlags(exercise, session.sets, records.get(session.exerciseId), bodyweight);
      }
    }
    for (const session of group) {
      const exercise = exercises.get(session.exerciseId);
      if (!exercise) continue;
      let record = records.get(session.exerciseId);
      if (!record) {
        record = { maxWeight: null, maxVolume: 0, repRecords: new Map() };
        records.set(session.exerciseId, record);
      }
      addToRecord(record, exercise, session.sets, bodyweight);
    }
    i = j;
  }
}
