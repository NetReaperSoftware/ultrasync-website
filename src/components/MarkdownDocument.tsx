import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';

// Styles for the rendered Markdown, matching the site's legal pages. The
// document's own H1 is dropped because the page hero already shows the title.
const components: Components = {
  h1: () => null,
  h2: ({ children }) => <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-slate-600 leading-relaxed mb-3">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 space-y-1.5 text-slate-600 mb-3">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1.5 text-slate-600 mb-3">{children}</ol>,
  strong: ({ children }) => <strong className="font-semibold text-slate-800">{children}</strong>,
  code: ({ children }) => <code className="text-sm bg-slate-100 text-slate-800 rounded px-1.5 py-0.5 break-all">{children}</code>,
  hr: () =><hr className="border-slate-200 my-8" />,
  a: ({ href, children }) => {
    // Site pages go through the router so they don't reload the app
    if (href?.startsWith('/')) {
      return <Link to={href} className="text-teal-600 hover:underline">{children}</Link>;
    }
    const external = href?.startsWith('http');
    return (
      <a
        href={href}
        className="text-teal-600 hover:underline break-words"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  },
};

interface Props {
  title: string;
  subtitle: string;
  // Raw Markdown, imported with Vite's ?raw suffix
  markdown: string;
}

export default function MarkdownDocument({ title, subtitle, markdown }: Props) {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-24 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">{title}</h1>
          <p className="text-xl text-white/80">{subtitle}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-10">
          <Markdown remarkPlugins={[remarkGfm]} components={components}>
            {markdown}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
