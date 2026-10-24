---
verified: 2026-10-23
review_after: 2027-01-23
topics: [orion-on-the-clock, product-page, release, product-demo]
references: [vite.config.ts, vercel.json, constants.ts, index.html, EpisodeVideo.tsx, tests/build.test.mjs]
---

# Product page release

## Build and check

Run `npm ci`, `npm run build` and `npm test`. The build runs the built-output tests:
canonical and social URLs on the Works path, no `robots.txt` or `sitemap.xml`, no
long dashes, the copy controls, and the episode section (absent while the id is
empty; with an id, a click-to-load player and its disclosure). Inspect desktop and
mobile layouts. The social image is 1200 by 630 pixels.

## Demo provenance

The demo is a real episode: the product's own output, embedded from YouTube. No
media file ships with this site and no demo is rendered for it.

- Source: the daily episode of "Dan's Agents on the Clock" on @DanMercedeAI, made
  from one day of the author's agent work by the working pipeline that the tool
  repository is a sanitized copy of.
- AI voice disclosure: the host voice is an AI clone of the author, made with his
  consent. An agent's quote is read in that agent's own voice, never a person's.
  The page shows this disclosure under the player.
- Placement: `constants.ts` `episode.youtubeId` holds the 11-character video id.
  While it is empty, `EpisodeVideo.tsx` renders nothing and the page has no
  episode section. A malformed id also renders nothing.
- Playback: visitor controlled. At rest the page shows a local poster and a play
  button and makes no request to YouTube. Pressing play loads the player from
  youtube-nocookie.com. A "Watch on YouTube" link covers readers without
  JavaScript. YouTube supplies captions; `episode.transcript` adds an optional
  transcript on the page.
- Reuse and refresh: choose a public episode whose content is accurate and
  public-safe. Keep it across patch releases; replace it when the episode format,
  the stages or the call to action materially change. Record each change of id
  and the reason here.

| Date | Video id | Reason |
| --- | --- | --- |
| 2026-10-23 | (empty) | Page prepared before the first public episode. |

Creative and listening acceptance of an episode remains with Dan.

## Fill the episode id (launch time)

1. Confirm the episode is public on YouTube and plays.
2. Set `episode.youtubeId` in `constants.ts`; optionally set `episode.transcript`.
3. `npm ci && npm run build && npm test`. The episode test switches to the filled
   state on its own and checks the facade, the disclosure and the watch link.
4. Add a row to the table above, commit and redeploy.

## Deploy

Deploy this project as its own external static site (a new Vercel project named
after this repository). Verify the local deployment link belongs to this project
before deploying. The production `.vercel.app` origin must serve public HTML
without a login wall, because the hub proxies it. Do not add a domain.

The hub needs an explicit bare `/works/orion-on-the-clock/` rewrite, a second
rewrite that strips that prefix for assets, and a no-slash redirect to the
canonical slash. Do not generate a physical hub page at the proxy path.

After the hub merge and deployment, check the final canonical URL, the page title,
and one script URL for a JavaScript content type. An HTTP 200 serving the hub
homepage is a failed verification. With an episode id set, press play on the
final Works URL and confirm the episode plays.

## Rollback

Restore the previous site deployment, or clear `episode.youtubeId` and redeploy to
withdraw the episode alone. Revert the hub routing and card change through its
normal PR flow. The tool repository and its releases are independent of this page.
