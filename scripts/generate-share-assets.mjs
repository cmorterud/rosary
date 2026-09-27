import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function renderSvg(svg, width, height, filename) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(`<html><head><style>html,body{width:${width}px;height:${height}px;margin:0;overflow:hidden}svg{display:block}</style></head><body>${svg}</body></html>`);
  await page.screenshot({ path: fileURLToPath(new URL(`../public/${filename}`, import.meta.url)), type: 'png' });
  await page.close();
}

try {
  await renderSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs><radialGradient id="light"><stop stop-color="#345766"/><stop offset="1" stop-color="#203d4c"/></radialGradient></defs>
    <rect width="1200" height="630" fill="#203d4c"/>
    <ellipse cx="600" cy="315" rx="445" ry="315" fill="url(#light)"/>
    <circle cx="600" cy="315" r="223" fill="none" stroke="#d8c6a2" stroke-opacity=".26" stroke-width="2"/>
    <circle cx="600" cy="315" r="196" fill="none" stroke="#d8c6a2" stroke-opacity=".12" stroke-width="1"/>
    <path d="M600 145V492 M493 243H707" fill="none" stroke="#ebd6ac" stroke-width="17" stroke-linecap="round"/>
    <path d="M80 80H135 M1065 550H1120" fill="none" stroke="#ebd6ac" stroke-opacity=".42" stroke-width="2"/>
  </svg>`, 1200, 630, 'social-preview.png');

  await renderSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
    <rect width="180" height="180" rx="35" fill="#203d4c"/>
    <circle cx="90" cy="90" r="60" fill="none" stroke="#d8c6a2" stroke-opacity=".3" stroke-width="1.5"/>
    <path d="M90 42V140 M59 70H121" fill="none" stroke="#ebd6ac" stroke-width="7" stroke-linecap="round"/>
  </svg>`, 180, 180, 'apple-touch-icon.png');
} finally {
  await browser.close();
}
