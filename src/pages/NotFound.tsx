import { Link } from 'react-router-dom';
import { Home, HelpCircle, Mail, Compass } from 'lucide-react';

const suggestions = [
  { to: '/', icon: Home, title: 'Home', detail: 'Start from the top' },
  { to: '/about', icon: Compass, title: 'About UltraSync', detail: 'What the platform does' },
  { to: '/faq', icon: HelpCircle, title: 'FAQ', detail: 'Common questions answered' },
  { to: '/contact', icon: Mail, title: 'Contact', detail: 'Get in touch with support' },
];

export default function NotFound() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 py-24 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-7xl sm:text-8xl font-bold mb-4 text-white/90">404</div>
          <h1 className="text-4xl font-bold mb-4">Page not found</h1>
          <p className="text-xl text-white/90 leading-relaxed">
            The page you're looking for doesn't exist, or it may have moved.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Try one of these instead</h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {suggestions.map(({ to, icon: Icon, title, detail }) => (
            <Link
              key={to}
              to={to}
              className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-slate-600 text-sm">{detail}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
