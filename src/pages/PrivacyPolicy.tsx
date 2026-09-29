import MarkdownDocument from '../components/MarkdownDocument';
// Source of truth: edit PRIVACY_POLICY.md at the repo root, not this page
import policy from '../../PRIVACY_POLICY.md?raw';

export default function PrivacyPolicy() {
  return (
    <MarkdownDocument
      title="Privacy Policy"
      subtitle="Your privacy and data security are fundamental to how we build UltraSync."
      markdown={policy}
    />
  );
}
