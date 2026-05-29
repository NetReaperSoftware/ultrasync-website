import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string | string[];
  highlight?: string;
  category: string;
};

const faqData: FAQItem[] = [
  {
    category: 'nutrition',
    question: 'How does UltraSync\'s calorie tracking work?',
    answer: ['Barcode Scanning: Instantly log packaged foods by scanning barcodes', 'Extensive Food Database: Search from thousands of foods and restaurant items', 'Custom Foods: Add your own recipes and custom meal entries', 'Macro Breakdown: Track proteins, carbs, fats, and micronutrients', 'Smart Suggestions: AI-powered meal recommendations based on your goals'],
    highlight: 'UltraSync automatically calculates your daily calorie needs based on your activity level, goals, and HealthKit data integration.',
  },
  {
    category: 'nutrition',
    question: 'Can I track macros and not just calories?',
    answer: ['Protein, Carbohydrates, and Fat percentages', 'Fiber, Sugar, and Sodium monitoring', 'Custom macro ratio targets (e.g., 40/30/30 split)', 'Visual progress charts and daily breakdowns', 'Integration with your fitness goals (bulking, cutting, maintenance)'],
  },
  {
    category: 'nutrition',
    question: 'Does UltraSync work offline for food logging?',
    answer: ['Cache your frequently used foods for offline access', 'Log meals without internet connection', 'Automatic sync when connection is restored', 'Optimistic updates ensure smooth user experience'],
  },
  {
    category: 'workouts',
    question: 'How does workout tracking work in UltraSync?',
    answer: ['Exercise Database: Over 1000+ exercises with proper form instructions', 'Muscle Mapping: Visual representation of which muscles you\'re targeting', 'Progress Tracking: Track sets, reps, weight, and rest periods', 'Routine Templates: Create and save custom workout routines', 'Volume Analytics: Monitor training volume and progressive overload'],
    highlight: 'UltraSync\'s interactive muscle mapping shows exactly which muscle groups you\'ve trained and suggests balanced workout plans.',
  },
  {
    category: 'workouts',
    question: 'Can I create custom workout routines?',
    answer: ['Build routines from scratch or use our templates', 'Set custom rest periods between exercises', 'Add supersets and circuit training', 'Schedule routines for specific days', 'Share routines with friends or trainers'],
  },
  {
    category: 'workouts',
    question: 'How does the progressive overload tracking work?',
    answer: ['Monitor weight increases over time', 'Track total training volume per muscle group', 'Get suggestions for when to increase weight or reps', 'Visual charts showing strength gains', 'Personal record notifications and celebrations'],
  },
  {
    category: 'cardio',
    question: 'Does UltraSync track running and cardio workouts?',
    answer: ['GPS Route Tracking: Real-time location tracking for outdoor activities', 'Live Metrics: Pace, distance, calories burned, and duration', 'Background Tracking: Continues tracking even when app is closed', 'Route Visualization: View your routes on detailed maps', 'HealthKit Integration: Syncs with Apple Health automatically'],
    highlight: 'UltraSync uses professional-grade GPS filtering for accurate distance measurement, matching the precision of dedicated running apps.',
  },
  {
    category: 'cardio',
    question: 'Can I track indoor cardio workouts?',
    answer: ['Treadmill, elliptical, and stationary bike workouts', 'Manual time and calorie entry (Coming Soon!)', 'HIIT and interval training templates'],
  },
  {
    category: 'healthkit',
    question: 'How does UltraSync integrate with Apple HealthKit?',
    answer: ['Automatic Syncing: Weight, steps, and activity data sync automatically', 'Background Updates: Data updates even when app is closed', 'Two-Way Sync: Reads from and writes to HealthKit', 'Comprehensive Metrics: Calories, workouts, body measurements, and more', 'Privacy First: You control exactly which data to share'],
  },
  {
    category: 'healthkit',
    question: 'Does UltraSync work with fitness wearables?',
    answer: ['Apple Watch (native integration)', 'Any device that syncs with Apple Health', 'Heart rate monitors and fitness trackers', 'Smart scales for automatic weight tracking'],
  },
  {
    category: 'security',
    question: 'Is my data secure and private in UltraSync?',
    answer: ['Encrypted Storage: All data is encrypted both in transit and at rest', 'Privacy by Design: Minimal data collection, only what\'s necessary', 'No Data Selling: We never sell or share your personal information', 'User Control: Delete your data anytime', 'GDPR Compliant: Meets international privacy standards'],
  },
  {
    category: 'general',
    question: 'Does UltraSync work offline?',
    answer: ['Log workouts and meals without internet', 'Access previously cached food database', 'GPS tracking works completely offline', 'Data syncs automatically when connection returns', 'Optimistic updates for smooth user experience'],
  },
  {
    category: 'general',
    question: 'Is UltraSync free to use?',
    answer: ['Free Features: Basic workout and food tracking, HealthKit sync', 'Premium Features: Advanced analytics, unlimited custom routines, detailed reports', 'No Ads: Clean, distraction-free experience', 'Fair Pricing: Affordable subscription with real value'],
  },
  {
    category: 'general',
    question: 'Can I export my data from UltraSync?',
    answer: ['Export workout history as CSV/JSON (Coming Soon)', 'Download food logs and nutrition data', 'Access raw GPS/route data', 'Full data backup capabilities'],
  },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'workouts', label: 'Workouts' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'healthkit', label: 'HealthKit' },
  { id: 'security', label: 'Security' },
  { id: 'general', label: 'General' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return faqData.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = !q || item.question.toLowerCase().includes(q) ||
        (Array.isArray(item.answer) ? item.answer.join(' ').toLowerCase().includes(q) : item.answer.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-500 to-cyan-600 py-24 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-white/90">Everything you need to know about UltraSync's features and functionality</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for questions..."
              value={search}
              onChange={e => { setSearch(e.target.value); setOpenIndex(null); }}
              className="w-full px-6 py-4 pr-12 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 text-lg"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenIndex(null); }}
              className={`px-5 py-2 rounded-full font-medium border-2 transition-all ${
                activeCategory === cat.id
                  ? 'border-teal-500 bg-teal-500 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-teal-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="text-slate-500 mb-6">{filtered.length} question{filtered.length !== 1 ? 's' : ''} found</p>

        {/* FAQ Items */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-xl font-medium mb-2">No results found</p>
            <p>Try adjusting your search terms or selecting a different category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <button
                  className="w-full text-left px-8 py-6 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-semibold text-slate-900 text-lg">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-teal-500 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-8 pb-8">
                    {Array.isArray(item.answer) ? (
                      <ul className="space-y-2">
                        {item.answer.map((line, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-600">{item.answer}</p>
                    )}
                    {item.highlight && (
                      <div className="mt-4 bg-teal-50 border-l-4 border-teal-500 rounded-r-xl p-4">
                        <p className="text-teal-800 text-sm"><strong>Pro Tip:</strong> {item.highlight}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl p-10 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
          <p className="text-white/90 mb-6">Our support team is here to help</p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-teal-600 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
