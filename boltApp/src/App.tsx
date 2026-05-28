import { useState, useEffect } from 'react';
import {
  Activity,
  Apple,
  Zap,
  TrendingUp,
  Smartphone,
  Cloud,
  ChevronDown,
  Star,
  Menu,
  X,
  Play,
} from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center ${scrolled ? '' : 'shadow-lg'}`}>
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                UltraSync
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={`transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-600 hover:text-slate-900'} font-medium`}>
                Features
              </a>
              <a href="#testimonials" className={`transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-600 hover:text-slate-900'} font-medium`}>
                Testimonials
              </a>
              <a href="#download" className={`transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-600 hover:text-slate-900'} font-medium`}>
                Download
              </a>
              <button className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 transform hover:-translate-y-0.5">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white rounded-2xl shadow-xl mt-2 p-4 animate-fade-in">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium py-2">
                  Features
                </a>
                <a href="#testimonials" className="text-slate-600 hover:text-slate-900 font-medium py-2">
                  Testimonials
                </a>
                <a href="#download" className="text-slate-600 hover:text-slate-900 font-medium py-2">
                  Download
                </a>
                <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background */}
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
            <button className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
            <button className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200">
              Download Free
            </button>
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
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                key={feature.title}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100"
                style={{ animationDelay: `${index * 100}ms` }}
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
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '500K+', label: 'Active Users' },
              { number: '12M+', label: 'Workouts Tracked' },
              { number: '98%', label: 'Satisfaction Rate' },
              { number: '4.9', label: 'App Store Rating' },
            ].map((stat, index) => (
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
            <p className="text-xl text-slate-600">
              See what our community has to say about UltraSync
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Fitness?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Download UltraSync today and join thousands of users achieving their fitness goals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#"
                className="flex items-center gap-3 px-8 py-4 bg-black rounded-xl hover:bg-slate-900 transition-colors duration-300 shadow-xl group"
              >
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-slate-400">Download on the</div>
                  <div className="text-lg font-semibold text-white">App Store</div>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 px-8 py-4 bg-black rounded-xl hover:bg-slate-900 transition-colors duration-300 shadow-xl group"
              >
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,13.06L16.81,15.12M20.16,10.85C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.15L17.89,14.45L15.39,12L17.89,9.55L20.16,10.85M6.05,2.66L16.81,8.88L14.54,10.94L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-slate-400">Get it on</div>
                  <div className="text-lg font-semibold text-white">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">UltraSync</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                The revolutionary all-in-one fitness platform for tracking workouts, nutrition, and health.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#download" className="text-slate-400 hover:text-white transition-colors">Download</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © 2024 UltraSync. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.014-.611 1.794-1.574 2.163-2.723-.951.554-2.005.959-3.127 1.184-.896-.907-2.178-1.455-3.472-1.455-2.631 0-4.755 2.153-4.755 4.808 0 .376.041.741.122 1.09-3.95-.198-7.453-2.095-9.803-4.976-.424.727-.667 1.57-.667 2.476 0 1.709.87 3.217 2.188 4.1-.807-.025-1.566-.246-2.228-.615v.064c0 2.387 1.704 4.378 3.962 4.832-.414.113-.851.173-1.304.173-.32 0-.633-.03-.939-.086.633 1.974 2.476 3.411 4.657 3.453-1.707 1.34-3.856 2.139-6.193 2.139-.403 0-.802-.024-1.192-.069 2.209 1.414 4.835 2.239 7.662 2.239 9.199 0 14.227-7.612 14.227-14.227 0-.217-.005-.434-.014-.649.977-.704 1.823-1.583 2.494-2.586z"/></svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"/></svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
