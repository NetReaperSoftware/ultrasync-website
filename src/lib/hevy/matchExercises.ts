// Suggesting the UltraSync exercise for each Hevy exercise name.
//
// Hevy names put equipment in brackets ("Bench Press (Barbell)") where
// UltraSync puts it first ("Barbell Bench Press") or only in the equipment
// field, and the two spell some words differently (Triceps/Tricep, Single
// Arm/One Arm). So names are compared as sets of words, with equipment words
// set aside and compared against the exercise's equipment.
//
// Names the word comparison gets wrong, or can't reach, are in HEVY_NAMES.

export interface CatalogExercise {
  id: string;
  name: string;
  equipment: string | null;
  name_aliases: string[] | null;
  is_global: boolean;
  uses_weight: boolean;
  uses_reps: boolean;
  uses_duration: boolean;
  uses_distance: boolean;
  bodyweight_mode: 'assisted' | 'weighted' | null;
  muscle_group_primary: string | null;
}

export type MatchConfidence = 'exact' | 'likely' | 'possible';

export interface ExerciseSuggestion {
  exercise: CatalogExercise;
  confidence: MatchConfidence;
}

// Hevy name → UltraSync name, where words alone don't find it
const HEVY_NAMES: Record<string, string> = {
  'Ab Wheel': 'Ab Wheel Rollout',
  'Arnold Press (Dumbbell)': 'Arnold Press',
  'Back Extension (Weighted Hyperextension)': 'Hyperextension',
  'Back Extension (Hyperextension)': 'Hyperextension',
  'Back Extension (Machine)': 'Machine Back Extension',
  'Bayesian Cable Curl': 'Baynesian Cable Curl',
  'Bench Press (Barbell)': 'Barbell Bench Press',
  'Bench Press (Dumbbell)': 'Dumbbell Bench Press',
  'Bench Press (Smith Machine)': 'Smith Machine Bench Press',
  'Bench Press - Close Grip (Barbell)': 'Close Grip Bench Press',
  'Bench Press - Wide Grip (Barbell)': 'Wide Grip Bench Press',
  'Bent Over Row (Barbell)': 'Barbell Row',
  'Bent Over Row (Dumbbell)': 'Bent Over Dumbbell Row',
  'Bicep Curl (Barbell)': 'Barbell Curl',
  'Bicep Curl (Cable)': 'Cable Bicep Curl',
  'Bicep Curl (Dumbbell)': 'Dumbbell Curl',
  'Bicep Curl (Machine)': 'Machine Bicep Curl',
  'Butterfly (Pec Deck)': 'Machine Chest Fly',
  'Cable Crossovers Ladder': 'Cable Crossover Ladder',
  'Cable Fly Crossovers': 'Cable Crossover',
  'Calf Press (Machine)': 'Machine Calf Press',
  'Chest Dip': 'Tricep Dip',
  'Chest Dip (Weighted)': 'Tricep Dip',
  'Chest Dip (Assisted)': 'Assisted Dip',
  'Farmers Walk': "Farmer's Carry",
  'Pec Deck (Machine)': 'Machine Chest Fly',
  'Chest Fly (Dumbbell)': 'Dumbbell Fly',
  'Chest Fly (Machine)': 'Machine Chest Fly',
  'Chest Press (Machine)': 'Chest Press',
  'Chest Supported Incline Row (Dumbbell)': 'Chest Supported Dumbbell Row',
  'Concentration Curl': 'Dumbbell Concentration Curl',
  'Cross Body Cable Y Raise': 'Cable Y Raise',
  'Crunch (Machine)': 'Machine Seated Crunch',
  'Deadlift (Barbell)': 'Deadlift',
  'Decline Bench Press (Barbell)': 'Decline Bench Press',
  'Decline Crunch (Weighted)': 'Decline Crunch',
  'Dumbbell Row': 'Dumbbell Row',
  'EZ Bar Biceps Curl': 'EZ Bar Curl',
  'Face Pull': 'Face Pull',
  'Front Raise (Dumbbell)': 'Dumbbell Front Raise',
  'Front Squat': 'Front Squat',
  'Goblet Squat': 'Goblet Squat',
  'Hack Squat (Machine)': 'Hack Squat',
  'Hammer Curl (Cable)': 'Cable Hammer Curl',
  'Hammer Curl (Dumbbell)': 'Hammer Curl',
  'Hip Abduction (Machine)': 'Hip Abduction',
  'Hip Adduction (Machine)': 'Hip Adduction',
  'Hip Thrust (Barbell)': 'Barbell Hip Thrust',
  'Hip Thrust (Machine)': 'Machine Hip Thrust',
  'Incline Bench Press (Barbell)': 'Incline Bench Press',
  'Incline Bench Press (Dumbbell)': 'Incline Dumbbell Press',
  'Incline Bench Press (Smith Machine)': 'Smith Machine Incline Bench Press',
  'Iso-Lateral Chest Press (Machine)': 'Iso-Lateral Chest Press',
  'Iso-Lateral Row (Machine)': 'Iso-Lateral Row',
  'JM Press (Barbell)': 'JM Press',
  'Lat Pulldown (Cable)': 'Lat Pulldown',
  'Lat Pulldown (Machine)': 'Lat Pulldown',
  'Lat Pulldown - Close Grip (Cable)': 'Close Grip Lat Pulldown',
  'Lateral Raise (Cable)': 'Cable Lateral Raise',
  'Lateral Raise (Dumbbell)': 'Dumbbell Lateral Raise',
  'Lateral Raise (Machine)': 'Machine Lateral Raise',
  'Leg Extension (Machine)': 'Leg Extension',
  'Leg Press (Machine)': 'Leg Press',
  'Leg Press Horizontal (Machine)': 'Horizontal Leg Press',
  'Leg Raise Parallel Bars': "Captain's Chair Leg Raise",
  'Low Cable Fly Crossovers': 'Low to High Cable Fly',
  'Lying Leg Curl (Machine)': 'Lying Leg Curl',
  'Overhead Curl (Cable)': 'Overhead Cable Curl',
  'Overhead Press (Barbell)': 'Overhead Press',
  'Overhead Press (Dumbbell)': 'Dumbbell Shoulder Press',
  'Paused Bench Press': 'Paused Barbell Bench Press',
  'Pendulum Squat (Machine)': 'Pendulum Squat',
  'Plank': 'Plank',
  'Preacher Curl (Barbell)': 'Barbell Preacher Curl',
  'Preacher Curl (Dumbbell)': 'One Arm Dumbbell Preacher Curl',
  'Preacher Curl (Machine)': 'Machine Bicep Curl',
  'Pull Up': 'Pull Up',
  'Pull Up (Assisted)': 'Assisted Pull Up',
  'Pull Up (Weighted)': 'Pull Up',
  'Chin Up (Assisted)': 'Assisted Chin Up',
  'Chin Up (Weighted)': 'Chin Up',
  'Triceps Dip (Assisted)': 'Assisted Dip',
  'Rear Delt Reverse Fly (Cable)': 'Cable Reverse Fly',
  'Rear Delt Reverse Fly (Dumbbell)': 'Dumbbell Rear Delt Fly',
  'Rear Delt Reverse Fly (Machine)': 'Machine Reverse Fly',
  'Reverse Curl (Barbell)': 'Reverse Barbell Curl',
  'Reverse Curl (Dumbbell)': 'Dumbbell Reverse Curl',
  'Romanian Deadlift (Barbell)': 'Romanian Deadlift',
  'Romanian Deadlift (Dumbbell)': 'Dumbbell Romanian Deadlift',
  'Rope Straight Arm Pulldown': 'Straight Arm Pulldown',
  'Seated Cable Row - V Grip (Cable)': 'Seated Cable Row',
  'Seated Chest Flys (Cable)': 'Cable Fly',
  'Seated Incline Curl (Dumbbell)': 'Incline Dumbbell Curl',
  'Seated Leg Curl (Machine)': 'Seated Leg Curl',
  'Seated Palms Up Wrist Curl': 'Dumbbell Wrist Curl',
  'Seated Row (Machine)': 'Machine Row',
  'Seated Row Machine': 'Machine Row',
  'Seated Shoulder Press (Machine)': 'Machine Shoulder Press',
  'Seated Wrist Extension (Barbell)': 'Reverse Wrist Curl',
  'Shoulder Press (Dumbbell)': 'Dumbbell Shoulder Press',
  'Shoulder Press (Machine Plates)': 'Machine Shoulder Press',
  'Shoulder Press (Machine)': 'Machine Shoulder Press',
  'Shrug (Barbell)': 'Barbell Shrug',
  'Shrug (Cable)': 'Cable Shrug',
  'Shrug (Dumbbell)': 'Dumbbell Shrug',
  'Shrug (Machine)': 'Machine Shrug',
  'Shrug (Smith Machine)': 'Smith Machine Shrug',
  'Side Bend (Dumbbell)': 'Dumbbell Side Bend',
  'Single Arm Lat Pulldown': 'One Arm Lat Pulldown',
  'Single Arm Lateral Raise (Cable)': 'Cable Lateral Raise',
  'Single Leg Standing Calf Raise (Dumbbell)': 'Dumbbell Calf Raise',
  'Sissy Squat (Weighted)': 'Sissy Squat',
  'Skullcrusher (Barbell)': 'Lying Tricep Extension',
  'Skullcrusher (Dumbbell)': 'Lying Dumbbell Tricep Extension',
  'Squat (Barbell)': 'Barbell Squat',
  'Squat (Smith Machine)': 'Smith Machine Squat',
  'Squat (Dumbbell)': 'Dumbbell Squat',
  'Standing Calf Raise (Dumbbell)': 'Dumbbell Calf Raise',
  'Standing Calf Raise (Machine)': 'Machine Calf Raise',
  'Standing Calf Raise (Smith)': 'Smith Machine Calf Raise',
  'Standing Military Press (Barbell)': 'Military Press',
  'Seated Calf Raise': 'Seated Calf Raise',
  'T Bar Row': 'T Bar Row',
  'Triceps Dip': 'Tricep Dip',
  'Triceps Dip (Weighted)': 'Tricep Dip',
  'Triceps Extension (Cable)': 'Cable Overhead Tricep Extension',
  'Triceps Extension (Dumbbell)': 'Dumbbell Tricep Extension',
  'Triceps Extension (Machine)': 'Machine Tricep Extension',
  'Triceps Kickback (Cable)': 'Cable Tricep Kickback',
  'Triceps Kickback (Dumbbell)': 'Dumbbell Tricep Kickback',
  'Triceps Pressdown': 'Tricep Pushdown',
  'Triceps Pushdown': 'Tricep Pushdown',
  'Triceps Rope Pushdown': 'Tricep Rope Pushdown',
  'Wide Grip Lat Pulldown': 'Wide Grip Lat Pulldown',
  '1 Arm Cable Rear Delt Fly': 'One Arm Cable Rear Delt Fly',
  '1 Arm Lat Pull-In': 'One Arm Lat Pull Around',
  'Cross Body Lat pull-Around': 'Cross Body Lat Pull Around',
  'Defecit Pendlay Row': 'Deficit Pendlay Row',
  'Neutral Grip Lat Pulldown': 'Neutral Grip Lat Pulldown',
};

// Words for the same thing spelled two ways
const SYNONYMS: Record<string, string> = {
  triceps: 'tricep',
  biceps: 'bicep',
  flys: 'fly',
  flyes: 'fly',
  flies: 'fly',
  crossovers: 'crossover',
  raises: 'raise',
  curls: 'curl',
  rows: 'row',
  pressdown: 'pushdown',
  single: 'one',
  '1': 'one',
  pullup: 'pull',
  pullups: 'pull',
  chinup: 'chin',
  situp: 'sit',
  pushup: 'push',
  db: 'dumbbell',
  bb: 'barbell',
  kb: 'kettlebell',
  plates: 'plate',
  defecit: 'deficit',
  bayesian: 'baynesian',
};

// Equipment words, set aside from the movement and compared on their own
const EQUIPMENT_WORDS: Record<string, string> = {
  barbell: 'barbell',
  dumbbell: 'dumbbell',
  cable: 'cable',
  machine: 'machine',
  smith: 'smith',
  ez: 'ez',
  plate: 'plate',
  band: 'band',
  kettlebell: 'kettlebell',
  bodyweight: 'bodyweight',
};

// UltraSync's equipment field → the same equipment words
const CATALOG_EQUIPMENT: Record<string, string[]> = {
  Barbell: ['barbell'],
  Dumbbell: ['dumbbell'],
  'Cable Machine': ['cable'],
  'Planet Fitness Adjustable Pulley': ['cable'],
  Machine: ['machine'],
  'Smith Machine': ['smith'],
  'EZ Bar': ['ez', 'barbell'],
  'Weight Plate': ['plate'],
  None: ['bodyweight'],
};

// Filler that doesn't distinguish exercises
const IGNORED_WORDS = new Set(['the', 'with', 'and', 'bar', 'up', 'exercise']);

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/pull-?ups?\b/g, 'pull up')
    .replace(/chin-?ups?\b/g, 'chin up')
    .replace(/push-?ups?\b/g, 'push up')
    .replace(/sit-?ups?\b/g, 'sit up')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(word => SYNONYMS[word] ?? word);
}

interface NameShape {
  movement: Set<string>;
  equipment: Set<string>;
  assisted: boolean;
  weighted: boolean;
}

function shapeOf(name: string, equipmentField?: string | null): NameShape {
  const movement = new Set<string>();
  const equipment = new Set<string>();
  let assisted = false;
  let weighted = false;
  for (const word of words(name)) {
    if (word === 'assisted') assisted = true;
    else if (word === 'weighted') weighted = true;
    else if (EQUIPMENT_WORDS[word]) equipment.add(EQUIPMENT_WORDS[word]);
    else if (!IGNORED_WORDS.has(word)) movement.add(word);
  }
  for (const field of (equipmentField ?? '').split(',').map(e => e.trim())) {
    CATALOG_EQUIPMENT[field]?.forEach(e => equipment.add(e));
  }
  // A Smith machine is its own equipment, not a machine
  if (equipment.has('smith')) equipment.delete('machine');
  return { movement, equipment, assisted, weighted };
}

const normalized = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

// How alike two names are (about 0-1.2), and whether they're the same words
// with no conflicting equipment
function score(hevy: NameShape, candidate: NameShape, exercise: CatalogExercise): { total: number; same: boolean } {
  if (hevy.movement.size === 0 || candidate.movement.size === 0) return { total: 0, same: false };
  let shared = 0;
  hevy.movement.forEach(word => { if (candidate.movement.has(word)) shared++; });
  const sameWords = shared === hevy.movement.size && shared === candidate.movement.size;
  let total = (2 * shared) / (hevy.movement.size + candidate.movement.size);
  let equipmentConflict = false;
  // A variation of the exercise ("21s Bicep Curl" of "Bicep Curl") is worth checking
  if (shared === candidate.movement.size) total = Math.max(total, 0.75);

  if (hevy.equipment.size > 0 && candidate.equipment.size > 0) {
    const overlap = [...hevy.equipment].some(e => candidate.equipment.has(e));
    total += overlap ? 0.15 : -0.5;
    equipmentConflict = !overlap;
    // Prefer "Upright Row" (Barbell) to "EZ Bar Upright Row" for a barbell
    candidate.equipment.forEach(e => { if (!hevy.equipment.has(e)) total -= 0.05; });
  }
  if (hevy.assisted) total += exercise.bodyweight_mode === 'assisted' ? 0.2 : -0.4;
  else if (exercise.bodyweight_mode === 'assisted') total -= 0.4;
  return { total, same: sameWords && !equipmentConflict && total >= 1 };
}

/**
 * The best UltraSync exercise for a Hevy name, or null when nothing is close.
 * The user's own exercises win a tie with a global one of the same name.
 */
export function suggestExercise(hevyName: string, catalog: CatalogExercise[]): ExerciseSuggestion | null {
  const target = normalized(hevyName);
  const ordered = [...catalog].sort((a, b) => Number(a.is_global) - Number(b.is_global));

  // Same name (or alias) as an exercise, including one the user made
  const exact = ordered.find(e =>
    normalized(e.name) === target || (e.name_aliases ?? []).some(alias => normalized(alias) === target)
  );
  if (exact) return { exercise: exact, confidence: 'exact' };

  const known = HEVY_NAMES[hevyName.trim()];
  if (known) {
    const exercise = ordered.find(e => normalized(e.name) === normalized(known));
    if (exercise) return { exercise, confidence: 'exact' };
  }

  // "Bench Press - Close Grip" reads as "Close Grip Bench Press"
  const reordered = hevyName.replace(/^(.*?) - ([^(]*)/, '$2 $1');
  const hevy = shapeOf(reordered);
  let best: { exercise: CatalogExercise; score: number; same: boolean } | null = null;
  for (const exercise of ordered) {
    const names = [exercise.name, ...(exercise.name_aliases ?? [])];
    for (const name of names) {
      const value = score(hevy, shapeOf(name, exercise.equipment), exercise);
      if (!best || value.total > best.score) best = { exercise, score: value.total, same: value.same };
    }
  }

  if (!best || best.score < 0.7) return null;
  return { exercise: best.exercise, confidence: best.same ? 'likely' : 'possible' };
}

/** Equipment for a new custom exercise, from the Hevy name's brackets */
export function guessEquipment(hevyName: string): string {
  const shape = shapeOf(hevyName);
  if (shape.equipment.has('smith')) return 'Smith Machine';
  if (shape.equipment.has('ez')) return 'EZ Bar';
  if (shape.equipment.has('barbell')) return 'Barbell';
  if (shape.equipment.has('dumbbell')) return 'Dumbbell';
  if (shape.equipment.has('cable')) return 'Cable Machine';
  if (shape.equipment.has('machine')) return 'Machine';
  if (shape.equipment.has('plate')) return 'Weight Plate';
  if (shape.equipment.has('band')) return 'Accessories';
  return 'None';
}
