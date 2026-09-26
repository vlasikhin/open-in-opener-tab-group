# Privacy Policy — Open in Opener Tab Group

Last updated: September 26, 2026

Open in Opener Tab Group keeps tabs opened from links together with their source tab in a native Chrome tab group.

## Data handled

To perform this function, the extension temporarily processes:

- The source tab title
- Tab, window, and tab-group identifiers supplied by Chrome
- Navigation metadata supplied by Chrome when a page opens a new tab
- The number of tabs in each tab group, to find a group left with a single tab

## How data is used

This information is used only to identify the source and destination tabs, place them in the correct native Chrome tab group, name a new group after the source page, and, if enabled, ungroup a tab left alone in its group.

## Storage and sharing

All processing happens locally in Chrome. The extension stores only the ungroup setting chosen on its options page (synced by Chrome with your other extension settings) and, for the current browser session, the identifiers of tab groups it created. It does not store browsing data, send data over the network, use analytics, create accounts, sell data, or share data with third parties.

## Retention

Tab-group identifiers are cleared when the browser closes. The ungroup setting is kept until you change it or remove the extension. No other user data is retained.

## Permissions

- `tabs` reads the source tab title and its window and group identifiers.
- `tabGroups` creates, updates, and names native Chrome tab groups.
- `storage` saves the ungroup setting and the identifiers of groups the extension created.
- `webNavigation` detects new tabs that were opened by a webpage.

## Changes

If this policy changes, the updated version and date will be published at the same location.

## Contact

Privacy questions can be sent through the support contact shown on the Chrome Web Store listing.

The use of information received from Chrome APIs adheres to the Chrome Web Store User Data Policy, including the Limited Use requirements.
