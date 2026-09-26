# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Manifest V3 Chrome extension: a service worker, `background.js`, plus an options page,
`options.html` and `options.js`. There is no `package.json`, no dependencies, no build step and no
linter.

## Commands

Run all tests, or a single test by name:

```sh
node --test test/background.test.js
node --test --test-name-pattern="pinned" test/background.test.js
```

Always pass the test file explicitly. `node --test test/` fails on Node 25 because `test` is resolved
as a module name. A bare `node --test` also recurses into the gitignored `privacy-site/` (a separate,
unrelated project, when present) and fails on its unbuilt tests.

Manual testing: Load unpacked from `chrome://extensions` (Developer mode) with the repository root.
The manual test script is "Test instructions" in `STORE_LISTING.md`.

Packaging and release (full flow in "Packaging" in `README.md`). Bump `version` in `manifest.json`
first; it is the only version number, and the archive name and release tag follow it:

```sh
VERSION=$(node -p "require('./manifest.json').version")
mkdir -p dist
zip -r "dist/open-in-opener-tab-group-$VERSION.zip" manifest.json background.js options.html options.js icons -x '*.DS_Store'
unzip -Z1 "dist/open-in-opener-tab-group-$VERSION.zip"
gh release create "v$VERSION" "dist/open-in-opener-tab-group-$VERSION.zip"
```

The listing must show only `manifest.json`, `background.js`, `options.html`, `options.js`, `icons/`
and its four PNGs. The same archive is uploaded manually in the Chrome Web Store Developer
Dashboard. `dist/` is gitignored.

## Architecture

Grouping is a `chrome.webNavigation.onCreatedNavigationTarget` listener:

- The event fires only when a page opens a navigation target in a new tab or window. Tabs opened from
  other applications and blank new tabs never trigger it, so those exclusions come from the choice
  of event, not from code. Pinned openers and targets in a different window are skipped explicitly.
- An ungrouped opener gets a new group holding both tabs, titled after the opener's title
  (whitespace collapsed, capped at 40 characters including `…`, left untitled if empty). A grouped
  opener just receives the new tab; existing group titles are never changed.
- The empty `catch` swallows every Chrome API error, so failures are silent.

Auto-ungroup is `ungroupLoneTabs`, called from `tabs.onRemoved` (skipped when the window is closing),
`tabs.onUpdated` (on `groupId` change, skipping the group the tab just joined) and `tabs.onDetached`.
It dissolves groups in that window left with one tab. The mode is `autoUngroup` in
`chrome.storage.sync`: `off` (default), `created` or `all`. Groups the extension creates are
recorded as `group-<id>` keys in `chrome.storage.session`, which `created` mode checks.

`background.js` registers its listeners at load time. Each test installs a `global.chrome` stub,
clears the require cache, `require`s `background.js`, then calls a captured listener directly and
asserts on the recorded Chrome API calls. `loadBackground` in the test file builds the stub for the
auto-ungroup tests.

## Files that must change together

- Behavior is described in the manifest `description`, "Behavior" in `README.md`, and the Summary,
  Description and Test instructions in `STORE_LISTING.md`. The Web Store takes the Summary from the
  manifest `description`, and its Test instructions field is limited to 500 characters.
- Permissions are justified in `STORE_LISTING.md` (Permission justifications, Data use) and
  `PRIVACY.md` (Data handled, Permissions). A change to manifest `permissions` needs both, plus the
  "Last updated" date in `PRIVACY.md`.
- The zip ships only `manifest.json`, `background.js`, `options.html`, `options.js` and
  `icons/`. A new runtime file must be added to the zip command and the expected listing in `README.md`.
- `assets/icon.svg` is the source of `icons/icon-{16,32,48,128}.png`, and `store-assets/*.svg` of
  the store PNGs. There is no render script, so PNGs are re-exported by hand after an SVG changes.
