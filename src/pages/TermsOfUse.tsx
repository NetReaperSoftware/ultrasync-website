import { Link } from 'react-router-dom';

export default function TermsOfUse() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-24 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Terms of Use</h1>
          <p className="text-xl text-white/80">
            End User License Agreement for UltraSync. Please read these terms carefully before using the app.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-10 space-y-8 text-slate-600 leading-relaxed">
          <div className="text-sm text-slate-500 font-medium border-b border-slate-200 pb-4">
            Last Updated: January 19, 2025
          </div>

          <TermsSection number="1" title="Acceptance of Terms">
            <p>By downloading, installing, or using the UltraSync mobile application ("App"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, do not use the App.</p>
          </TermsSection>

          <TermsSection number="2" title="Description of Service">
            <p>UltraSync is a fitness tracking and nutrition management application that helps users track their workouts, nutrition, and fitness progress. The App offers both free and premium subscription features.</p>
          </TermsSection>

          <TermsSection number="3" title="Eligibility">
            <p>You must be at least 13 years old to use UltraSync. If you are under 18, you must have your parent or guardian's permission to use the App.</p>
          </TermsSection>

          <TermsSection number="4" title="Account and Registration">
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You agree to provide accurate and complete information during registration</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>
          </TermsSection>

          <TermsSection number="5" title="Premium Subscriptions">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">5.1 Subscription Plans</h4>
                <p>UltraSync offers monthly subscriptions, annual subscriptions, and lifetime access (one-time purchase).</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">5.2 Free Trial</h4>
                <p>New users may be eligible for a 30-day free trial. Your subscription will automatically begin after the trial ends unless you cancel at least 24 hours before the trial expires. Only one free trial per user.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">5.3 Payment and Billing</h4>
                <p>Payment is charged to your Apple ID account. Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period. No refunds for unused portions of a subscription term.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">5.4 Cancellation</h4>
                <p>You may cancel your subscription at any time through your Apple ID Account Settings. You will retain access to premium features until the end of your current subscription period.</p>
              </div>
            </div>
          </TermsSection>

          <TermsSection number="6" title="User Content and Conduct">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">6.1 Your Content</h4>
                <p>You retain ownership of any data you create or upload. You grant UltraSync a license to use, store, and process your content to provide and improve the service.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">6.2 Prohibited Conduct</h4>
                <p>You agree not to use the App for any illegal purpose, attempt to gain unauthorized access, interfere with functionality, upload malicious code, impersonate others, or use the App to spam or harass others.</p>
              </div>
            </div>
          </TermsSection>

          <TermsSection number="7" title="Health and Fitness Disclaimer">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
              <p className="text-amber-800"><strong>Important:</strong> UltraSync is for informational and tracking purposes only. The App does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before starting any fitness or nutrition program.</p>
            </div>
            <p className="mt-4">You assume all risks associated with using the fitness and nutrition information provided by the App. UltraSync is not liable for any injuries, health problems, or damages resulting from your use of the App. Nutritional information is provided by third-party databases and may not be 100% accurate.</p>
          </TermsSection>

          <TermsSection number="8" title="Intellectual Property">
            <p>The App, including its design, features, graphics, and content (excluding user content), is owned by UltraSync. You may not copy, modify, distribute, or reverse engineer the App. The App integrates with third-party services including USDA FoodData Central, FatSecret, and Mapbox, subject to their respective terms.</p>
          </TermsSection>

          <TermsSection number="9" title="Privacy and Data">
            <p>Your use of UltraSync is also governed by our <Link to="/privacy-policy" className="text-teal-600 hover:underline">Privacy Policy</Link>. Key points: we collect account information and fitness data, we use Supabase for secure storage, we do not sell your personal information, and you can request deletion of your data at any time.</p>
          </TermsSection>

          <TermsSection number="10" title="Third-Party Services and Integrations">
            <p>UltraSync integrates with Apple Health (optional, controllable via iOS Settings), location services for GPS cardio tracking (controllable via device settings), and may contain links to third-party websites we are not responsible for.</p>
          </TermsSection>

          <TermsSection number="11" title="Disclaimers and Limitation of Liability">
            <div className="bg-slate-50 p-4 rounded-xl text-sm font-medium text-slate-700 uppercase tracking-wide">
              <p>THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, ULTRASYNC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. ULTRASYNC'S TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</p>
            </div>
          </TermsSection>

          <TermsSection number="12" title="Indemnification">
            <p>You agree to indemnify and hold harmless UltraSync from any claims, damages, losses, liabilities, and expenses arising from your use of the App, violation of these Terms, or violation of any rights of another party.</p>
          </TermsSection>

          <TermsSection number="13" title="Changes to the App and Terms">
            <p>We may modify the App or these Terms at any time. We will notify you of material changes. Continued use of the App after changes constitutes acceptance of the new Terms.</p>
          </TermsSection>

          <TermsSection number="14" title="Termination">
            <p>You may stop using the App and delete your account at any time. We may suspend or terminate your access for violation of these Terms, fraudulent activity, or extended inactivity. Upon termination, your right to use the App will immediately cease.</p>
          </TermsSection>

          <TermsSection number="15" title="Dispute Resolution">
            <p>These Terms are governed by the laws of the United States. Any dispute arising from these Terms shall be resolved through binding arbitration on an individual basis only, not as part of any class or representative action.</p>
          </TermsSection>

          <TermsSection number="16" title="Apple-Specific Terms">
            <p>These Terms are between you and UltraSync only, not with Apple Inc. Apple is not responsible for the App or its content. UltraSync is solely responsible for maintenance, support, warranties, and product claims. Apple and Apple's subsidiaries are third-party beneficiaries of these Terms.</p>
          </TermsSection>

          <TermsSection number="17" title="Contact Information">
            <p><strong>UltraSync Development Team</strong><br />
            Email: <a href="mailto:support@fitsync.app" className="text-teal-600 hover:underline">support@fitsync.app</a></p>
          </TermsSection>

          <div className="border-t border-slate-200 pt-6 text-sm text-slate-500">
            <p className="font-medium text-slate-700">By using UltraSync, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.</p>
            <p className="mt-2">Last Updated: January 19, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TermsSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-3">{number}. {title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
