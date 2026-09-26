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

Open the URL printed by Vite. For browser tests, install Google Chrome, then run `npm run test:e2e`. Screenshots are written to the ignored `test-results/` directory.

## Prayer experience

- The homepage chooses mysteries by the visitor's local date. Sundays use Joyful during Advent, Sorrowful during Lent, and Glorious otherwise; any set can be selected manually.
- All opening prayers, five decades (one step per Hail Mary), optional Fatima prayers, and closing prayers are included.
- Continue or tap the next button; Space, Enter, and Right Arrow advance while Left Arrow goes back when focus is on the prayer page. Focused controls retain native keyboard behavior.
- Each date and mystery set has its own saved position. Returning visitors can resume explicitly; the homepage still defaults to today's mysteries.
- Text size, light/dark/system appearance, and optional prayers are configurable. Disabling Fatima preserves the current prayer by stable ID.
- Storage is local to the browser, with no account, tracking, or backend. Blocked storage is handled with an explanatory message. The most recent 32 sessions are retained.
- Desktop sidebar and mobile Journey menu allow jumping between mysteries; prayers can be read and printed from the reference dialog.

## Prayer sources

The sequence and mystery schedule were reviewed against the [USCCB rosary guide](https://www.usccb.org/how-to-pray-the-rosary). Traditional English prayer wording is used (including “thee” and “thy”); common versions differ. The short mystery reflections are original. Scripture references are citations, not quotations; Revelation 12 is explicitly presented as a traditional meditation for the Marian mysteries, not a direct narrative of the Assumption.

## Deploy to GitHub Pages

1. Create a public GitHub repository (e.g. `rosary`) and push this project on `main`.
2. In the repository's **Settings → Pages**, choose **GitHub Actions** as the source.
3. Run **Test and deploy to GitHub Pages** from Actions (or push to `main`). It tests, builds, and publishes `dist/`.
4. The site is available at `https://USERNAME.github.io/rosary/`.

Relative asset URLs work on a repository subpath and on a future custom domain. There is no client-side URL router, so page refreshes do not require server rewrite rules. Add and verify a custom domain through GitHub Pages settings when ready, then enforce HTTPS. No domain is preconfigured.

Libre Caslon Text and DM Sans are bundled locally with the site; there are no third-party font requests or analytics. Offline/PWA support, audio, and accounts are not part of this version.
