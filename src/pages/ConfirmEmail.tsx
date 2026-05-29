import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/icons/Logo-1024.png';
import DownloadBadges from '../components/DownloadBadges';

type Status = 'success' | 'already-confirmed' | 'error';

const nextSteps = [
  { step: 1, title: 'Download UltraSync', description: 'Get the app on your mobile device to start tracking your fitness journey with advanced analytics and insights.' },
  { step: 2, title: 'Complete Setup', description: 'Set up your fitness profile, nutrition goals, and connect HealthKit for seamless data synchronization.' },
  { step: 3, title: 'Start Training', description: 'Begin logging workouts, tracking nutrition, and visualizing your progress with our muscle mapping technology.' },
];

const features = [
  { icon: '💪', title: 'Muscle Mapping', description: 'Visualize muscle development with interactive body mapping' },
  { icon: '🍎', title: 'Smart Nutrition', description: 'Barcode scanning and intelligent macro tracking' },
  { icon: '📊', title: 'Advanced Analytics', description: 'Detailed progress tracking and performance insights' },
  { icon: '🔄', title: 'HealthKit Sync', description: 'Seamless integration with Apple Health ecosystem' },
];

export default function ConfirmEmail() {
  const [status, setStatus] = useState<Status>('success');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const confirmed = params.get('confirmed');

    if (error) setStatus('error');
    else if (confirmed === 'false') setStatus('already-confirmed');
    else setStatus('success');

    // Prompt to open app after 2 seconds on success
    if (!error && confirmed !== 'false') {
      const timer = setTimeout(() => {
        if (window.confirm('Would you like to open UltraSync app now?')) {
          window.location.href = 'fitsync://confirm-email';
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const statusContent = {
    success: { icon: '✅', title: 'Email Confirmed!', message: 'Welcome to UltraSync! Your email has been successfully verified. You\'re all set to start your intelligent fitness journey.' },
    'already-confirmed': { icon: '⚠️', title: 'Already Confirmed', message: 'This email has already been confirmed, or the confirmation link is invalid. You can proceed to download the app.' },
    error: { icon: '❌', title: 'Confirmation Error', message: 'There was an issue confirming your email. Please try again or contact support if the problem persists.' },
  }[status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <img src={logo} alt="UltraSync" className="w-8 h-8 rounded-lg" />
          <span className="text-white font-bold">UltraSync</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Status Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 text-center border border-white/20 mb-8">
            <div className="text-6xl mb-6">{statusContent.icon}</div>
            <h1 className="text-3xl font-bold text-white mb-4">{statusContent.title}</h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8">{statusContent.message}</p>

            <div className="flex flex-col items-center gap-4">
              <DownloadBadges badgeHeight="h-12" />
              <button
                onClick={() => {
                  window.location.href = 'fitsync://confirm-email';
                  setTimeout(() => {
                    if (confirm('UltraSync app not found. Download it now?')) {
                      window.open('https://apps.apple.com/us/app/ultrasync-fitness-tracker/id6749923790', '_blank');
                    }
                  }, 1500);
                }}
                className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                Open in UltraSync App
              </button>
            </div>
          </div>

          {/* Next Steps */}
          {status === 'success' && (
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-6">
                <h2 className="text-xl font-bold text-white mb-6">What's Next?</h2>
                <div className="space-y-4">
                  {nextSteps.map(({ step, title, description }) => (
                    <div key={step} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{title}</h3>
                        <p className="text-white/70 text-sm">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6">What You'll Get with UltraSync</h2>
                <div className="grid grid-cols-2 gap-4">
                  {features.map(({ icon, title, description }) => (
                    <div key={title} className="text-center">
                      <div className="text-3xl mb-2">{icon}</div>
                      <h4 className="font-semibold text-white text-sm mb-1">{title}</h4>
                      <p className="text-white/60 text-xs">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-center gap-4 mt-8">
            <Link to="/" className="text-white/70 hover:text-white transition-colors text-sm">Explore Features</Link>
            <Link to="/about" className="text-white/70 hover:text-white transition-colors text-sm">Learn More</Link>
            <Link to="/contact" className="text-white/70 hover:text-white transition-colors text-sm">Get Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
