import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Crown, Dumbbell, Footprints, LogOut, Utensils, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useSession } from '../lib/useSession';

// Shape returned by social.get_my_account (FitSync
// supabase/migrations/add-web-account-summary.sql)
interface MyAccount {
  email: string;
  name: string | null;
  avatar_url: string | null;
  member_since: string;
  username: string | null;
  is_private: boolean;
  workout_visibility: 'everyone' | 'private';
  followers: number;
  following: number;
  workouts: number;
  cardio_workouts: number;
  last_workout_date: string | null;
  meal_days_logged: number;
  weight_units: 'lbs' | 'kg';
  fitness_profile: {
    height_inches: number | null;
    weight_lbs: number | null;
    target_weight_lbs: number | null;
    primary_goal: string | null;
    activity_level: string | null;
    experience_level: string | null;
  } | null;
  nutrition_goals: {
    daily_calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  } | null;
  subscription: {
    access_level: 'premium' | 'trial' | 'free';
    is_premium: boolean;
    is_trial: boolean;
    premium_type: 'lifetime' | 'monthly_subscription' | 'yearly_subscription' | null;
    subscription_expiry: string | null;
    auto_renewing: boolean;
  };
}

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; account: MyAccount };

const KG_PER_LB = 0.45359237;
const CM_PER_INCH = 2.54;

const PREMIUM_TYPE_LABELS: Record<string, string> = {
  lifetime: 'Lifetime',
  monthly_subscription: 'Monthly',
  yearly_subscription: 'Yearly',
};

// snake_case enum → "Sentence case"
function humanize(value: string): string {
  const text = value.replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatDate(value: string): string {
  // Plain YYYY-MM-DD dates are parsed as local so they don't shift a day in the Americas
  let date = new Date(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    date = new Date(y, m - 1, d);
  }
  return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatWeight(lbs: number | null, units: 'lbs' | 'kg'): string | null {
  if (lbs == null) return null;
  return units === 'kg' ? `${(lbs * KG_PER_LB).toFixed(1)} kg` : `${+Number(lbs).toFixed(1)} lb`;
}

function formatHeight(inches: number | null, units: 'lbs' | 'kg'): string | null {
  if (inches == null) return null;
  if (units === 'kg') return `${Math.round(inches * CM_PER_INCH)} cm`;
  const total = Math.round(inches);
  return `${Math.floor(total / 12)}′ ${total % 12}″`;
}

function subscriptionSummary(sub: MyAccount['subscription']): { title: string; detail: string | null } {
  if (sub.access_level === 'free') return { title: 'Free', detail: null };
  const expiry = sub.subscription_expiry ? formatDate(sub.subscription_expiry) : null;
  if (sub.access_level === 'trial' || sub.is_trial) {
    return { title: 'Premium trial', detail: expiry ? `Ends ${expiry}` : null };
  }
  const plan = sub.premium_type ? PREMIUM_TYPE_LABELS[sub.premium_type] : null;
  return {
    title: plan ? `Premium · ${plan}` : 'Premium',
    detail: sub.premium_type === 'lifetime' || !expiry ? null : `${sub.auto_renewing ? 'Renews' : 'Expires'} ${expiry}`,
  };
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-teal-600 mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-sm text-slate-500 flex-shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-slate-900 text-right break-all">{value ?? '—'}</dd>
    </div>
  );
}

function StatTile({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <div className="text-teal-600 mb-2">{icon}</div>
      <div className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function Avatar({ account }: { account: MyAccount }) {
  const [failed, setFailed] = useState(false);
  const initial = (account.name || account.username || account.email).charAt(0).toUpperCase();
  if (account.avatar_url && !failed) {
    return (
      <img
        src={account.avatar_url}
        alt=""
        onError={() => setFailed(true)}
        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg bg-slate-100"
      />
    );
  }
  return (
    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
      {initial}
    </div>
  );
}

function AccountDetails({ account }: { account: MyAccount }) {
  const units = account.weight_units;
  const fp = account.fitness_profile;
  const goals = account.nutrition_goals;
  const sub = subscriptionSummary(account.subscription);

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center mb-6">
        <div className="flex justify-center -mt-20 mb-4">
          <Avatar account={account} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 break-words">{account.name || account.username || 'Your account'}</h1>
        {account.username && (
          <Link to={`/user/${encodeURIComponent(account.username)}`} className="text-slate-500 hover:text-teal-600 break-words">
            @{account.username}
          </Link>
        )}
        <p className="text-sm text-slate-400 mt-2">Member since {formatDate(account.member_since)}</p>
      </div>

      <div className="grid gap-6">
        <Card title="Activity">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatTile icon={<Dumbbell className="w-5 h-5" />} value={account.workouts} label="Strength workouts" />
            <StatTile icon={<Footprints className="w-5 h-5" />} value={account.cardio_workouts} label="Cardio sessions" />
            <StatTile icon={<Utensils className="w-5 h-5" />} value={account.meal_days_logged} label="Days of meals logged" />
            <StatTile icon={<Users className="w-5 h-5" />} value={account.followers} label="Followers" />
          </div>
          <dl className="divide-y divide-slate-100 mt-4">
            <Row label="Following" value={account.following.toLocaleString()} />
            <Row label="Last workout" value={account.last_workout_date ? formatDate(account.last_workout_date) : null} />
          </dl>
        </Card>

        <Card title="Account">
          <dl className="divide-y divide-slate-100">
            <Row label="Email" value={account.email} />
            <Row label="Username" value={account.username ? `@${account.username}` : null} />
            <Row label="Profile" value={account.is_private ? 'Private' : 'Public'} />
            <Row label="Workouts visible to" value={account.workout_visibility === 'private' ? 'Only you' : 'Everyone'} />
          </dl>
        </Card>

        <Card title="Subscription">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              account.subscription.access_level === 'free' ? 'bg-slate-100 text-slate-400' : 'bg-amber-100 text-amber-600'
            }`}>
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{sub.title}</p>
              {sub.detail && <p className="text-sm text-slate-500">{sub.detail}</p>}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Manage your subscription from the UltraSync app or your App Store / Google Play account.</p>
        </Card>

        {fp && (
          <Card title="Fitness profile">
            <dl className="divide-y divide-slate-100">
              <Row label="Height" value={formatHeight(fp.height_inches, units)} />
              <Row label="Current weight" value={formatWeight(fp.weight_lbs, units)} />
              <Row label="Target weight" value={formatWeight(fp.target_weight_lbs, units)} />
              <Row label="Primary goal" value={fp.primary_goal && humanize(fp.primary_goal)} />
              <Row label="Activity level" value={fp.activity_level && humanize(fp.activity_level)} />
              <Row label="Experience" value={fp.experience_level && humanize(fp.experience_level)} />
            </dl>
          </Card>
        )}

        {goals && (
          <Card title="Daily nutrition goals">
            <dl className="divide-y divide-slate-100">
              <Row label="Calories" value={`${Math.round(goals.daily_calories).toLocaleString()} kcal`} />
              <Row label="Protein" value={`${Math.round(goals.protein_g)} g`} />
              <Row label="Carbs" value={`${Math.round(goals.carbs_g)} g`} />
              <Row label="Fat" value={`${Math.round(goals.fat_g)} g`} />
            </dl>
          </Card>
        )}
      </div>

      <p className="text-center text-sm text-slate-500 mt-8">
        To change any of this, open the UltraSync app.
      </p>
    </>
  );
}

export default function Account() {
  const session = useSession();
  const userId = session?.user.id;
  const [state, setState] = useState<State>({ status: 'loading' });
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setState({ status: 'loading' });

    supabase
      .schema('social')
      .rpc('get_my_account')
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          console.error('Error loading account:', error);
          setState({ status: 'error' });
        } else {
          setState({ status: 'ready', account: data as MyAccount });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Your account · UltraSync';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  if (session === null) return <Navigate to="/login" replace />;

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    // useSession sees the sign-out and the redirect above takes over
  };

  return (
    <div className="pt-16 bg-slate-50 min-h-screen">
      <section className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 h-40" />

      <div className="max-w-2xl mx-auto px-4 -mt-20 pb-20">
        {(session === undefined || state.status === 'loading') && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-pulse">
            <div className="w-24 h-24 rounded-full bg-slate-200 mx-auto mb-4" />
            <div className="h-6 w-40 bg-slate-200 rounded mx-auto mb-8" />
            <div className="h-24 bg-slate-100 rounded" />
          </div>
        )}

        {session && state.status === 'error' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Couldn't load your account</h1>
            <p className="text-slate-600">Something went wrong. Please try again in a moment.</p>
          </div>
        )}

        {session && state.status === 'ready' && <AccountDetails account={state.account} />}

        {session && (
          <div className="text-center mt-8">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 font-semibold hover:border-slate-300 hover:text-slate-900 transition-colors disabled:opacity-60"
            >
              <LogOut className="w-4 h-4" />
              {signingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
