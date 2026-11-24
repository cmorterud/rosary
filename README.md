# Daily Rosary

A quiet, responsive rosary companion built with Vite and TypeScript for GitHub Pages.

## Develop

Requires Node.js 22.12+ (Node 24 recommended).

```sh
npm ci
npm run dev
npm test
npm run build
```

Open the URL printed by Vite. For browser tests, install Google Chrome, then run `npm run test:e2e`; it starts the dev server and a production build (`vite preview` on port 4173, for the offline tests). Screenshots are written to the ignored `test-results/` directory.

## Prayer experience

- The homepage chooses mysteries by the visitor's local date. Sundays use Joyful during Advent, Sorrowful during Lent, and Glorious otherwise; any set can be selected manually.
- All opening prayers, five decades (one step per Hail Mary), and closing prayers are included. Optional prayers can be added in Settings: the Fatima Prayer after each decade (on by default), the Litany of Loreto after the Hail, Holy Queen, the Prayer to St. Michael after the closing prayer, and an Our Father, Hail Mary, and Glory Be for the Pope's intentions before the final Sign of the Cross.
- Continue or tap the next button; Space, Enter, and Right Arrow advance while Left Arrow goes back when focus is on the prayer page. Focused controls retain native keyboard behavior.
- Each date and mystery set has its own saved position. The homepage defaults to today's mysteries and returns to the place in an unfinished one (a finished one starts again). Another unfinished rosary prayed today or yesterday can be resumed explicitly; older abandoned ones are no longer offered.
- While praying, the screen is kept awake (Screen Wake Lock, where supported). After five minutes without moving to another prayer, or once the rosary is complete, the device's normal auto-lock returns.
- Text size, light/dark/system appearance, prayer language (English or Latin), and optional prayers are configurable. Turning an optional prayer on or off, or switching language, preserves the current prayer by stable ID; turning off the prayer on screen continues with the next one. In Latin, only the prayers change: mystery titles, reflections, and the interface stay in English, and the reference dialog shows each Latin prayer with the English beneath.
- Storage is local to the browser, with no account, tracking, or backend. Blocked storage is handled with an explanatory message. The most recent 32 sessions are retained.
- Desktop sidebar and mobile Journey menu allow jumping between mysteries; prayers can be read and printed from the reference dialog.

## Offline and install

After the first visit the site works without a connection, and it can be installed to a home screen or desktop (`public/manifest.webmanifest`, with icons from `scripts/generate-share-assets.mjs`).

- The build writes `sw.js` from `src/service-worker.js`, listing every built file except the share image and WOFF fonts (every browser that runs a service worker reads WOFF2). Its cache name is a hash of those files and the worker itself, so each deploy changes the worker.
- The worker answers from its cache first, so the site opens instantly even on a weak signal. Opening the page, or returning to an installed app, checks for a new worker; it saves the new files, deletes the old cache, and the next visit uses the new version.
- Saved files are matched by address alone (`ignoreVary`), so a server's `Vary` header cannot make the cached script and styles miss. Development (`npm run dev`) never registers the worker.

## Prayer sources

The sequence and mystery schedule were reviewed against the [USCCB rosary guide](https://www.usccb.org/how-to-pray-the-rosary). Traditional English prayer wording is used (including “thee” and “thy”); common versions differ. The Latin follows the common prayers of the Vatican's [Compendium of the Catechism](https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_en.html) (ecclesiastical spelling, with acute accents marking the stressed syllable); the closing versicle and collect are those of the Rosary feast; the Litany of Loreto and the Prayer to St. Michael, which the Compendium omits, are accented the same way; and the Fatima Prayer, which has no official Latin, uses the common rendering closest to the Portuguese. Latin text stays within Latin-1 so the bundled font subset covers every character. The English [Litany of Loreto](https://www.vatican.va/special/rosary/documents/litanie-lauretane_en.html) is the Vatican's, in US spelling, including the invocations added in 2020 (Mother of Mercy, Mother of Hope, Solace of Migrants); its closing versicle leads into the rosary's own prayer, so the litany's separate collect is not repeated. The English [Prayer to St. Michael](https://www.ewtn.com/catholicism/devotions/prayer-to-st-michael-the-archangel-371) follows EWTN's common wording. The short mystery reflections are original. Scripture references are citations, not quotations; Revelation 12 is explicitly presented as a traditional meditation for the Marian mysteries, not a direct narrative of the Assumption.

## Deploy to GitHub Pages

1. Create a public GitHub repository (e.g. `rosary`) and push this project on `main`.
2. In the repository's **Settings → Pages**, choose **GitHub Actions** as the source.
3. Run **Test and deploy to GitHub Pages** from Actions (or push to `main`). It runs the unit and Playwright browser tests, builds, and publishes `dist/`; pull requests run the same checks without deploying.
4. The site is available at [rosaryonline.org](https://rosaryonline.org/); the GitHub Pages project URL redirects there.

Relative asset URLs work on the repository subpath and at the custom domain root. There is no client-side URL router, so page refreshes do not require server rewrite rules. The custom domain and HTTPS are configured in GitHub Pages settings.

The social preview and 180px touch icon are committed under `public/`. Regenerate them after a brand change with `node scripts/generate-share-assets.mjs` (requires Google Chrome). The page's Open Graph metadata uses the deployed `https://rosaryonline.org/` address.

Libre Caslon Text and DM Sans are bundled locally with the site; there are no third-party font requests or analytics. Audio and accounts are not part of this version.
