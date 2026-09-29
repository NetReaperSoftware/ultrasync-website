import { Link, useParams } from 'react-router-dom';
import logo from '../../assets/icons/Logo-1024.png';
import DownloadBadges from '../components/DownloadBadges';

// Web fallback for shared profile links (ultrasync.app/user/USERNAME).
// With the app installed, iOS/Android open these links directly in the app
// via .well-known/apple-app-site-association and assetlinks.json.
export default function UserProfile() {
  const { username = '' } = useParams();

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 py-24 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <img src={logo} alt="UltraSync" className="w-20 h-20 rounded-2xl mx-auto mb-6 shadow-lg" />
          <h1 className="text-4xl font-bold mb-4 break-words">@{username}</h1>
          <p className="text-xl text-white/90 leading-relaxed">
            shared their UltraSync profile with you. Open this link on a phone with UltraSync installed to view it and follow them.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Don't have UltraSync yet?</h2>
        <p className="text-slate-600 mb-8">
          Download the app, then tap the link again to open @{username}'s profile.
        </p>
        <DownloadBadges className="mb-12" />
        <Link to="/" className="text-teal-600 hover:text-teal-700 font-semibold">
          Learn more about UltraSync
        </Link>
      </div>
    </div>
  );
}
