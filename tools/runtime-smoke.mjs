/* Runtime smoke test: load every page in a real Chromium, collect uncaught
   exceptions, genuine console.error calls and failed local requests, then
   assert a few structural facts that catch silently-dead enhancement layers
   (the class of bug node --check cannot see, e.g. a runtime TypeError that
   kills an IIFE).

   Known by-design probes: script-core checks for an optional archive-card
   image (assets/archive-card.webp / .png) and the site works without them,
   so their 404s are ignored.

   Usage:
     node tools/runtime-smoke.mjs
   Environment:
     CY_SMOKE_EXECUTABLE  path to a Chromium-family executable (local runs can
                          point this at Edge/Chrome; CI uses playwright's own
                          chromium install).
*/
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const PORT = 8123;
const BASE = `http://127.0.0.1:${PORT}`;
const PAGES = ['index.html', 'profile.html', 'experience.html', 'education.html', 'focus.html', 'contact.html'];
const OPTIONAL_PROBES = ['/assets/archive-card.webp', '/assets/archive-card.png'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon'
};

function serve(pathname) {
  return new Promise((resolve, reject) => {
    let rel = decodeURIComponent(pathname.split('?')[0]);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = normalize(join(ROOT, rel));
    if (!file.startsWith(ROOT)) return reject(Object.assign(new Error('traversal'), { status: 403 }));
    readFile(file)
      .then((body) => resolve({ body, type: MIME[extname(file)] || 'application/octet-stream' }))
      .catch(() => reject(Object.assign(new Error('not found'), { status: 404 })));
  });
}

const server = createServer((req, res) => {
  serve(req.url)
    .then(({ body, type }) => { res.writeHead(200, { 'content-type': type }); res.end(body); })
    .catch((error) => { res.writeHead(error.status || 500); res.end(); });
});

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

try {
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

  const { chromium } = await import('playwright-core');
  const browser = await chromium.launch({ executablePath: process.env.CY_SMOKE_EXECUTABLE || undefined });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  let hardFailures = 0;

  for (const name of PAGES) {
    const errors = [];
    const badResponses = [];
    const onPageError = (error) => errors.push(`pageerror: ${error.message}`);
    const onConsole = (message) => {
      const text = message.text();
      if (message.type() === 'error' && !text.startsWith('Failed to load resource')) errors.push(`console: ${text}`);
    };
    const onResponse = (response) => {
      const url = new URL(response.url());
      if (url.host !== `127.0.0.1:${PORT}`) return;
      const path = url.pathname;
      if (response.status() >= 400 && !OPTIONAL_PROBES.includes(path)) badResponses.push(`${response.status()} ${path}`);
    };
    page.on('pageerror', onPageError);
    page.on('console', onConsole);
    page.on('response', onResponse);

    await page.goto(`${BASE}/${name}`, { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    if (errors.length) {
      hardFailures += 1;
      fail(`${name}: ${errors.length} runtime error(s)`);
      errors.slice(0, 5).forEach((line) => console.error(`     ${line}`));
    }
    if (badResponses.length) {
      hardFailures += 1;
      fail(`${name}: ${badResponses.length} failed local request(s)`);
      badResponses.slice(0, 5).forEach((line) => console.error(`     ${line}`));
    }

    const structure = await page.evaluate(() => ({
      header: !!document.querySelector('.site-header'),
      pet: !!document.querySelector('.cys-pet-root'),
      showcaseCases: document.querySelectorAll('[data-showcase-v5]').length
    }));
    if (!structure.header || !structure.pet) {
      hardFailures += 1;
      fail(`${name}: shell structure missing (header=${structure.header} pet=${structure.pet})`);
    }
    if (name === 'index.html' && !await page.evaluate(() => !!document.querySelector('.home-cover'))) {
      hardFailures += 1;
      fail(`${name}: home cover missing`);
    }
    if (name === 'experience.html') {
      const expected = await page.evaluate(() => document.querySelectorAll('.slide-tab').length);
      if (!structure.showcaseCases || structure.showcaseCases !== expected) {
        hardFailures += 1;
        fail(`${name}: showcase layer dead (${structure.showcaseCases}/${expected} cases)`);
      }
    }

    console.log(`ok ${name} (${errors.length} errors, ${badResponses.length} failed requests)`);
    page.off('pageerror', onPageError);
    page.off('console', onConsole);
    page.off('response', onResponse);
  }

  await browser.close();
  if (hardFailures) {
    console.error(`runtime smoke: ${hardFailures} page(s) failed`);
    process.exitCode = 1;
  } else {
    console.log('runtime smoke: all pages clean');
  }
} finally {
  server.close();
}
