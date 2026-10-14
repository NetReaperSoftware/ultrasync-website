import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AlertTriangle, Check, ChevronDown, FileUp, Loader2, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useSession } from '../lib/useSession';
import { HevyCsvError, parseHevyCsv, localMinutes, type HevyExport } from '../lib/hevy/parseHevyCsv';
import { guessEquipment, suggestExercise, type CatalogExercise, type MatchConfidence } from '../lib/hevy/matchExercises';
import {
  convertWorkout, droppedFields, isAutomaticTitle, placeWorkouts, routinePayload, summarizeExercises,
  summarizeTitles, workoutPayloads, workoutStatus,
  type ExerciseUsage, type ExistingWorkout, type PlacedWorkout, type RoutinePayload,
} from '../lib/hevy/buildImport';
import {
  createCustomExercise, importRoutines, importWorkouts, loadBodyweight, loadCatalog,
  loadExistingWorkouts, loadHistory,
} from '../lib/hevy/api';

// FitSync types/MuscleMapping.ts MuscleGroup and constants/equipmentOptions.ts
const MUSCLE_GROUPS = [
  'Chest', 'Upper Chest', 'Lower Chest', 'Shoulders', 'Triceps', 'Biceps', 'Forearms', 'Neck',
  'Back', 'Upper Back', 'Lats', 'Traps', 'Rear Delts', 'Lower Back',
  'Core', 'Abdominals', 'Obliques',
  'Glutes', 'Quadriceps', 'Hamstrings', 'Calves', 'Tibialis', 'Adductors', 'Abductors', 'Hip Flexors',
];
const EQUIPMENT = [
  'None', 'Barbell', 'Dumbbell', 'EZ Bar', 'Cable Machine', 'Machine', 'Smith Machine',
  'Weight Plate', 'Bench', 'Pull Up Bar', 'Gymnastic Rings', 'Accessories', 'Other',
];

const BATCH_SIZE = 20;

type Decision =
  | { kind: 'map'; exerciseId: string; confidence: MatchConfidence | 'chosen' }
  | { kind: 'create'; name: string; muscleGroup: string; equipment: string }
  | { kind: 'skip' };

interface Loaded {
  fileName: string;
  data: HevyExport;
  catalog: CatalogExercise[];
  bodyweight: number | null;
  existing: ExistingWorkout[];
  usage: ExerciseUsage[];
  // Kept from the last import attempt, so a retry starts from the same choices
  decisions?: Record<string, Decision>;
}

interface Outcome {
  imported: number;
  alreadyImported: number;
  overlapping: { title: string; start: string }[];
  routines: number;
  customExercises: number;
  prSets: number;
}

type Phase =
  | { step: 'upload'; error?: string }
  | { step: 'loading' }
  | { step: 'review'; loaded: Loaded }
  | { step: 'importing'; loaded: Loaded; message: string; done: number; total: number }
  | { step: 'done'; outcome: Outcome }
  | { step: 'failed'; loaded: Loaded; error: string; importedSoFar: number };

const browserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

function timeZones(current: string): string[] {
  const supported = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf;
  const zones = supported ? supported('timeZone') : [];
  return zones.includes(current) ? zones : [current, ...zones];
}

function formatDay(iso: string, timeZone: string): string {
  return new Date(iso).toLocaleDateString(undefined, { timeZone, month: 'short', day: 'numeric', year: 'numeric' });
}

function friendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/import_key|import_hevy/.test(message)) {
    return "The importer isn't set up on our side yet. Please try again later.";
  }
  return message;
}

function Card({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-teal-600">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

const selectClass =
  'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500';

// ─── Upload ──────────────────────────────────────────────────────────────────

function UploadStep({ error, onFile }: { error?: string; onFile: (file: File) => void }) {
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Import your Hevy workouts</h1>
      <p className="text-slate-600 mb-6">
        Bring your workout history with you. Your file is read in this browser; only the workouts you import are saved
        to your UltraSync account.
      </p>

      <ol className="space-y-2 text-sm text-slate-700 mb-6 list-decimal list-inside">
        <li>In Hevy, open <span className="font-medium">Profile → Settings → Export &amp; Import Data</span>.</li>
        <li>Choose <span className="font-medium">Export Workouts</span> and save the CSV file.</li>
        <li>Choose that file below.</li>
      </ol>

      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) onFile(file);
        }}
        className={`w-full border-2 border-dashed rounded-2xl p-10 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
          dragging ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-400 bg-slate-50'
        }`}
      >
        <FileUp className="w-8 h-8 text-teal-600 mx-auto mb-3" />
        <p className="font-semibold text-slate-900">Choose your Hevy export</p>
        <p className="text-sm text-slate-500">or drop the .csv file here</p>
      </button>
      <input
        ref={input}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
      />

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

// ─── Exercise matching ───────────────────────────────────────────────────────

const CONFIDENCE_LABEL: Record<MatchConfidence | 'chosen', string> = {
  exact: 'Matched',
  likely: 'Matched',
  possible: 'Check this',
  chosen: 'Your choice',
};

function measurementText(usage: ExerciseUsage): string {
  const parts = [
    usage.hasWeight && 'weight',
    usage.hasReps && 'reps',
    usage.hasDuration && 'time',
    usage.hasDistance && 'distance',
  ].filter(Boolean) as string[];
  if (parts.length === 0) return 'reps';
  return parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

function ExercisePicker({
  catalog, onPick, onCreate, onSkip,
}: {
  catalog: CatalogExercise[];
  onPick: (exercise: CatalogExercise) => void;
  onCreate: () => void;
  onSkip: () => void;
}) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    return catalog
      .filter(e => {
        const text = [e.name, e.equipment ?? '', ...(e.name_aliases ?? [])].join(' ').toLowerCase();
        return terms.every(t => text.includes(t));
      })
      .slice(0, 8);
  }, [catalog, query]);

  return (
    <div className="mt-3 rounded-xl border border-slate-200 p-3 bg-slate-50">
      <label className="relative block">
        <span className="sr-only">Search UltraSync exercises</span>
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search UltraSync exercises"
          className={`${selectClass} pl-9`}
        />
      </label>
      {results.length > 0 && (
        <ul className="mt-2 divide-y divide-slate-100 bg-white rounded-lg border border-slate-100">
          {results.map(e => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => onPick(e)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-teal-50 focus:outline-none focus-visible:bg-teal-50"
              >
                <span className="font-medium text-slate-900">{e.name}</span>
                <span className="text-slate-500"> · {e.is_global ? e.equipment : 'Your exercise'}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {query && results.length === 0 && (
        <p className="mt-2 text-sm text-slate-500">No UltraSync exercise matches "{query}".</p>
      )}
      <div className="flex flex-wrap gap-2 mt-3">
        <button type="button" onClick={onCreate} className="text-sm font-medium text-teal-700 hover:text-teal-800">
          Create it as a new exercise
        </button>
        <span className="text-slate-300">|</span>
        <button type="button" onClick={onSkip} className="text-sm font-medium text-slate-600 hover:text-slate-800">
          Don't import it
        </button>
      </div>
    </div>
  );
}

function ExerciseRow({
  usage, decision, catalog, byId, onChange,
}: {
  usage: ExerciseUsage;
  decision: Decision;
  catalog: CatalogExercise[];
  byId: Map<string, CatalogExercise>;
  onChange: (decision: Decision) => void;
}) {
  const [picking, setPicking] = useState(false);
  const matched = decision.kind === 'map' ? byId.get(decision.exerciseId) : undefined;
  const dropped = matched ? droppedFields(usage, matched) : [];
  const needsLook = decision.kind === 'create' && !decision.muscleGroup;

  return (
    <li className="py-4">
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
        <div className="sm:w-2/5 min-w-0">
          <p className="font-medium text-slate-900 break-words">{usage.title}</p>
          <p className="text-xs text-slate-500">
            {usage.setCount.toLocaleString()} {usage.setCount === 1 ? 'set' : 'sets'} in {usage.workoutCount}{' '}
            {usage.workoutCount === 1 ? 'workout' : 'workouts'}
          </p>
        </div>

        <div className="flex-1 min-w-0">
          {decision.kind === 'map' && matched && (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-slate-900 break-words">
                  <span className="font-medium">{matched.name}</span>
                  <span className="text-slate-500"> · {matched.is_global ? matched.equipment : 'Your exercise'}</span>
                </p>
                <p className={`text-xs font-medium ${decision.confidence === 'possible' ? 'text-amber-600' : 'text-teal-700'}`}>
                  {CONFIDENCE_LABEL[decision.confidence]}
                </p>
              </div>
              <button type="button" onClick={() => setPicking(p => !p)} className="text-sm font-medium text-teal-700 hover:text-teal-800 flex-shrink-0">
                Change
              </button>
            </div>
          )}

          {decision.kind === 'create' && (
            <div>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-slate-900">
                  New exercise, tracking {measurementText(usage)}
                </p>
                <button type="button" onClick={() => setPicking(p => !p)} className="text-sm font-medium text-teal-700 hover:text-teal-800 flex-shrink-0">
                  Change
                </button>
              </div>
              <div className="grid sm:grid-cols-3 gap-2 mt-2">
                <label className="block">
                  <span className="block text-xs text-slate-500 mb-1">Name</span>
                  <input
                    value={decision.name}
                    onChange={e => onChange({ ...decision, name: e.target.value })}
                    className={selectClass}
                  />
                </label>
                <label className="block">
                  <span className="block text-xs text-slate-500 mb-1">Main muscle</span>
                  <select
                    value={decision.muscleGroup}
                    onChange={e => onChange({ ...decision, muscleGroup: e.target.value })}
                    className={`${selectClass} ${needsLook ? 'border-amber-400' : ''}`}
                  >
                    <option value="">Choose…</option>
                    {MUSCLE_GROUPS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-xs text-slate-500 mb-1">Equipment</span>
                  <select
                    value={decision.equipment}
                    onChange={e => onChange({ ...decision, equipment: e.target.value })}
                    className={selectClass}
                  >
                    {EQUIPMENT.map(m => <option key={m}>{m}</option>)}
                  </select>
                </label>
              </div>
            </div>
          )}

          {decision.kind === 'skip' && (
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-slate-500">Won't be imported</p>
              <button type="button" onClick={() => setPicking(p => !p)} className="text-sm font-medium text-teal-700 hover:text-teal-800 flex-shrink-0">
                Change
              </button>
            </div>
          )}

          {dropped.length > 0 && (
            <p className="text-xs text-amber-700 mt-1">
              Hevy logged {dropped.join(' and ')} for this, which {matched?.name} doesn't track, so it won't be kept.
            </p>
          )}

          {picking && (
            <ExercisePicker
              catalog={catalog}
              onPick={exercise => {
                onChange({ kind: 'map', exerciseId: exercise.id, confidence: 'chosen' });
                setPicking(false);
              }}
              onCreate={() => {
                onChange({ kind: 'create', name: usage.title, muscleGroup: '', equipment: guessEquipment(usage.title) });
                setPicking(false);
              }}
              onSkip={() => {
                onChange({ kind: 'skip' });
                setPicking(false);
              }}
            />
          )}
        </div>
      </div>
    </li>
  );
}

// ─── Review ──────────────────────────────────────────────────────────────────

function initialDecisions(usage: ExerciseUsage[], catalog: CatalogExercise[]): Record<string, Decision> {
  const decisions: Record<string, Decision> = {};
  for (const u of usage) {
    const suggestion = suggestExercise(u.title, catalog);
    decisions[u.title] = suggestion
      ? { kind: 'map', exerciseId: suggestion.exercise.id, confidence: suggestion.confidence }
      : { kind: 'create', name: u.title, muscleGroup: '', equipment: guessEquipment(u.title) };
  }
  return decisions;
}

const needsAttention = (d: Decision) =>
  d.kind === 'create' || d.kind === 'skip' || (d.kind === 'map' && d.confidence === 'possible');

function ReviewStep({
  loaded, onImport, onStartOver,
}: {
  loaded: Loaded;
  onImport: (choices: { decisions: Record<string, Decision>; routineTitles: Set<string>; timeZone: string }) => void;
  onStartOver: () => void;
}) {
  const { data, catalog, usage, existing } = loaded;
  const [timeZone, setTimeZone] = useState(browserTimeZone);
  const [decisions, setDecisions] = useState(() => loaded.decisions ?? initialDecisions(usage, catalog));
  const titles = useMemo(() => summarizeTitles(data), [data]);
  const [routineTitles, setRoutineTitles] = useState(
    () => new Set(titles.filter(t => !isAutomaticTitle(t.title)).map(t => t.title))
  );
  const [showMatched, setShowMatched] = useState(false);
  const [showOverlaps, setShowOverlaps] = useState(false);

  const byId = useMemo(() => new Map(catalog.map(e => [e.id, e])), [catalog]);
  const placed = useMemo(() => placeWorkouts(data, timeZone), [data, timeZone]);
  const statuses = useMemo(() => placed.map(p => workoutStatus(p, existing)), [placed, existing]);
  const count = (status: string) => statuses.filter(s => s === status).length;
  const overlapping = placed.filter((_, i) => statuses[i] === 'overlapping');

  // Stable order: by what needed a look when the page opened, then size
  const [attentionTitles] = useState(() => new Set(usage.filter(u => needsAttention(decisions[u.title])).map(u => u.title)));
  const toCheck = usage.filter(u => attentionTitles.has(u.title));
  const matched = usage.filter(u => !attentionTitles.has(u.title));

  const missingMuscle = Object.values(decisions).filter(d => d.kind === 'create' && !d.muscleGroup).length;
  const blankName = Object.values(decisions).some(d => d.kind === 'create' && !d.name.trim());
  const newCount = count('new');
  const first = placed[0];
  const last = placed[placed.length - 1];
  const totalSets = usage.reduce((sum, u) => sum + u.setCount, 0);

  const setDecision = (title: string, decision: Decision) => setDecisions(prev => ({ ...prev, [title]: decision }));
  const toggleTitle = (title: string) => setRoutineTitles(prev => {
    const next = new Set(prev);
    if (next.has(title)) next.delete(title); else next.add(title);
    return next;
  });

  return (
    <div className="grid gap-6">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Review your import</h1>
        <p className="text-slate-600 text-sm mb-6">
          {loaded.fileName}: {data.workouts.length.toLocaleString()} workouts and {totalSets.toLocaleString()} sets,{' '}
          {formatDay(first.start, timeZone)} to {formatDay(last.start, timeZone)}.
        </p>

        <dl className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 rounded-xl p-4">
            <dd className="text-2xl font-bold text-slate-900">{newCount.toLocaleString()}</dd>
            <dt className="text-xs text-slate-500">to import</dt>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <dd className="text-2xl font-bold text-slate-900">{count('already_imported').toLocaleString()}</dd>
            <dt className="text-xs text-slate-500">already imported</dt>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <dd className="text-2xl font-bold text-slate-900">{overlapping.length.toLocaleString()}</dd>
            <dt className="text-xs text-slate-500">overlap a workout in UltraSync</dt>
          </div>
        </dl>

        {overlapping.length > 0 && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowOverlaps(s => !s)}
              className="text-sm font-medium text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
            >
              {showOverlaps ? 'Hide' : 'Show'} the workouts that will be skipped
              <ChevronDown className={`w-4 h-4 transition-transform ${showOverlaps ? 'rotate-180' : ''}`} />
            </button>
            {showOverlaps && (
              <ul className="mt-2 text-sm text-slate-600 space-y-1">
                {overlapping.map(p => (
                  <li key={p.importKey}>{formatDay(p.start, timeZone)} · {p.workout.title}</li>
                ))}
              </ul>
            )}
            <p className="text-xs text-slate-500 mt-2">
              You logged a workout in UltraSync at the same time as these, so they're skipped to avoid doubles.
            </p>
          </div>
        )}

        <label className="block max-w-sm">
          <span className="block text-sm font-medium text-slate-700 mb-1.5">Timezone you trained in</span>
          <select value={timeZone} onChange={e => setTimeZone(e.target.value)} className={selectClass}>
            {timeZones(timeZone).map(z => <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>)}
          </select>
          <span className="block text-xs text-slate-500 mt-1">Hevy exports times without a timezone.</span>
        </label>
      </div>

      <Card title="Exercises">
        <p className="text-sm text-slate-600 mb-2">
          Each Hevy exercise is matched to an UltraSync one. Check the ones below; anything with no match can become a
          new exercise of your own.
        </p>
        {toCheck.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {toCheck.map(u => (
              <ExerciseRow key={u.title} usage={u} decision={decisions[u.title]} catalog={catalog} byId={byId}
                onChange={d => setDecision(u.title, d)} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-teal-700 font-medium py-2">Every exercise has a match.</p>
        )}

        {matched.length > 0 && (
          <div className="border-t border-slate-100 pt-4 mt-2">
            <button
              type="button"
              onClick={() => setShowMatched(s => !s)}
              className="text-sm font-medium text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
            >
              {showMatched ? 'Hide' : 'Show'} {matched.length} matched {matched.length === 1 ? 'exercise' : 'exercises'}
              <ChevronDown className={`w-4 h-4 transition-transform ${showMatched ? 'rotate-180' : ''}`} />
            </button>
            {showMatched && (
              <ul className="divide-y divide-slate-100">
                {matched.map(u => (
                  <ExerciseRow key={u.title} usage={u} decision={decisions[u.title]} catalog={catalog} byId={byId}
                    onChange={d => setDecision(u.title, d)} />
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>

      <Card
        title="Routines"
        aside={(
          <div className="flex gap-3 text-sm">
            <button type="button" className="font-medium text-teal-700 hover:text-teal-800"
              onClick={() => setRoutineTitles(new Set(titles.map(t => t.title)))}>All</button>
            <button type="button" className="font-medium text-teal-700 hover:text-teal-800"
              onClick={() => setRoutineTitles(new Set())}>None</button>
          </div>
        )}
      >
        <p className="text-sm text-slate-600 mb-4">
          Ticked workout names become routines in a "Hevy" folder, set up like your most recent workout with that name,
          and keep their name on your imported workouts. Unticked ones import as plain workouts.
        </p>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {titles.map(t => (
            <li key={t.title}>
              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={routineTitles.has(t.title)}
                  onChange={() => toggleTitle(t.title)}
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-900 break-words min-w-0">{t.title}</span>
                <span className="text-slate-400 ml-auto flex-shrink-0">{t.workoutCount}</span>
              </label>
            </li>
          ))}
        </ul>
      </Card>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
        {missingMuscle > 0 && (
          <p className="text-sm text-amber-700 mb-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Choose the main muscle for {missingMuscle} new {missingMuscle === 1 ? 'exercise' : 'exercises'}, or pick
            "Don't import it".
          </p>
        )}
        {blankName && <p className="text-sm text-amber-700 mb-3">Every new exercise needs a name.</p>}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:items-center sm:justify-between">
          <button type="button" onClick={onStartOver} className="text-sm font-medium text-slate-600 hover:text-slate-800">
            Choose a different file
          </button>
          <button
            type="button"
            disabled={newCount === 0 || missingMuscle > 0 || blankName}
            onClick={() => onImport({ decisions, routineTitles, timeZone })}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all disabled:opacity-50 disabled:hover:shadow-none"
          >
            {newCount === 0 ? 'Nothing new to import' : `Import ${newCount.toLocaleString()} ${newCount === 1 ? 'workout' : 'workouts'}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HevyImport() {
  const session = useSession();
  const userId = session?.user.id;
  const [phase, setPhase] = useState<Phase>({ step: 'upload' });

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Import from Hevy · UltraSync';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  if (session === null) return <Navigate to="/login" replace />;

  const handleFile = async (file: File) => {
    if (!userId) return;
    let data: HevyExport;
    try {
      data = parseHevyCsv(await file.text());
    } catch (error) {
      setPhase({
        step: 'upload',
        error: error instanceof HevyCsvError ? error.message : "Couldn't read that file. Is it the CSV from Hevy?",
      });
      return;
    }

    setPhase({ step: 'loading' });
    try {
      // A day either side covers any timezone the user picks
      const minutes = data.workouts.map(w => localMinutes(w.start));
      const from = new Date((Math.min(...minutes) - 24 * 60) * 60000).toISOString();
      const to = new Date((Math.max(...minutes) + 48 * 60) * 60000).toISOString();
      const [catalog, bodyweight, existing] = await Promise.all([
        loadCatalog(userId),
        loadBodyweight(),
        loadExistingWorkouts(userId, from, to),
      ]);
      setPhase({
        step: 'review',
        loaded: { fileName: file.name, data, catalog, bodyweight, existing, usage: summarizeExercises(data) },
      });
    } catch (error) {
      setPhase({ step: 'upload', error: friendlyError(error) });
    }
  };

  const handleImport = async (
    loaded: Loaded,
    { decisions, routineTitles, timeZone }: { decisions: Record<string, Decision>; routineTitles: Set<string>; timeZone: string }
  ) => {
    if (!userId) return;
    const resolved = new Map<string, CatalogExercise | null>();
    const byId = new Map(loaded.catalog.map(e => [e.id, e]));
    let customExercises = 0;
    let importedSoFar = 0;
    loaded.decisions = { ...decisions };
    const progress = (message: string, done = 0, total = 0) =>
      setPhase({ step: 'importing', loaded, message, done, total });

    try {
      // 1. New exercises first, so their sets have somewhere to go
      for (const usage of loaded.usage) {
        const decision = decisions[usage.title];
        if (decision.kind === 'map') {
          resolved.set(usage.title, byId.get(decision.exerciseId) ?? null);
        } else if (decision.kind === 'skip') {
          resolved.set(usage.title, null);
        } else {
          progress(`Creating ${decision.name.trim()}…`);
          const bodyweightMode = /\bassisted\b/i.test(usage.title) && usage.hasWeight
            ? 'assisted'
            : /\bweighted\b/i.test(usage.title) ? 'weighted' : null;
          const exercise = await createCustomExercise(userId, {
            name: decision.name,
            muscleGroup: decision.muscleGroup,
            equipment: decision.equipment,
            usesWeight: usage.hasWeight || bodyweightMode !== null,
            usesReps: usage.hasReps || !(usage.hasWeight || usage.hasDuration || usage.hasDistance),
            usesDuration: usage.hasDuration,
            usesDistance: usage.hasDistance,
            bodyweightMode,
          });
          customExercises++;
          resolved.set(usage.title, exercise);
          loaded.catalog.push(exercise);
          // A retry after a later failure uses this exercise, not a second copy
          loaded.decisions[usage.title] = { kind: 'map', exerciseId: exercise.id, confidence: 'chosen' };
        }
      }
      const resolve = (title: string) => resolved.get(title) ?? null;

      // 2. What's already logged, for PR badges
      progress('Checking your personal records…');
      const exerciseIds = [...new Set([...resolved.values()].filter(Boolean).map(e => e!.id))];
      const history = await loadHistory(userId, exerciseIds);

      // 3. Routines, from each picked name's latest workout
      progress('Creating routines…');
      const routinePayloads: RoutinePayload[] = [];
      for (const title of summarizeTitles(loaded.data)) {
        if (!routineTitles.has(title.title)) continue;
        const exercises = convertWorkout(title.latest, resolve);
        if (exercises.length > 0) routinePayloads.push(routinePayload(title.title, exercises));
      }
      const routines = await importRoutines(routinePayloads);

      // 4. Workouts in batches, each saved whole or not at all
      const placed: PlacedWorkout[] = placeWorkouts(loaded.data, timeZone)
        .filter(p => workoutStatus(p, loaded.existing) === 'new');
      const payloads = workoutPayloads(placed, resolve, routines, history, loaded.bodyweight);
      const outcome: Outcome = {
        imported: 0, alreadyImported: 0, overlapping: [], routines: routinePayloads.length, customExercises,
        prSets: payloads.reduce((sum, p) => sum + p.exercises.reduce((n, e) =>
          n + e.sets.filter(s => s.is_record).length, 0), 0),
      };
      const byKey = new Map(placed.map(p => [p.importKey, p]));

      for (let i = 0; i < payloads.length; i += BATCH_SIZE) {
        progress('Importing workouts…', i, payloads.length);
        const result = await importWorkouts(payloads.slice(i, i + BATCH_SIZE));
        outcome.imported += result.imported.length;
        importedSoFar += result.imported.length;
        outcome.alreadyImported += result.already_imported.length;
        for (const key of result.overlapping) {
          const p = byKey.get(key);
          if (p) outcome.overlapping.push({ title: p.workout.title, start: formatDay(p.start, timeZone) });
        }
      }
      setPhase({ step: 'done', outcome });
    } catch (error) {
      setPhase({ step: 'failed', loaded, error: friendlyError(error), importedSoFar });
    }
  };

  return (
    <div className="pt-16 bg-slate-50 min-h-screen">
      <section className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 h-40" />

      <div className="max-w-3xl mx-auto px-4 -mt-20 pb-20">
        {(session === undefined || phase.step === 'loading') && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
            <p className="text-slate-600">{session === undefined ? 'Loading…' : 'Reading your export…'}</p>
          </div>
        )}

        {session && phase.step === 'upload' && <UploadStep error={phase.error} onFile={handleFile} />}

        {session && phase.step === 'review' && (
          <ReviewStep
            loaded={phase.loaded}
            onImport={choices => handleImport(phase.loaded, choices)}
            onStartOver={() => setPhase({ step: 'upload' })}
          />
        )}

        {phase.step === 'importing' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10" role="status">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
              <p className="font-semibold text-slate-900">{phase.message}</p>
            </div>
            {phase.total > 0 && (
              <>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all"
                    style={{ width: `${Math.round((phase.done / phase.total) * 100)}%` }}
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {phase.done.toLocaleString()} of {phase.total.toLocaleString()} workouts
                </p>
              </>
            )}
            <p className="text-sm text-slate-500 mt-4">Keep this page open until it finishes.</p>
          </div>
        )}

        {phase.step === 'failed' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">The import stopped</h1>
            <p className="text-slate-600 mb-1">{phase.error}</p>
            <p className="text-slate-600 mb-6">
              {phase.importedSoFar > 0
                ? `${phase.importedSoFar.toLocaleString()} workouts were saved before it stopped. Trying again picks up where it left off without doubling any.`
                : 'Nothing was imported. You can try again.'}
            </p>
            <button
              type="button"
              onClick={() => setPhase({ step: 'review', loaded: phase.loaded })}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all"
            >
              Back to review
            </button>
          </div>
        )}

        {phase.step === 'done' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-4">
              <Check className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Imported {phase.outcome.imported.toLocaleString()} {phase.outcome.imported === 1 ? 'workout' : 'workouts'}
            </h1>
            <ul className="text-slate-600 space-y-1 mb-6">
              {phase.outcome.routines > 0 && <li>{phase.outcome.routines} routines in your "Hevy" folder</li>}
              {phase.outcome.customExercises > 0 && <li>{phase.outcome.customExercises} new exercises of your own</li>}
              {phase.outcome.prSets > 0 && <li>{phase.outcome.prSets.toLocaleString()} sets marked as personal records</li>}
              {phase.outcome.alreadyImported > 0 && <li>{phase.outcome.alreadyImported} were already imported</li>}
            </ul>
            {phase.outcome.overlapping.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Skipped because they overlap a workout in UltraSync:
                </p>
                <ul className="text-sm text-slate-600 space-y-0.5">
                  {phase.outcome.overlapping.map(o => <li key={o.start + o.title}>{o.start} · {o.title}</li>)}
                </ul>
              </div>
            )}
            <p className="text-slate-600 mb-6">
              They'll show up in the UltraSync app next time it refreshes your workouts.
            </p>
            <Link to="/account" className="text-teal-700 hover:text-teal-800 font-semibold">Back to your account</Link>
          </div>
        )}
      </div>
    </div>
  );
}
