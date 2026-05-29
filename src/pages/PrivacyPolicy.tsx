export default function PrivacyPolicy() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-24 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-white/80">
            Your privacy and data security are fundamental to how we build UltraSync.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-10 space-y-10 prose prose-slate max-w-none">
          <div className="text-sm text-slate-500 font-medium border-b border-slate-200 pb-4">
            Last Updated: January 19, 2025
          </div>

          <Section title="Introduction">
            <p>UltraSync ("we," "our," or "us") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you use the UltraSync mobile application (the "App").</p>
            <p>By using UltraSync, you agree to the collection and use of information in accordance with this Privacy Policy.</p>
          </Section>

          <Section title="Contact Information">
            <p><strong>UltraSync Development Team</strong><br />Email: <a href="mailto:support@ultrasync.app" className="text-teal-600 hover:underline">support@ultrasync.app</a></p>
          </Section>

          <Section title="Information We Collect">
            <Subsection title="1. Personal Information">
              <ul>
                <li><strong>Date of Birth:</strong> Used for age-related fitness calculations and BMR computations</li>
                <li><strong>Height and Weight:</strong> Used for caloric calculations, BMI calculations, and personalized fitness recommendations</li>
                <li><strong>Gender:</strong> Used for gender-specific metabolic calculations</li>
                <li><strong>Activity Level:</strong> Your self-reported activity level for personalized caloric expenditure calculations</li>
                <li><strong>Fitness Goals:</strong> Your selected fitness objectives (weight loss, muscle gain, etc.)</li>
              </ul>
            </Subsection>
            <Subsection title="2. Health and Fitness Data">
              <ul>
                <li><strong>Step Count Data:</strong> Daily step counts from your device or connected health apps</li>
                <li><strong>Caloric Expenditure:</strong> Calories burned through daily activities and workouts</li>
                <li><strong>Workout Sessions:</strong> Exercise routines, duration, intensity ratings, and performance data</li>
                <li><strong>Nutrition Data:</strong> Food intake, meal logs, and nutritional information</li>
                <li><strong>Body Composition:</strong> Weight tracking and BMI calculations over time</li>
              </ul>
            </Subsection>
            <Subsection title="3. Location Information">
              <p>When you enable location services for cardio tracking features:</p>
              <ul>
                <li><strong>GPS Coordinates:</strong> Real-time location data during outdoor cardio activities</li>
                <li><strong>Route Information:</strong> Path taken during runs, walks, or cycling sessions</li>
                <li><strong>Speed and Pace:</strong> Movement speed calculated from GPS data</li>
              </ul>
            </Subsection>
            <Subsection title="4. Device and Usage Information">
              <ul>
                <li><strong>Device Information:</strong> Device type, operating system version, app version</li>
                <li><strong>Usage Analytics:</strong> App usage patterns, feature interactions, and performance metrics</li>
                <li><strong>Crash Reports:</strong> Technical information to diagnose and fix app issues</li>
              </ul>
            </Subsection>
          </Section>

          <Section title="How We Use Your Information">
            <p>We use your information to provide core functionality, track your progress, generate personalized recommendations, calculate metrics, and sync health data. We may also use it to improve the app, provide technical support, ensure safety and security, and meet legal compliance requirements.</p>
          </Section>

          <Section title="Data Storage and Security">
            <ul>
              <li><strong>Primary Database:</strong> Your data is stored securely using Supabase, a SOC 2 Type 2 certified platform</li>
              <li><strong>Local Storage:</strong> Some data is cached locally on your device for offline functionality</li>
              <li><strong>Encryption:</strong> All data transmissions are encrypted using industry-standard TLS/SSL protocols</li>
              <li><strong>Access Controls:</strong> Role-based access limitations for our development team</li>
            </ul>
          </Section>

          <Section title="Third-Party Services">
            <ul>
              <li><strong>Apple Health Integration:</strong> Syncs health metrics you explicitly authorize. Governed by Apple's Health app privacy policy.</li>
              <li><strong>Google Fit Integration:</strong> Access activity data you specifically authorize. Subject to Google's privacy policies.</li>
              <li><strong>MapBox Services:</strong> GPS and route data during active cardio tracking. Governed by MapBox's privacy policy.</li>
              <li><strong>Supabase Backend:</strong> Secure data storage, authentication, and real-time sync. SOC 2 Type 2 certified.</li>
            </ul>
          </Section>

          <Section title="Data Sharing and Disclosure">
            <p>We <strong>DO NOT</strong> sell, trade, or rent your personal information to third parties. We may disclose information only when required by law, to protect safety, in connection with a business transfer (with notification), with your explicit consent, or to trusted service providers bound by confidentiality agreements.</p>
          </Section>

          <Section title="Your Privacy Rights">
            <p>You have the right to access, correct, delete, and port your personal data, as well as object to or restrict certain processing activities. To exercise these rights, contact us at <a href="mailto:support@ultrasync.app" className="text-teal-600 hover:underline">support@ultrasync.app</a>. We will respond within 30 days.</p>
          </Section>

          <Section title="Data Retention">
            <ul>
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>Health and Fitness Data:</strong> Stored for the duration of your account plus 90 days after deletion</li>
              <li><strong>Location Data:</strong> Automatically deleted after 2 years unless you delete it sooner</li>
              <li><strong>Usage Analytics:</strong> Aggregated data retained for up to 3 years</li>
            </ul>
          </Section>

          <Section title="Children's Privacy (COPPA)">
            <p>UltraSync is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe your child has provided personal information to us, contact us at <a href="mailto:support@ultrasync.app" className="text-teal-600 hover:underline">support@ultrasync.app</a> and we will delete it promptly.</p>
          </Section>

          <Section title="Contact Us">
            <p><strong>Email:</strong> <a href="mailto:support@ultrasync.app" className="text-teal-600 hover:underline">support@ultrasync.app</a><br />
            <strong>Subject Line:</strong> "Privacy Policy Inquiry"<br />
            <strong>Response Time:</strong> We respond to privacy inquiries within 5 business days.</p>
          </Section>

          <div className="border-t border-slate-200 pt-6 text-sm text-slate-500">
            <p><strong>Document Version:</strong> 1.0 &bull; <strong>Effective Date:</strong> January 19, 2025</p>
            <p className="mt-2">By using UltraSync, you acknowledge that you have read, understood, and agree to this Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">{title}</h2>
      <div className="space-y-3 text-slate-600 leading-relaxed">{children}</div>
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <div className="space-y-2 text-slate-600">{children}</div>
    </div>
  );
}
