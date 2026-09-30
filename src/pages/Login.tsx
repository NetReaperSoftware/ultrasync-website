import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { LogIn, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSession } from '../lib/useSession';

type Mode = 'signin' | 'forgot';
type Message = { text: string; type: 'error' | 'success' };

const inputClass =
  'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500';

// Web sign-in with the same email/password as the app. There is no web sign-up:
// accounts are created in the app, which also runs onboarding.
export default function Login() {
  const session = useSession();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  if (session) return <Navigate to="/account" replace />;

  const switchMode = (next: Mode) => {
    setMode(next);
    setMessage(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setMessage({
        type: 'error',
        text: error.message === 'Email not confirmed'
          ? 'Please confirm your email first using the link we sent when you signed up.'
          : error.message === 'Invalid login credentials'
            ? 'Incorrect email or password.'
            : error.message,
      });
    }
    // On success useSession picks up the new session and redirects to /account
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    setMessage(error
      ? { type: 'error', text: error.message }
      // Same wording whether or not the email has an account
      : { type: 'success', text: 'If an account exists for that email, a reset link is on its way.' });
  };

  return (
    <div className="pt-16 bg-slate-50 min-h-screen">
      <section className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 h-40" />

      <div className="max-w-md mx-auto px-4 -mt-20 pb-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
              {mode === 'signin' ? <LogIn className="w-7 h-7 text-white" /> : <Mail className="w-7 h-7 text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              {mode === 'signin' ? 'Sign in to UltraSync' : 'Reset your password'}
            </h1>
            <p className="text-slate-600 text-sm">
              {mode === 'signin'
                ? 'Use the same email and password as the app.'
                : "Enter your email and we'll send you a reset link."}
            </p>
          </div>

          <form onSubmit={mode === 'signin' ? handleSignIn : handleForgot} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            {mode === 'signin' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            {message && (
              <p
                role={message.type === 'error' ? 'alert' : 'status'}
                className={`text-sm font-medium ${message.type === 'error' ? 'text-red-600' : 'text-teal-700'}`}
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || session === undefined}
              className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all disabled:opacity-60"
            >
              {mode === 'signin'
                ? (loading ? 'Signing in...' : 'Sign in')
                : (loading ? 'Sending...' : 'Send reset link')}
            </button>
          </form>

          {mode === 'forgot' && (
            <div className="mt-6 text-center">
              <button onClick={() => switchMode('signin')} className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Back to sign in
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          Don't have an account? <Link to="/" className="text-teal-600 hover:text-teal-700 font-semibold">Get the app</Link> to sign up.
        </p>
      </div>
    </div>
  );
}
