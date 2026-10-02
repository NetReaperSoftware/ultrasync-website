import type { ReactNode } from 'react';
import { Clock, Dumbbell, Flame, Mountain, Gauge, Route, Trophy } from 'lucide-react';
import { cardioActivityLabel, formatDate, formatDuration, formatPace, formatSet, formatTimestampDate } from '../lib/workoutFormat';
import type { PublicExercise } from '../lib/workoutFormat';

// Workout shapes and cards shared by the public profile page (latest workout)
// and the shared workout page. Data comes from social.get_public_profile and
// social.get_public_workout (FitSync supabase/migrations).

function CardShell({ label, title, date, stats, children }: {
  label: string;
  title: string;
  date: string;
  stats: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-left">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 mb-1">{label}</p>
          <h3 className="text-lg font-bold text-slate-900 break-words">{title}</h3>
          <p className="text-sm text-slate-500">{date}</p>
        </div>
        <div className="flex flex-col items-end gap-1 text-sm text-slate-600 flex-shrink-0">{stats}</div>
      </div>
      {children}
    </div>
  );
}

function Stat({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <span className="flex items-center gap-1">{icon}{children}</span>;
}

export function StrengthWorkoutCard({ label, title, date, durationSeconds, caloriesBurned, exercises }: {
  label: string;
  title: string | null;
  date: string;
  durationSeconds: number | null;
  caloriesBurned: number | null;
  exercises: PublicExercise[];
}) {
  return (
    <CardShell
      label={label}
      title={title || 'Workout'}
      date={formatDate(date)}
      stats={
        <>
          {durationSeconds != null && durationSeconds > 0 && (
            <Stat icon={<Clock className="w-4 h-4" />}>{formatDuration(durationSeconds)}</Stat>
          )}
          {caloriesBurned != null && caloriesBurned > 0 && (
            <Stat icon={<Flame className="w-4 h-4" />}>{caloriesBurned} cal</Stat>
          )}
        </>
      }
    >
      {exercises.length > 0 && (
        <ul className="divide-y divide-slate-100">
          {exercises.map((exercise, i) => (
            <li key={i} className="py-3">
              <div className="flex items-center gap-2 mb-1">
                <Dumbbell className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span className="font-semibold text-slate-900">{exercise.name}</span>
                {exercise.muscle_group && <span className="text-xs text-slate-400">{exercise.muscle_group}</span>}
              </div>
              <div className="flex flex-wrap gap-2 pl-6">
                {exercise.sets.map((set, j) => (
                  <span
                    key={j}
                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      set.is_pr ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {set.is_pr && <Trophy className="w-3 h-3" />}
                    {formatSet(set)}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardShell>
  );
}

function Figure({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <div className="text-teal-600 mb-2">{icon}</div>
      <div className="text-xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

export function CardioWorkoutCard({ label, activityType, startTime, durationSeconds, caloriesBurned, distanceMiles, avgPaceMinutesPerMile, elevationGainFeet }: {
  label: string;
  activityType: string;
  startTime: string;
  durationSeconds: number;
  caloriesBurned: number | null;
  distanceMiles: number;
  avgPaceMinutesPerMile: number | null;
  elevationGainFeet: number;
}) {
  const hasDistance = distanceMiles > 0;
  return (
    <CardShell
      label={label}
      title={cardioActivityLabel(activityType)}
      // Cardio has no date column: show the start in the viewer's time zone
      date={formatTimestampDate(startTime)}
      stats={
        caloriesBurned != null && caloriesBurned > 0 && (
          <Stat icon={<Flame className="w-4 h-4" />}>{caloriesBurned} cal</Stat>
        )
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <Figure icon={<Clock className="w-5 h-5" />} value={formatDuration(durationSeconds)} label="Time" />
        {hasDistance && (
          <Figure icon={<Route className="w-5 h-5" />} value={`${distanceMiles.toFixed(2)} mi`} label="Distance" />
        )}
        {hasDistance && avgPaceMinutesPerMile != null && avgPaceMinutesPerMile > 0 && (
          <Figure icon={<Gauge className="w-5 h-5" />} value={formatPace(avgPaceMinutesPerMile)} label="Avg pace" />
        )}
        {elevationGainFeet > 0 && (
          <Figure icon={<Mountain className="w-5 h-5" />} value={`${Math.round(elevationGainFeet).toLocaleString()} ft`} label="Elevation gain" />
        )}
      </div>
    </CardShell>
  );
}
