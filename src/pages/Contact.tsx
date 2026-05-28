import { useState } from 'react';

const supportCards = [
  { icon: '📧', title: 'Email Support', description: 'For technical issues and account support', contact: 'support@fitsync.app' },
  { icon: '💡', title: 'Feature Requests', description: 'Have an idea to make UltraSync better?', contact: 'support@fitsync.app' },
  { icon: '🐛', title: 'Bug Reports', description: 'Found a bug? Help us fix it quickly', contact: 'support@fitsync.app' },
];

const quickHelp = [
  { q: 'HealthKit not syncing?', a: 'Check permissions in Settings > Privacy & Security > Health' },
  { q: 'GPS tracking issues?', a: 'Ensure location permissions are set to "Always" for UltraSync' },
  { q: 'Data not backing up?', a: 'Verify your internet connection and try manual sync' },
];

const responseTimes = [
  { type: 'Technical Support', time: 'Within 24 hours' },
  { type: 'Bug Reports', time: 'Within 12 hours' },
  { type: 'General Inquiries', time: 'Within 48 hours' },
  { type: 'Feature Requests', time: 'Within 1 week' },
];

type FormData = { name: string; email: string; subject: string; message: string };

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectLine = encodeURIComponent(`[${formData.subject || 'General'}] UltraSync Contact`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
    window.location.href = `mailto:support@fitsync.app?subject=${subjectLine}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 py-24 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Have questions about UltraSync? Need technical support? Want to share feedback?
            We're here to help you optimize your fitness journey.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h2>
            {submitted ? (
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-teal-800 mb-2">Message Prepared!</h3>
                <p className="text-teal-700">Your email client should have opened. If not, email us directly at <a href="mailto:support@fitsync.app" className="underline">support@fitsync.app</a></p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={e => setFormData(f => ({ ...f, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select a topic</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Account Help">Account Help</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Support Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Support Information</h2>

            <div className="space-y-4">
              {supportCards.map((card) => (
                <div key={card.title} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{card.icon}</span>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{card.title}</h3>
                      <p className="text-slate-500 text-sm mb-2">{card.description}</p>
                      <a href={`mailto:${card.contact}`} className="text-teal-600 font-medium hover:underline text-sm">
                        {card.contact}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Quick Help</h3>
              <div className="space-y-4">
                {quickHelp.map((item) => (
                  <div key={item.q}>
                    <p className="font-medium text-slate-800 text-sm">{item.q}</p>
                    <p className="text-slate-500 text-sm mt-1">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Response Times */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Response Times</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {responseTimes.map((item) => (
              <div key={item.type} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center">
                <div className="font-semibold text-slate-900 mb-2">{item.type}</div>
                <div className="text-teal-600 font-bold">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
