# Open in Opener Tab Group

A small Chrome extension that groups tabs opened from links with their source tab.

## Behavior

- A link opened in a new tab joins the source tab's existing group.
- If the source tab is not grouped, a new group is created for both tabs.
- A new group is named after the source page.
- Tabs opened from pinned tabs, other applications, blank tabs, and cross-window tabs remain ungrouped.

## Local installation

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Choose Load unpacked.
4. Select this folder.

## Tests

The service worker is covered by `node:test`, with `chrome` stubbed out. No dependencies, no
install step:

```sh
node --test test/background.test.js
```

Pass the file explicitly. `node --test test/` resolves `test` as a module name on Node 25 and fails
with `MODULE_NOT_FOUND` before any test runs.

## Packaging

The store package holds only what Chrome loads: the manifest, the service worker and the icons.
Documentation, tests and store artwork stay out of it.

Bump `version` in `manifest.json` first — the archive name follows it. Then, from the repository
root:

```sh
VERSION=$(node -p "require('./manifest.json').version")
mkdir -p dist
zip -r "dist/open-in-opener-tab-group-$VERSION.zip" \
  manifest.json background.js icons \
  -x '*.DS_Store'
```

Verify the result before uploading:

```sh
unzip -Z1 "dist/open-in-opener-tab-group-$VERSION.zip"
```

It should list exactly `manifest.json`, `background.js` and the four files under `icons/`.

Upload the archive in the Chrome Web Store Developer Dashboard under Package, then attach the same
file to a GitHub release tagged `v$VERSION`:

```sh
gh release create "v$VERSION" "dist/open-in-opener-tab-group-$VERSION.zip"
```

`dist/` is not tracked in git; the published archives live on the releases page.

## Privacy

All processing happens locally in Chrome. See [PRIVACY.md](PRIVACY.md).

## License

MIT. See [LICENSE](LICENSE).
