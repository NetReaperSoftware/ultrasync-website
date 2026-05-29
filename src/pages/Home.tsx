import {
  Activity, Apple, Zap, TrendingUp, Smartphone, Cloud, ChevronDown, Star, Play,
} from 'lucide-react';
import DownloadBadges from '../components/DownloadBadges';

const APP_STORE_URL = 'https://apps.apple.com/us/app/ultrasync-fitness-tracker/id6749923790';

const features = [
  {
    icon: Activity,
    title: 'Muscle Mapping',
    description: 'Visualize your progress with detailed muscle group tracking and interactive anatomical insights.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Apple,
    title: 'Nutrition Tracking',
    description: 'Log meals, track macros, and get personalized nutrition recommendations powered by AI.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Activity,
    title: 'Cardio Monitoring',
    description: 'Track runs, rides, and workouts with GPS mapping and real-time performance analytics.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Beautiful charts and insights to visualize your fitness journey and celebrate milestones.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Smartphone,
    title: 'HealthKit Integration',
    description: 'Seamlessly sync with Apple Health and other health platforms for unified tracking.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: Cloud,
    title: 'Cloud Sync',
    description: 'Access your data anywhere with real-time cloud synchronization and offline support.',
    gradient: 'from-indigo-500 to-blue-500',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Marathon Runner',
    content: 'UltraSync transformed how I track my training. The cardio monitoring and progress analytics are game-changers.',
    rating: 5,
  },
  {
    name: 'Marcus Williams',
    role: 'Fitness Enthusiast',
    content: 'The muscle mapping feature helped me identify and fix imbalances in my workout routine. Incredible app!',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Nutrition Coach',
    content: 'Finally an app that combines workout tracking with comprehensive nutrition logging. My clients love it.',
    rating: 5,
  },
];

export default function Home() {

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-teal-400/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 animate-slide-up">
            <Zap className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-slate-700">Revolutionary Fitness Platform</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 animate-slide-up animation-delay-100">
            Track. Fuel.
            <span className="block bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Transform.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            The all-in-one fitness platform that intelligently syncs your workouts, nutrition, and health data
            into one seamless experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up animation-delay-300">
            <button
              onClick={scrollToFeatures}
              className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              See Features
            </button>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200"
            >
              Download Free
            </a>
          </div>

          {/* App Preview */}
          <div className="relative animate-slide-up animation-delay-400">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 blur-3xl transform scale-95"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl p-8 max-w-md mx-auto border border-slate-700/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-slate-400 text-sm">Today's Progress</p>
                    <p className="text-3xl font-bold text-white">78%</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-teal-400" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Workout</span>
                        <span className="text-teal-400">Complete</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Apple className="w-5 h-5 text-green-400" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Nutrition</span>
                        <span className="text-green-400">1,840 cal</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full w-4/5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={scrollToFeatures}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 hover:text-slate-600 transition-colors animate-bounce"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need to
              <span className="block bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful features designed to help you achieve your fitness goals smarter, not harder.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title + index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '500K+', label: 'Active Users' },
              { number: '12M+', label: 'Workouts Tracked' },
              { number: '98%', label: 'Satisfaction Rate' },
              { number: '4.9', label: 'App Store Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Loved by
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent"> Fitness Enthusiasts</span>
            </h2>
            <p className="text-xl text-slate-600">See what our community has to say about UltraSync</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-24 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Ready to Transform Your Fitness?</h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Download UltraSync today and join thousands of users achieving their fitness goals.
          </p>

          <DownloadBadges />
        </div>
      </section>
    </>
  );
}
