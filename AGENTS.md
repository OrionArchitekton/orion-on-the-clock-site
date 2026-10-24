# AGENTS.md - orion-on-the-clock-site

This static product page owns positioning, metadata and assets for
[orion-on-the-clock](https://github.com/OrionArchitekton/orion-on-the-clock-oss).
It does not own the pipeline, its releases or its docs: those live in the tool
repository.

- Ground every claim in the tool repository's README, CHANGELOG and docs. Quote
  numbers only as the repository states them; invent none.
- `constants.ts` owns all page copy, including the episode's YouTube id. An empty
  id renders no episode section; never point it at anything but a real episode.
- The canonical route is https://www.danmercede.com/works/orion-on-the-clock/
  through a prefix-stripped hub rewrite. Keep every absolute meta, JSON-LD and
  manifest reference on that path. Ship no `robots.txt` or `sitemap.xml`.
- Never copy a template `.vercel` directory.
- `npm ci && npm run build && npm test` must pass; the tests inspect the built
  output. For docs-only changes run `git diff --check` at minimum.
- See `docs/runbooks/release.md` for deployment, the demo provenance and rollback.
