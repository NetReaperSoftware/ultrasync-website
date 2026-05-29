import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Capture tokens immediately before React renders
const captureTokens = () => {
  const hash = window.location.hash;
  if (hash && hash.includes('access_token')) {
    const params = new URLSearchParams(hash.substring(1));
    return {
      access_token: params.get('access_token'),
      refresh_token: params.get('refresh_token'),
      type: params.get('type'),
      error: params.get('error'),
      error_description: params.get('error_description'),
      direct_token: false,
    };
  }
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get('access_token') || searchParams.get('token')) {
    return {
      access_token: searchParams.get('access_token') || searchParams.get('token'),
      refresh_token: searchParams.get('refresh_token'),
      type: searchParams.get('type'),
      error: searchParams.get('error'),
      error_description: searchParams.get('error_description'),
      direct_token: !searchParams.get('access_token'),
    };
  }
  return null;
};

const capturedTokens = captureTokens();

type ViewState = 'loading' | 'form' | 'error' | 'success';
type ErrorInfo = { title: string; message: string };

export default function ResetPassword() {
  const [view, setView] = useState<ViewState>('loading');
  const [isValidSession, setIsValidSession] = useState(false);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({
    title: 'Invalid Reset Link',
    message: 'This password reset link is invalid or has expired. Please request a new password reset from the UltraSync app.',
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' | 'warning' } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleToken = async () => {
      const tokens = capturedTokens;

      if (!tokens) {
        setView('error');
        return;
      }

      if (tokens.error) {
        const isExpired = tokens.error === 'access_denied' && tokens.error_description?.includes('expired');
        setErrorInfo({
          title: isExpired ? 'Reset Link Expired' : 'Reset Link Error',
          message: isExpired
            ? 'This password reset link has expired. Please request a new password reset from the UltraSync app.'
            : `There was an error: ${tokens.error_description || tokens.error}. Please request a new password reset.`,
        });
        setView('error');
        return;
      }

      if (tokens.type === 'recovery' && tokens.access_token) {
        if (tokens.direct_token) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokens.access_token!,
            type: 'recovery',
          });
          if (error) { setView('error'); return; }
          setIsValidSession(true);
          setView('form');
          return;
        }

        const { error } = await supabase.auth.setSession({
          access_token: tokens.access_token!,
          refresh_token: tokens.refresh_token || tokens.access_token!,
        });
        if (error) { setView('error'); return; }
        setIsValidSession(true);
        setView('form');
      } else {
        setView('error');
      }
    };

    setTimeout(handleToken, 500);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidSession) { setMessage({ text: 'Invalid session. Please use the link from your email.', type: 'error' }); return; }
    if (newPassword !== confirmPassword) { setMessage({ text: 'Passwords do not match.', type: 'error' }); return; }
    if (newPassword.length < 6) { setMessage({ text: 'Password must be at least 6 characters long.', type: 'error' }); return; }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage({ text: error.message || 'Failed to update password. Please try again.', type: 'error' });
      setLoading(false);
    } else {
      setView('success');
      setTimeout(() => { window.location.href = 'fitsync://auth/password-reset-success'; }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold">UltraSync</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {view === 'loading' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center border border-white/20">
              <div className="text-5xl mb-6">⏳</div>
              <h1 className="text-2xl font-bold text-white mb-3">Validating Reset Link</h1>
              <p className="text-white/70">Please wait while we verify your password reset request...</p>
            </div>
          )}

          {view === 'error' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center border border-white/20">
              <div className="text-5xl mb-6">❌</div>
              <h1 className="text-2xl font-bold text-white mb-3">{errorInfo.title}</h1>
              <p className="text-white/70 mb-8">{errorInfo.message}</p>
              <a
                href="fitsync://auth/login"
                className="inline-block px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold"
              >
                Open UltraSync App
              </a>
            </div>
          )}

          {view === 'form' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 border border-white/20">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🔒</div>
                <h1 className="text-2xl font-bold text-white mb-2">Reset Your Password</h1>
                <p className="text-white/70">Enter your new password below.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    minLength={6}
                    required
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => {
                      setConfirmPassword(e.target.value);
                      if (e.target.value && newPassword !== e.target.value) setMessage({ text: 'Passwords do not match', type: 'warning' });
                      else if (e.target.value && newPassword === e.target.value) setMessage({ text: 'Passwords match', type: 'success' });
                      else setMessage(null);
                    }}
                    minLength={6}
                    required
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                  />
                </div>

                {message && (
                  <p className={`text-sm font-medium ${
                    message.type === 'error' ? 'text-red-400' :
                    message.type === 'success' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {message.text}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60"
                >
                  {loading ? 'Updating Password...' : 'Reset Password'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <a href="fitsync://auth/login" className="text-teal-400 hover:underline text-sm">
                  Return to UltraSync App
                </a>
              </div>
            </div>
          )}

          {view === 'success' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center border border-white/20">
              <div className="text-5xl mb-6">✅</div>
              <h1 className="text-2xl font-bold text-white mb-3">Password Reset Successfully!</h1>
              <p className="text-white/70 mb-2">Your password has been updated. You can now log in with your new password.</p>
              <p className="text-white/50 text-sm mb-8">Redirecting to UltraSync app...</p>
              <a
                href="fitsync://auth/password-reset-success"
                className="inline-block px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold"
              >
                Continue to UltraSync
              </a>
            </div>
          )}

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { icon: '🔐', title: 'Secure Process', desc: 'Encrypted connections and validated tokens' },
              { icon: '📱', title: 'Continue in App', desc: 'Redirected back after reset' },
              { icon: '🆘', title: 'Need Help?', desc: 'Contact our support team' },
            ].map(card => (
              <div key={card.title} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl mb-2">{card.icon}</div>
                <p className="text-white/80 font-medium text-xs mb-1">{card.title}</p>
                <p className="text-white/50 text-xs">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
