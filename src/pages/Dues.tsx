import { useParams } from 'react-router-dom';
import { CheckCircle2, QrCode, LinkIcon } from 'lucide-react';
import cashAppQr from '../assets/cashapp-qr.svg';

const CASHTAG = 'Doominater1902';

type Member = { name: string; owed: number };

// Edit the amounts here, then commit and push — the site redeploys automatically.
const MEMBERS: Record<string, Member> = {
  'john-28ffb5f882': { name: 'John', owed: 0 },
  'jesse-b754903054': { name: 'Jesse', owed: 19 },
  'sarah-65e9f848a6': { name: 'Sarah', owed: 19 },
  'michael-b999124566': { name: 'Michael', owed: 19 },
  'austin-669736a1f9': { name: 'Austin', owed: 24.5 },
  'thomas-aab9e0b9d4': { name: 'Thomas', owed: 19 },
};

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function Dues() {
  const { token } = useParams();
  const member = token ? MEMBERS[token] : undefined;

  if (!member) {
    return (
      <div className="pt-16">
        <section className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 py-24 text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Link not found</h1>
            <p className="text-lg text-white/80 leading-relaxed">
              This balance link isn't valid. Double-check the link you were sent, or ask for a new one.
            </p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex items-start gap-4">
            <LinkIcon className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-slate-600 leading-relaxed">
              Balance pages are private to each person, so they're only reachable through the exact link you were
              given. Links are easy to break by copying them with a trailing character or a missing piece on the end.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isPaidUp = member.owed <= 0;
  const amount = currency.format(member.owed);
  const payUrl = `https://cash.app/$${CASHTAG}/${member.owed.toFixed(2)}`;

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 py-24 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Hello, {member.name}</h1>
          <p className="text-xl text-white/90 leading-relaxed">
            {isPaidUp ? 'Your gym dues are settled.' : 'Here’s your current gym dues balance.'}
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        {/* Balance */}
        {isPaidUp ? (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-10 text-center border border-emerald-100">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-2">You're all paid up</h2>
            <p className="text-slate-600">Nothing owed right now — thanks!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center shadow-lg border border-slate-100">
            <p className="text-slate-500 font-medium uppercase tracking-wide text-sm mb-3">Balance due</p>
            <div className="text-6xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              {amount}
            </div>
            <p className="text-slate-600">Gym dues</p>
          </div>
        )}

        {/* Pay */}
        {!isPaidUp && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Pay with Cash App</h2>
            <p className="text-slate-600 mb-8">
              Tap the button on your phone, or scan the code from another device.
            </p>

            <a
              href={payUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Pay {amount} on Cash App
            </a>

            <div className="mt-10">
              <img
                src={cashAppQr}
                alt={`Cash App QR code for $${CASHTAG}`}
                className="w-56 h-56 mx-auto rounded-2xl overflow-hidden shadow-md"
              />
              <p className="flex items-center justify-center gap-2 text-slate-500 text-sm mt-4">
                <QrCode className="w-4 h-4" />
                <span>${CASHTAG}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
