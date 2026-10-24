import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const PATH = 'https://www.danmercede.com/works/orion-on-the-clock/';
const dist = (file) => new URL('../dist/' + file, import.meta.url);
const html = readFileSync(dist('index.html'), 'utf8');
// Entity-decoded copy of the page, for checks on visible text.
const text = html
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&');
const constants = readFileSync(new URL('../constants.ts', import.meta.url), 'utf8');

test('identity, canonical and grounded copy are in the initial HTML', () => {
  assert.match(html, /<h1\b[^>]*>orion-on-the-clock<\/h1>/);
  assert.match(html, /rel="canonical" href="https:\/\/www\.danmercede\.com\/works\/orion-on-the-clock\/"/);
  assert.match(html, /href="https:\/\/github\.com\/OrionArchitekton\/orion-on-the-clock-oss"/);
  assert.match(text, /Dan's Agents on the Clock on @DanMercedeAI/);
  assert.match(html, /href="https:\/\/www\.youtube\.com\/@DanMercedeAI"/);
  for (const stage of ['collect', 'write', 'gate', 'voice', 'render', 'publish', 'notify']) {
    assert.match(html, new RegExp(`</span>${stage}</span>`), stage);
  }
  assert.match(text, /python3 -m daily\.run --day yesterday --until gate --dry/);
  assert.match(text, /one pilot day of the original pipeline \(two writer attempts\)/i);
});

test('every absolute page reference sits on the Works path', () => {
  for (const pattern of [
    /property="og:url" content="([^"]+)"/,
    /property="og:image" content="([^"]+)"/,
    /name="twitter:image" content="([^"]+)"/,
  ]) {
    const value = html.match(pattern)?.[1];
    assert.ok(value && value.startsWith(PATH), String(pattern));
  }
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  for (const node of graph.filter((n) => n['@type'] !== 'Person')) {
    assert.ok(node['@id'].startsWith(PATH), node['@id']);
    assert.equal(node.url, PATH);
  }
  // No subdomain launch: the only danmercede.com host is www.
  const hosts = [...html.matchAll(/https?:\/\/([a-z0-9.-]*danmercede\.com)/g)].map((m) => m[1]);
  assert.ok(hosts.length > 0);
  for (const host of hosts) assert.equal(host, 'www.danmercede.com');
  // Root-relative asset and icon refs are prefixed by Vite's base.
  for (const ref of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    assert.ok(ref[1].startsWith('/works/orion-on-the-clock/'), ref[1]);
  }
  const manifest = JSON.parse(readFileSync(dist('site.webmanifest'), 'utf8'));
  assert.equal(manifest.start_url, '/works/orion-on-the-clock/');
  for (const icon of manifest.icons) assert.ok(icon.src.startsWith('/works/orion-on-the-clock/'), icon.src);
});

test('the build ships its og-card and favicon, and no robots, sitemap or media files', () => {
  assert.ok(existsSync(dist('og-card.png')), 'og-card.png');
  assert.ok(existsSync(dist('favicon.ico')), 'favicon.ico');
  assert.ok(!existsSync(dist('robots.txt')), 'robots.txt is non-authoritative at a subpath');
  assert.ok(!existsSync(dist('sitemap.xml')), 'the page belongs in the hub sitemap');
  assert.ok(!existsSync(dist('media')), 'the demo is embedded from YouTube; no media ships');
  assert.doesNotMatch(html, /<video\b/);
});

test('the built page carries no long dashes', () => {
  assert.doesNotMatch(html, /[–—―]/);
});

test('the episode section follows the YouTube id in constants.ts', () => {
  const declared = constants.match(/youtubeId:\s*'([^']*)'/);
  assert.ok(declared, 'constants.ts must declare episode.youtubeId as a string literal');
  const id = declared[1];
  if (id === '') {
    // Empty id: no episode section and no YouTube player, image or watch link.
    assert.doesNotMatch(html, /id="episode"/);
    assert.doesNotMatch(html, /<iframe\b/);
    assert.doesNotMatch(html, /youtube-nocookie\.com|i\.ytimg\.com|youtube\.com\/(?:embed|shorts|watch)/);
    return;
  }
  assert.match(id, /^[A-Za-z0-9_-]{11}$/, 'a filled id must be an 11-character YouTube id');
  const section = html.match(/<section id="episode"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, 'a filled id renders the episode section');
  // Click to load: the initial HTML holds the facade, never the player.
  assert.match(section, /<button\b[^>]*aria-label="Play video: [^"]+"/);
  assert.doesNotMatch(section, /<iframe\b/);
  assert.doesNotMatch(section, /autoplay/);
  assert.match(section, new RegExp(`href="https://www\\.youtube\\.com/shorts/${id}"`));
  const sectionText = section.replace(/&#x27;|&#39;/g, "'");
  assert.match(sectionText, /AI clone of the author, made with his consent/);
  assert.match(sectionText, /youtube-nocookie\.com/);
});
