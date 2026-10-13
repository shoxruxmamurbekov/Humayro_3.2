// Layout regression check: loads the production build in Chromium at phone and desktop widths
// and fails if the page scrolls horizontally or throws an uncaught error.
//
// Usage: npm run build && npm run check:layout
// Set CHROMIUM_PATH to use a specific Chromium binary (defaults to Playwright's bundled one).
// Screenshots are written to layout-check-output/ (git-ignored).

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';

const PORT = 4173;
const BASE = `http://localhost:${PORT}/`;
const OUT = 'layout-check-output';
const SIZES = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 900 }
];

if (!existsSync('dist/index.html')) {
  console.error('dist/ not found. Run "npm run build" first.');
  process.exit(2);
}

// Run vite directly (not through npx) so that killing this process also stops the server.
const preview = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise(r => setTimeout(r, 300));
  }
  throw new Error('vite preview did not start in time');
}

let failures = 0;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--no-sandbox']
});

try {
  await waitForServer();
  mkdirSync(OUT, { recursive: true });

  for (const size of SIZES) {
    const page = await browser.newPage({ viewport: { width: size.width, height: size.height } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
    // Freeze animations so screenshots and measurements are stable.
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    await page.screenshot({ path: `${OUT}/${size.name}.png` });

    const problems = [];
    if (overflow > 0) problems.push(`horizontal scroll ${overflow}px`);
    if (errors.length) problems.push(`${errors.length} page error(s): ${errors[0]}`);
    console.log(`${size.name}: ${problems.length ? 'FAIL - ' + problems.join('; ') : 'ok'}`);
    if (problems.length) failures++;
    await page.close();
  }
} finally {
  await browser.close();
  preview.kill();
}

process.exit(failures ? 1 : 0);
