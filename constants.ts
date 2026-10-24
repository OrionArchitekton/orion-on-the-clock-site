import { ProductData } from './types';

const GITHUB = 'https://github.com/OrionArchitekton/orion-on-the-clock-oss';
const SHOW = 'https://www.youtube.com/@DanMercedeAI';

/**
 * Single source of truth for the orion-on-the-clock microsite.
 *
 * Every claim is grounded in the tool repo (README.md, CHANGELOG.md, docs/ and
 * pyproject.toml as of 0.1.0). Numbers on this page are the repo's own; the
 * cost figure is quoted as the README states it, attributed to the pilot.
 *
 * episode.youtubeId: the 11-character id of a real episode (the product's own
 * output). While it is empty the page renders no episode section at all; the
 * id is filled at launch time (docs/runbooks/release.md).
 */
export const PRODUCT_DATA: ProductData = {
  name: 'orion-on-the-clock',
  tagline:
    'An automated daily YouTube Short that recaps what your AI coding agents did yesterday.',
  origin:
    "It is the pipeline behind Dan's Agents on the Clock on @DanMercedeAI, published as a sanitized copy you can learn from and run yourself.",
  credibility:
    'Open source (MIT) · Fail-closed gate · Private uploads by default · Python 3.11+',
  canonical: 'https://www.danmercede.com/works/orion-on-the-clock/',
  metaDescription:
    'orion-on-the-clock is an MIT-licensed pipeline that turns yesterday’s Claude Code and Codex sessions and merged PRs into a daily YouTube Short, behind a fail-closed gate, uploading privately unless you flip a switch.',

  episode: {
    heading: 'Watch an episode',
    youtubeId: '',
    title: "an episode of Dan's Agents on the Clock",
    disclosure:
      "A real episode of Dan's Agents on the Clock, made from one day of the author's agent work by the working pipeline that orion-on-the-clock is a sanitized copy of. The host voice is an AI clone of the author, made with his consent; an agent's quote is read in that agent's own voice, never a person's.",
    transcript: '',
  },

  problem: {
    heading: 'The problem',
    body:
      'Your agents’ day lives in session logs and merged PRs that nobody outside your terminal sees. Turning it into a public video every morning means turning private logs into public words with nobody watching, where it is easy to ship something you did not mean to: a private repo name, a secret, a quote the agent never wrote, a number nobody counted.',
  },

  whatItDoes: {
    heading: 'What it does',
    body:
      'Every morning a timer runs seven stages, from agent logs to a verified upload. The writer sees only an allowlisted ledger, fourteen fail-closed checks gate its script, your cloned voice reads it, HyperFrames renders a 9:16 Short, and a Studio driver uploads it in your own signed-in Chrome: private by default, public only when you flip a switch.',
  },

  cta: {
    primaryLabel: 'View on GitHub',
    primaryUrl: GITHUB,
    secondaryLabel: 'Watch the show on YouTube',
    secondaryUrl: SHOW,
  },

  // Stage list and wording verified against README.md "How it works" (0.1.0).
  stages: {
    heading: 'How it works',
    intro:
      'One command, python3 -m daily.run, runs the stages in order, records each in status.json, resumes where a run stopped, and holds a lock so two runs never overlap. Every stage after the gate reads the script only through the gate’s verdict.',
    rows: [
      {
        name: 'collect',
        description:
          'Reads one calendar day of Claude Code and Codex session logs, the PRs merged on GitHub and any sources you plug in, then writes the ledger: the allowed items, quote candidates and counts, and nothing else.',
      },
      {
        name: 'write',
        description:
          'Sends the ledger to one headless claude -p call with tools, settings and MCP servers off, and gets back a structured script: cold open, scoreboard, story, steal this, an optional agent confessional and the out.',
      },
      {
        name: 'gate',
        description:
          'Runs fourteen fail-closed checks on the script and writes a verdict bound to the script and the ledger, so text edited after the gate is never voiced, rendered or uploaded.',
      },
      {
        name: 'voice',
        description:
          'Your cloned voice (Chatterbox, from a reference recording you supply) reads the host lines, the agent’s built-in voice reads its quote, and faster-whisper times every word.',
      },
      {
        name: 'render',
        description:
          'Fills a HyperFrames composition (scoreboard, story cards, the confessional card, karaoke captions), mixes the sound to -14 LUFS, renders the 9:16 video and writes a verdict of five checks.',
      },
      {
        name: 'publish',
        description:
          'Re-checks both verdicts against each other and uploads the exact rendered bytes through YouTube Studio in your own signed-in Chrome: private by default, read back and verified either way.',
      },
      {
        name: 'notify',
        description:
          'Sends one item per day and outcome (ready for review, published, quiet, stopped, needs you) to a command you choose, or writes it to the state folder.',
      },
    ],
  },

  // Commands verified against README.md "Quickstart" and docs/runbook.md (0.1.0).
  quickstart: {
    heading: 'Quickstart',
    intro:
      'Start with the text half: it is standard library only, and a dry run works in its own folder without touching the real day’s. Then read ledger.json (what the writer was allowed to see), script.json (what it wrote) and verdict.json (each gate check with its evidence).',
    blocks: [
      {
        title: 'Install and run the tests',
        note: 'Python 3.11+ · fakes only, no network',
        command: [
          'git clone https://github.com/OrionArchitekton/orion-on-the-clock-oss',
          'cd orion-on-the-clock-oss',
          "python3 -m pip install -e '.[dev]'",
          'python3 -m pytest -q',
        ].join('\n'),
      },
      {
        title: 'Copy the example config',
        command: [
          'mkdir -p ~/.config/orion-on-the-clock',
          'cp config.example/* ~/.config/orion-on-the-clock/',
          '# edit settings.toml (time zone, show names, your GitHub owner)',
          '# and lanes.json (which repos may appear)',
        ].join('\n'),
      },
      {
        title: 'Dry run through the gate',
        note: 'needs Claude Code signed in',
        command: 'python3 -m daily.run --day yesterday --until gate --dry',
      },
      {
        title: 'Rehearse the media half, still dry',
        note: 'silence stands in for the voice',
        command: [
          '# set render.kit in settings.toml and fill in voices.json first',
          'python3 -m daily.run --day yesterday --from-stage voice --dry',
        ].join('\n'),
      },
      {
        title: 'Go live, private',
        note: 'after setting channel.id and starting the browser',
        command: [
          'python3 release/studio.py preflight   # proves the browser reaches your Studio',
          'python3 -m daily.run --day yesterday  # a private upload and one item',
        ].join('\n'),
      },
    ],
    outro:
      'The media and release halves also need ffmpeg, Node with HyperFrames, Chatterbox, faster-whisper, Chrome and agent-browser. Nothing is bundled: bring your own media kit and voice reference recording. The README lists the versions it was built with, and the runbook covers the timer.',
  },

  // Grounded in README.md "Safety design, in brief" and docs/safety.md (0.1.0).
  safety: {
    heading: 'Safety design',
    points: [
      {
        title: 'The writer sees only the ledger',
        body:
          'Repos are an allowlist by lane, hard excludes are left out even of the counts, and a session that touched an excluded folder gives no quotes or notes.',
      },
      {
        title: 'Untrusted text stays data',
        body:
          'Agent logs and PR bodies are fenced as data, and the writer runs with every tool disabled. Whatever it writes, the gate judges.',
      },
      {
        title: 'The gate fails closed',
        body:
          'A check passes only on positive evidence. A check that cannot run, crashes or times out fails, and the day stops instead of shipping a guess.',
      },
      {
        title: 'One video per day',
        body:
          'The day is claimed in a receipt and an uploads ledger before the bytes go up, and a save is recorded before it is pressed, so a rerun resumes and never presses twice.',
      },
      {
        title: 'Private by default',
        body:
          'Only "visibility": "public" in publish.json turns public mode on. The driver saves only private or public, never unlisted or scheduled, and proves a public release live before it says so.',
      },
      {
        title: 'Consented voices',
        body:
          'The host’s clone comes only from the recording you name, checked by hash, and an agent never speaks in a person’s voice.',
      },
    ],
  },

  // Quoted from README.md "What it costs to run" (0.1.0).
  costs: {
    heading: 'What it costs to run',
    points: [
      {
        title: 'Money',
        body:
          'Your Claude Code plan covers the writer, and each call is capped by writer.budget_usd (default 2 USD, at most two attempts a day). One pilot day of the original pipeline (two writer attempts) came to about 0.21 USD of notional usage. Everything else is open source and runs on your machine; YouTube uploads are free.',
      },
      {
        title: 'Time',
        body:
          'Collect, write and gate take a minute or two. Voicing takes a few minutes with a GPU and about an hour on a CPU; Whisper and the render add a few minutes more, and the upload and its checks a few more.',
      },
      {
        title: 'Attention',
        body:
          'In private mode, one look and one tap a day in YouTube Studio, plus whatever a stop asks of you. The runbook lists every needs-you code and what it means.',
      },
    ],
  },

  links: [
    { label: 'GitHub repository', url: GITHUB, primary: true },
    { label: "Dan's Agents on the Clock on YouTube", url: SHOW, primary: true },
    { label: 'orion-browser', url: 'https://www.danmercede.com/works/orion-browser/' },
    { label: 'orion-pm', url: 'https://www.danmercede.com/works/orion-pm/' },
    { label: 'Dan Mercede', url: 'https://www.danmercede.com' },
  ],

  footerNote: "MIT licensed. Built by Dan Mercede's agents (Claude Code and Codex).",
};
