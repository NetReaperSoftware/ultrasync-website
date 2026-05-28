import { Link } from 'react-router-dom';
import DownloadBadges from '../components/DownloadBadges';

const storySections = [
  {
    title: 'The Fitness Journey',
    content: 'Like many fitness enthusiasts, I found myself juggling multiple apps, spreadsheets, and tools to track my workouts, nutrition, and progress. I was spending more time managing my data than actually training. This fragmented approach made it nearly impossible to see the bigger picture of my fitness journey.',
  },
  {
    title: 'The Eureka Moment',
    content: 'After yet another frustrating session trying to correlate my workout data with my nutrition logs, I realized there had to be a better way. What if there was one platform that could intelligently connect all aspects of fitness - strength training, cardio, nutrition, and recovery - while providing actionable insights?',
  },
  {
    title: 'Building the Solution',
    content: 'As a software developer, I had the skills to turn this vision into reality. I started building UltraSync with a simple goal: create the fitness app I wished existed. Every feature was born from real-world needs, tested through my own fitness journey, and refined based on genuine use cases.',
  },
];

const philosophy = [
  {
    icon: '🎯',
    title: 'Purpose-Driven Development',
    description: 'Every line of code serves a real purpose. I don\'t build features for the sake of features - only tools that genuinely improve the fitness experience.',
  },
  {
    icon: '🔬',
    title: 'Science-Based Approach',
    description: 'Fitness advice and algorithms are grounded in exercise science, not trends. I believe in evidence-based training and nutrition principles.',
  },
  {
    icon: '👥',
    title: 'User-Centric Design',
    description: 'The best technology is invisible. UltraSync is designed to get out of your way and let you focus on what matters - your fitness goals.',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'Your health data belongs to you. Period. I\'ve built UltraSync with privacy and data security as foundational principles, not afterthoughts.',
  },
];

const background = [
  {
    title: 'Technical Background',
    description: 'Software developer with expertise in mobile app development, backend systems, and data analytics. Passionate about creating efficient, scalable applications that solve real problems.',
  },
  {
    title: 'Fitness Experience',
    description: 'Years of personal experience in strength training, endurance sports, and nutrition. I understand the challenges of tracking progress and staying motivated because I\'ve lived them.',
  },
  {
    title: 'Data-Driven Mindset',
    description: 'Strong believer in the power of data to drive decisions. UltraSync\'s analytics and insights features are built from my own need to understand patterns and optimize performance.',
  },
];

const futureFeatures = [
  { title: 'AI-Powered Coaching', detail: 'Intelligent workout suggestions based on your progress patterns' },
  { title: 'Advanced Analytics', detail: 'Deeper insights into performance trends and optimization opportunities' },
  { title: 'Community Features', detail: 'Connect with like-minded fitness enthusiasts while maintaining privacy' },
  { title: 'Wearable Integration', detail: 'Seamless connection with all major fitness devices and apps' },
];

export default function AboutCreator() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-24 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">About The Creator</h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Meet the developer behind UltraSync - passionate about fitness, technology, and building tools
            that make a real difference in people's lives.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        {/* Profile Intro */}
        <section className="flex flex-col sm:flex-row items-start gap-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-4xl flex-shrink-0">
            👨‍💻
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-1">Hi, I'm Daniel</h2>
            <p className="text-teal-600 font-semibold mb-4">Founder & Developer of UltraSync</p>
            <p className="text-lg text-slate-600 leading-relaxed">
              I'm a passionate software developer and fitness enthusiast who believes technology should enhance,
              not complicate, our fitness journeys. UltraSync was born from my own frustration with fragmented
              fitness tracking and the desire to create something truly comprehensive.
            </p>
          </div>
        </section>

        {/* My Story */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">My Story</h2>
          <div className="space-y-6">
            {storySections.map((section) => (
              <div key={section.title} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h3>
                <p className="text-slate-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">My Philosophy</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {philosophy.map((item) => (
              <div key={item.title} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-100">
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Background */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Background & Expertise</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {background.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vision */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Vision for UltraSync</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            My goal isn't just to create another fitness app - it's to revolutionize how everyone approaches
            fitness tracking. I envision UltraSync as the world's first truly unified platform where workout
            tracking, nutrition monitoring, and cardio analysis seamlessly connect for fitness enthusiasts of all levels.
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">What's Next</h3>
            <div className="space-y-4">
              {futureFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-slate-900">{feature.title}:</span>
                    <span className="text-slate-600 ml-1">{feature.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-slate-50 rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Get In Touch</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            I love hearing from UltraSync users! Whether you have feedback, feature requests, or just want
            to share your fitness journey, I'm always excited to connect with fellow fitness enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@fitsync.app"
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold text-center hover:shadow-lg transition-all"
            >
              Email Me
            </a>
            <Link
              to="/contact"
              className="px-8 py-3 border-2 border-teal-500 text-teal-600 rounded-full font-semibold text-center hover:bg-teal-50 transition-all"
            >
              Send Feedback
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join the UltraSync Community</h2>
          <p className="text-white/90 mb-8 text-lg">
            Ready to experience fitness tracking the way it should be?
          </p>
          <DownloadBadges />
        </section>
      </div>
    </div>
  );
}
