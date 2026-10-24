import React, { useState, useEffect } from 'react';
import { PRODUCT_DATA } from './constants';
import EpisodeVideo from './EpisodeVideo';

const SectionTitle: React.FC<{ index: string; title: string }> = ({ index, title }) => (
  <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-mono mb-4 mt-12 border-b border-neutral-200 pb-2">
    <span aria-hidden="true" className="text-copper-dark">{index} // </span>
    {title}
  </h2>
);

/** Copy-pasteable command block with a copy button (no-JS safe: renders plain text). */
const CommandBlock: React.FC<{ title: string; note?: string; command: string }> = ({
  title,
  note,
  command,
}) => {
  const [copied, setCopied] = useState(false);

  const [copyReady, setCopyReady] = useState(false);
  useEffect(() => setCopyReady(Boolean(navigator.clipboard)), []);

  const copy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(command).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      });
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-3 mb-2">
        <span className="text-sm font-medium text-neutral-900">{title}</span>
        {note && <span className="font-mono text-[11px] text-neutral-500">{note}</span>}
      </div>
      <div className="relative group">
        <pre className="bg-neutral-900 text-neutral-100 rounded-md p-4 pr-16 overflow-x-auto font-mono text-[13px] leading-relaxed">
          <code>{command}</code>
        </pre>
        <button
          onClick={copy}
          disabled={!copyReady}
          className="no-print absolute top-2 right-2 text-[10px] uppercase tracking-wider font-mono text-neutral-400 hover:text-white bg-neutral-900/70 backdrop-blur-sm border border-neutral-700 hover:border-neutral-400 rounded px-2 py-1 transition-colors"
          aria-label={`Copy command: ${title}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const {
    name,
    tagline,
    origin,
    credibility,
    episode,
    problem,
    whatItDoes,
    cta,
    stages,
    quickstart,
    safety,
    costs,
    links,
    footerNote,
  } = PRODUCT_DATA;

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Skip link: visually hidden until keyboard-focused, then jumps to main content (a11y parity with the body-bake). */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:rounded focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:no-underline"
      >
        Skip to main content
      </a>

      <main id="main-content" tabIndex={-1} className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* 1. Hero */}
        <header className="mb-4">
          <div className="font-mono text-xs text-neutral-500 mb-3">OPEN SOURCE · MIT</div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-neutral-900 mb-4 font-mono break-words">
            {name}
          </h1>
          <p className="text-lg md:text-xl text-neutral-700 font-light mb-4 max-w-2xl">
            {tagline}
          </p>
          <p className="text-base text-neutral-700 mb-4 max-w-2xl">{origin}</p>
          <p className="text-sm text-neutral-500 mb-8">{credibility}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={cta.primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-copper-dark px-5 py-2.5 text-sm font-medium text-white hover:bg-copper-deep transition-colors"
            >
              {cta.primaryLabel}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={cta.secondaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-900 hover:text-copper-dark hover:border-copper-dark transition-colors"
            >
              {cta.secondaryLabel}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </header>

        {/* Real episode, embedded from YouTube; renders nothing while the id is empty. */}
        <EpisodeVideo episode={episode} />

        {/* 2. The problem */}
        <section>
          <SectionTitle index="01" title={problem.heading} />
          <p className="text-base text-neutral-700 leading-relaxed max-w-2xl">{problem.body}</p>
          <p className="text-base text-neutral-900 leading-relaxed max-w-2xl mt-4 font-medium">
            {whatItDoes.body}
          </p>
        </section>

        {/* 3. How it works */}
        <section>
          <SectionTitle index="02" title={stages.heading} />
          <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl mb-6">{stages.intro}</p>
          <ol className="space-y-4">
            {stages.rows.map((stage, idx) => (
              <li key={stage.name} className="flex flex-col sm:flex-row sm:gap-6">
                <span className="font-mono text-sm text-neutral-900 font-medium w-32 shrink-0">
                  <span aria-hidden="true" className="text-copper-dark">{idx + 1}. </span>
                  {stage.name}
                </span>
                <span className="text-sm text-neutral-600 leading-relaxed">{stage.description}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* 4. Quickstart */}
        <section>
          <SectionTitle index="03" title={quickstart.heading} />
          <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl mb-6">
            {quickstart.intro}
          </p>
          {quickstart.blocks.map((block) => (
            <CommandBlock
              key={block.title}
              title={block.title}
              note={block.note}
              command={block.command}
            />
          ))}
          <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">{quickstart.outro}</p>
        </section>

        {/* 5. Safety design */}
        <section>
          <SectionTitle index="04" title={safety.heading} />
          <div className="grid sm:grid-cols-2 gap-6">
            {safety.points.map((point) => (
              <div key={point.title}>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">{point.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. What it costs */}
        <section>
          <SectionTitle index="05" title={costs.heading} />
          <dl className="space-y-4">
            {costs.points.map((point) => (
              <div key={point.title} className="flex flex-col sm:flex-row sm:gap-6">
                <dt className="font-mono text-sm text-neutral-900 font-medium w-32 shrink-0">
                  {point.title}
                </dt>
                <dd className="text-sm text-neutral-600 leading-relaxed">{point.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 7. Footer */}
        <footer className="mt-20 pt-8 border-t border-neutral-100 flex flex-col gap-4 text-xs text-neutral-500 font-mono">
          <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-x-6">
            {links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-700 underline decoration-1 decoration-neutral-300 hover:decoration-copper-dark underline-offset-4 transition-all"
                >
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <p>{footerNote}</p>
            <p suppressHydrationWarning>&copy; {new Date().getFullYear()} Dan Mercede</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
