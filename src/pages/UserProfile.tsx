import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserX } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DownloadBadges from '../components/DownloadBadges';
import { StrengthWorkoutCard } from '../components/WorkoutCard';
import type { PublicExercise } from '../lib/workoutFormat';

// Shape returned by social.get_public_profile (FitSync
// supabase/migrations/add-public-web-profile.sql). The function returns NULL
// for both unknown usernames and private accounts.
interface PublicWorkout {
  name: string | null;
  date: string;
  start_time: string | null;
  duration_seconds: number | null;
  calories_burned: number | null;
  exercises: PublicExercise[];
}

interface PublicProfile {
  username: string;
  name: string | null;
  avatar_url: string | null;
  followers: number;
  following: number;
  // Null when the user has set their workouts to Private
  workouts: number | null;
  latest_workout: PublicWorkout | null;
}

type State =
  | { status: 'loading' }
  | { status: 'unavailable' }
  | { status: 'error' }
  | { status: 'ready'; profile: PublicProfile };

function Stat({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="flex-1 text-center">
      <div className="text-2xl sm:text-3xl font-bold text-slate-900">
        {value == null ? '—' : value.toLocaleString()}
      </div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

function Avatar({ profile }: { profile: PublicProfile }) {
  const [failed, setFailed] = useState(false);
  if (profile.avatar_url && !failed) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile.username}
        onError={() => setFailed(true)}
        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg bg-slate-100"
      />
    );
  }
  return (
    <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold">
      {profile.username.charAt(0).toUpperCase()}
    </div>
  );
}

// Web view of a shared profile link (www.ultrasync.app/user/USERNAME). With the
// app installed, iOS/Android open these links in the app instead via
// .well-known/apple-app-site-association and assetlinks.json.
export default function UserProfile() {
  // React Router already decodes path params, so this is the plain username
  const { username = '' } = useParams();
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });

    supabase
      .schema('social')
      .rpc('get_public_profile', { p_username: username })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('Error loading profile:', error);
          setState({ status: 'error' });
        } else if (!data) {
          setState({ status: 'unavailable' });
        } else {
          setState({ status: 'ready', profile: data as PublicProfile });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  useEffect(() => {
    if (state.status !== 'ready') return;
    const previousTitle = document.title;
    document.title = `@${state.profile.username} on UltraSync`;
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
            <div className="w-28 h-28 rounded-full bg-slate-200 mx-auto mb-4" />
            <div className="h-6 w-40 bg-slate-200 rounded mx-auto mb-8" />
            <div className="h-12 bg-slate-100 rounded" />
          </div>
        )}

        {(state.status === 'unavailable' || state.status === 'error') && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <UserX className="w-8 h-8 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {state.status === 'error' ? "Couldn't load this profile" : "This profile isn't available"}
            </h1>
            <p className="text-slate-600">
              {state.status === 'error'
                ? 'Something went wrong. Please try again in a moment.'
                : 'Open the link in the UltraSync app to find this person.'}
            </p>
          </div>
        )}

        {state.status === 'ready' && (
          <>
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center mb-6">
              <div className="flex justify-center -mt-20 mb-4">
                <Avatar profile={state.profile} />
              </div>
              {state.profile.name && (
                <h1 className="text-2xl font-bold text-slate-900 break-words">{state.profile.name}</h1>
              )}
              <p className={`break-words ${state.profile.name ? 'text-slate-500' : 'text-2xl font-bold text-slate-900'}`}>
                @{state.profile.username}
              </p>

              <div className="flex divide-x divide-slate-100 mt-8">
                <Stat value={state.profile.workouts} label="Workouts" />
                <Stat value={state.profile.followers} label="Followers" />
                <Stat value={state.profile.following} label="Following" />
              </div>
            </div>

            {state.profile.latest_workout && (
              <div className="mb-6">
                <StrengthWorkoutCard
                  label="Latest workout"
                  title={state.profile.latest_workout.name}
                  date={state.profile.latest_workout.date}
                  durationSeconds={state.profile.latest_workout.duration_seconds}
                  caloriesBurned={state.profile.latest_workout.calories_burned}
                  exercises={state.profile.latest_workout.exercises}
                />
              </div>
            )}
          </>
        )}

        {state.status !== 'loading' && (
          <div className="text-center mt-10">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              {state.status === 'ready' ? `Follow @${state.profile.username} on UltraSync` : 'Get UltraSync'}
            </h2>
            <p className="text-slate-600 mb-6">
              Already have the app? Open this link on your phone to view the full profile.
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
