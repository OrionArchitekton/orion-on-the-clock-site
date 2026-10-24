# orion-on-the-clock product page

Static Vite/React product page for
[orion-on-the-clock](https://github.com/OrionArchitekton/orion-on-the-clock-oss), the
pipeline that turns yesterday's AI coding agent work into a daily YouTube Short.

Canonical: https://www.danmercede.com/works/orion-on-the-clock/

```bash
npm ci
npm run build   # builds, then runs the built-output tests
npm test
```

`constants.ts` owns the product copy and the episode's YouTube id. The hub proxies the
page and its assets under `/works/orion-on-the-clock/`. Source, setup and operating
instructions belong in the tool repository; this page is a short introduction.

See `docs/runbooks/release.md` for deployment, the demo provenance and rollback.
MIT licensed.
