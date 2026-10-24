import React, { useEffect, useRef, useState } from 'react';
import type { Episode } from './types';

// The demo is a real episode, embedded from YouTube (docs/runbooks/release.md).
//
// A click-to-load facade: at rest the page carries only a local poster and a
// play button, so a page view that never plays makes no request to YouTube.
// Pressing play swaps in the player from YouTube's privacy-enhanced host. A
// "Watch on YouTube" link covers readers without JavaScript and crawlers.
//
// Fail closed: an empty or malformed id renders nothing at all, never a frame
// with a broken URL. The first render is always the facade, and nothing here
// reads window or document while rendering, so the build-time body bake and the
// browser's first render match.

export const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
export const YOUTUBE_EMBED_ORIGIN = 'https://www.youtube-nocookie.com';
const YOUTUBE_WATCH_ORIGIN = 'https://www.youtube.com';

export const isYouTubeId = (id: unknown): id is string =>
  typeof id === 'string' && YOUTUBE_ID_PATTERN.test(id);

const PlayIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" focusable="false">
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </svg>
);

export const EpisodeVideo: React.FC<{ episode: Episode }> = ({ episode }) => {
  const { youtubeId, heading, title, disclosure, transcript } = episode;
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // The pressed button is gone after the swap; hand focus to the live player.
  useEffect(() => {
    if (playing) frameRef.current?.focus();
  }, [playing]);

  if (!isYouTubeId(youtubeId)) return null;

  return (
    <section id="episode" aria-labelledby="episode-title" className="mt-10">
      <h2 id="episode-title" className="text-lg font-semibold mb-3">
        {heading}
      </h2>
      <div className="sm:flex sm:items-start sm:gap-8">
        <div className="relative mx-auto sm:mx-0 w-full max-w-[300px] shrink-0 aspect-[9/16] overflow-hidden rounded-xl bg-[#020B29]">
          {playing ? (
            <iframe
              ref={frameRef}
              src={`${YOUTUBE_EMBED_ORIGIN}/embed/${youtubeId}?autoplay=1&rel=0`}
              title={`Video: ${title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play video: ${title}`}
              className="group absolute inset-0 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#07143A] via-[#020B29] to-[#020B29] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-copper"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400">
                Daily YouTube Short
              </span>
              <span
                aria-hidden="true"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-copper text-[#020B29] shadow-lg shadow-black/40 transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110"
              >
                <PlayIcon />
              </span>
              <span className="px-6 text-center text-sm font-medium">Play the episode</span>
            </button>
          )}
        </div>
        <div className="mt-4 sm:mt-0 text-sm text-neutral-600 leading-relaxed">
          <p>{disclosure}</p>
          <p className="mt-3">
            Pressing play loads YouTube’s player from youtube-nocookie.com, its privacy-enhanced mode.
          </p>
          <p className="mt-3">
            <a
              href={`${YOUTUBE_WATCH_ORIGIN}/shorts/${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-900 underline underline-offset-4 hover:text-copper-dark"
            >
              Watch on YouTube
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
          {transcript ? (
            <details className="mt-3">
              <summary className="cursor-pointer text-neutral-900 underline underline-offset-4">
                Read the transcript
              </summary>
              <p className="mt-3">{transcript}</p>
            </details>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default EpisodeVideo;
