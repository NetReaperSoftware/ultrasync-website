import MarkdownDocument from '../components/MarkdownDocument';
// Source of truth: edit TERMS_OF_USE.md at the repo root, not this page
import terms from '../../TERMS_OF_USE.md?raw';

export default function TermsOfUse() {
  return (
    <MarkdownDocument
      title="Terms of Use"
      subtitle="End User License Agreement for UltraSync. Please read these terms carefully before using the app."
      markdown={terms}
    />
  );
}
