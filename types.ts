export interface Link {
  label: string;
  url: string;
  primary?: boolean;
}

export interface StageRow {
  /** The pipeline stage, e.g. "collect". */
  name: string;
  /** What the stage does and the file it writes. */
  description: string;
}

export interface Episode {
  heading: string;
  /**
   * The 11-character YouTube id of a real episode (the product's own output).
   * Empty means the page renders no episode section at all.
   */
  youtubeId: string;
  /** Accessible name of the player, e.g. "an episode of Dan's Agents on the Clock". */
  title: string;
  /** Provenance and voice disclosure shown under the player. */
  disclosure: string;
  /** Optional readable transcript; empty renders no transcript toggle. */
  transcript: string;
}

export interface ProductData {
  name: string;
  tagline: string;
  /** One line on where the pipeline comes from. */
  origin: string;
  credibility: string;
  /** Canonical URL of this microsite. */
  canonical: string;
  /** SEO meta description. */
  metaDescription: string;
  episode: Episode;
  problem: {
    heading: string;
    body: string;
  };
  whatItDoes: {
    heading: string;
    body: string;
  };
  cta: {
    primaryLabel: string;
    primaryUrl: string;
    secondaryLabel: string;
    secondaryUrl: string;
  };
  stages: {
    heading: string;
    intro: string;
    rows: StageRow[];
  };
  quickstart: {
    heading: string;
    intro: string;
    /** Each block is a titled, copy-pasteable command snippet. */
    blocks: { title: string; note?: string; command: string }[];
    outro: string;
  };
  safety: {
    heading: string;
    points: { title: string; body: string }[];
  };
  costs: {
    heading: string;
    points: { title: string; body: string }[];
  };
  links: Link[];
  footerNote: string;
}
