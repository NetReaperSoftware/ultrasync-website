import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DownloadBadges from '../components/DownloadBadges';
import { CardioWorkoutCard, StrengthWorkoutCard } from '../components/WorkoutCard';
import { cardioActivityLabel, type PublicExercise } from '../lib/workoutFormat';

// Shape returned by social.get_public_workout (FitSync
// supabase/migrations/add-workout-share-links.sql). The function returns NULL
// for unknown ids, private accounts, and workouts set to Private alike.
interface Owner {
  username: string;
  name: string | null;
  avatar_url: string | null;
}

type PublicWorkout = Owner & (
  | {
      kind: 'strength';
      title: string | null;
      date: string;
      start_time: string | null;
      duration_seconds: number | null;
      calories_burned: number | null;
      exercises: PublicExercise[];
    }
  | {
      kind: 'cardio';
      activity_type: string;
      start_time: string;
      duration_seconds: number;
      calories_burned: number | null;
      distance_miles: number;
      avg_pace_minutes_per_mile: number | null;
      avg_speed_mph: number | null;
      elevation_gain_feet: number;
    }
);

type State =
  | { status: 'loading' }
  | { status: 'unavailable' }
  | { status: 'error' }
  | { status: 'ready'; workout: PublicWorkout };

// Workout ids are UUIDs; anything else can't be one, so skip the lookup
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function OwnerAvatar({ owner }: { owner: Owner }) {
  const [failed, setFailed] = useState(false);
  if (owner.avatar_url && !failed) {
    return (
      <img
        src={owner.avatar_url}
        alt=""
        onError={() => setFailed(true)}
        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow bg-slate-100"
      />
    );
  }
  return (
    <div className="w-14 h-14 rounded-full border-2 border-white shadow bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
      {owner.username.charAt(0).toUpperCase()}
    </div>
  );
}

function workoutTitle(workout: PublicWorkout): string {
  return workout.kind === 'cardio' ? cardioActivityLabel(workout.activity_type) : workout.title || 'Workout';
}

// Web view of a shared workout link (www.ultrasync.app/workout/WORKOUT_ID).
// With the app installed, iOS/Android open these links in the app instead via
// .well-known/apple-app-site-association and assetlinks.json.
export default function WorkoutPage() {
  const { workoutId = '' } = useParams();
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    if (!UUID_PATTERN.test(workoutId)) {
      setState({ status: 'unavailable' });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    supabase
      .schema('social')
      .rpc('get_public_workout', { p_workout_id: workoutId })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('Error loading workout:', error);
          setState({ status: 'error' });
        } else if (!data) {
          setState({ status: 'unavailable' });
        } else {
          setState({ status: 'ready', workout: data as PublicWorkout });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [workoutId]);

  useEffect(() => {
    if (state.status !== 'ready') return;
    const previousTitle = document.title;
    document.title = `${workoutTitle(state.workout)} by @${state.workout.username} · UltraSync`;
    return () => {
      document.title = previousTitle;
    };
  }, [state]);

  return (
    <div className="pt-16 bg-slate-50 min-h-screen">
      <section className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 h-40" />

      <div className="max-w-2xl mx-auto px-4 -mt-20 pb-20">
        {state.status === 'loading' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-pulse">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-slate-200" />
              <div className="h-5 w-32 bg-slate-200 rounded" />
            </div>
            <div className="h-40 bg-slate-100 rounded" />
          </div>
        )}

        {(state.status === 'unavailable' || state.status === 'error') && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {state.status === 'error' ? "Couldn't load this workout" : "This workout isn't available"}
            </h1>
            <p className="text-slate-600">
              {state.status === 'error'
                ? 'Something went wrong. Please try again in a moment.'
                : 'It may have been deleted or made private. Open the link in the UltraSync app to try there.'}
            </p>
          </div>
        )}

        {state.status === 'ready' && (
          <>
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 mb-6">
              <Link to={`/user/${encodeURIComponent(state.workout.username)}`} className="flex items-center gap-4 group">
                <OwnerAvatar owner={state.workout} />
                <div className="min-w-0">
                  {state.workout.name && (
                    <p className="font-bold text-slate-900 break-words group-hover:text-teal-600">{state.workout.name}</p>
                  )}
                  <p className={`break-words ${state.workout.name ? 'text-sm text-slate-500' : 'font-bold text-slate-900 group-hover:text-teal-600'}`}>
                    @{state.workout.username}
                  </p>
                </div>
              </Link>
            </div>

            <h1 className="sr-only">{workoutTitle(state.workout)} by @{state.workout.username}</h1>
            {state.workout.kind === 'strength' ? (
              <StrengthWorkoutCard
                label="Workout"
                title={state.workout.title}
                date={state.workout.date}
                durationSeconds={state.workout.duration_seconds}
                caloriesBurned={state.workout.calories_burned}
                exercises={state.workout.exercises}
              />
            ) : (
              <CardioWorkoutCard
                label="Cardio"
                activityType={state.workout.activity_type}
                startTime={state.workout.start_time}
                durationSeconds={state.workout.duration_seconds}
                caloriesBurned={state.workout.calories_burned}
                distanceMiles={Number(state.workout.distance_miles)}
                avgPaceMinutesPerMile={state.workout.avg_pace_minutes_per_mile == null ? null : Number(state.workout.avg_pace_minutes_per_mile)}
                elevationGainFeet={Number(state.workout.elevation_gain_feet)}
              />
            )}
          </>
        )}

        {state.status !== 'loading' && (
          <div className="text-center mt-10">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              {state.status === 'ready' ? 'Train with UltraSync' : 'Get UltraSync'}
            </h2>
            <p className="text-slate-600 mb-6">
              Already have the app? Open this link on your phone to like, comment, or save this workout.
            </p>
            <DownloadBadges className="mb-8" />
            <Link to="/" className="text-teal-600 hover:text-teal-700 font-semibold">
              Learn more about UltraSync
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
