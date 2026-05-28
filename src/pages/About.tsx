import DownloadBadges from '../components/DownloadBadges';

const differenceCards = [
  {
    title: 'Intelligence First',
    description: 'Our platform doesn\'t just track—it thinks. Advanced algorithms analyze your workout patterns, suggest optimal progression paths, and identify potential plateaus before they happen.',
  },
  {
    title: 'Scientific Precision',
    description: 'Built on exercise science principles with features like muscle mapping visualization, progressive overload tracking, and evidence-based TDEE calculations.',
  },
  {
    title: 'Seamless Integration',
    description: 'Native HealthKit sync, background GPS tracking, barcode scanning, and OCR nutrition capture—technology that works invisibly to capture every detail.',
  },
  {
    title: 'Actionable Insights',
    description: 'Move beyond basic charts to sophisticated analytics: muscle group balance, strength ratios, nutrition optimization, and performance trends that guide your decisions.',
  },
];

const stats = [
  { number: '400+', label: 'Exercise Database' },
  { number: 'Real-time', label: 'HealthKit Sync' },
  { number: 'Advanced', label: 'Muscle Mapping' },
  { number: 'Smart', label: 'Nutrition OCR' },
];

const techStack = [
  { name: 'React Native', detail: 'Cross-platform native performance' },
  { name: 'Supabase', detail: 'Real-time database with offline sync' },
  { name: 'HealthKit Integration', detail: 'Native iOS health data sync' },
  { name: 'MapBox', detail: 'GPS tracking and route visualization' },
  { name: 'OCR Technology', detail: 'Nutrition label scanning' },
  { name: 'Background Services', detail: 'Continuous activity monitoring' },
];

export default function About() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 py-24 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">About UltraSync</h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Building the world's first truly unified fitness platform. Revolutionary technology that brings together
            workout tracking, nutrition monitoring, and cardio analysis for fitness enthusiasts of all levels.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        {/* Mission */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            UltraSync was born from the frustration of fragmented fitness tracking. For too long, fitness enthusiasts
            have been forced to juggle multiple apps—one for workouts, another for nutrition, and yet another for cardio.
            We've created the world's first platform to seamlessly combine all three, ushering in a new era of
            intelligent, unified fitness tracking that actually drives results.
          </p>
        </section>

        {/* The UltraSync Difference */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">The UltraSync Difference</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {differenceCards.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Built for Everyone */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Built for Beginner and Serious Athletes</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            Whether you're a powerlifter tracking 1RM progression, a beginner trying to lose some weight, a runner
            optimizing pace and route efficiency, or a bodybuilder fine-tuning macro ratios, UltraSync provides the
            depth and precision your training deserves.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Technology Stack</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            UltraSync is built on cutting-edge mobile technology to ensure reliability, performance, and seamless
            user experience across all your devices.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech) => (
              <div key={tech.name} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-slate-900">{tech.name}:</span>
                  <span className="text-slate-600 ml-1">{tech.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Training?</h2>
          <p className="text-white/90 mb-8 text-lg">Join thousands of athletes who've made the switch to intelligent fitness tracking.</p>
          <DownloadBadges className="mb-6" />
          <a href="/#features" className="inline-block px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all">
            Explore Features
          </a>
        </section>
      </div>
    </div>
  );
}
