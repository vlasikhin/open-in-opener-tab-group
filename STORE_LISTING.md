# Chrome Web Store listing

## Name

Open in Opener Tab Group

## Summary

Groups tabs opened from links with their source tab, names new groups after it, and can ungroup lone tabs.

## Description

Keep link exploration together without sorting tabs by hand.

Open a link in a new tab from any page. The extension automatically:

- Creates a native Chrome tab group for the source and new tab
- Reuses the source tab's existing group
- Names new groups after the source page
- Leaves links from pinned tabs, external links, new blank tabs, and cross-window tabs alone
- Optionally ungroups a tab left alone in its group, for groups the extension created or for all groups

Everything runs locally in Chrome. There are no accounts, analytics, network requests, or stored browsing data. The extension stores only your ungroup setting and, until the browser closes, the identifiers of the groups it created.

## Category

Productivity

## Language

English

## Single purpose

Keep tabs opened from links together with their source tab in a native Chrome tab group.

## Permission justifications

### tabs

Reads the source tab title and its window and group identifiers so the extension can name and place the new group correctly. The data is processed locally and is not stored or transmitted.

### tabGroups

Creates native Chrome tab groups, adds tabs to the source tab's existing group, names new groups after the source page, and, if enabled in the options, finds groups left with a single tab so that tab can be ungrouped.

### storage

Saves the ungroup setting chosen on the options page, and keeps the identifiers of groups the extension created for the current browser session so that the "Only groups created by this extension" setting can tell them apart. No browsing data is stored.

### webNavigation

Detects when a page opens a real navigation target in a new tab. This lets the extension group link-opened tabs while leaving external links and manually created tabs alone.

## Remote code

No. All executable code is included in the extension package.

## Data use

The extension handles website navigation metadata and the source tab title only to perform its single purpose. Processing is local, temporary, and never transmitted, sold, or shared. The only stored data are the ungroup setting and tab-group identifiers, which are cleared when the browser closes.

## Test instructions

The dashboard field is limited to 500 characters.

1. Command-click (macOS) or Control-click (Windows/Linux) a link.
2. Both tabs share a group named after the source page.
3. Another link from the source joins the same group.
4. Links from another app or a pinned tab stay ungrouped.
5. In Options choose "Only groups created by this extension". Close one tab of such a group; the group disappears, the other tab stays.
6. Close one tab of a manual two-tab group; the group remains.
7. Choose "All groups", repeat step 6; the group disappears.

## Assets

- Icon: `icons/icon-128.png`
- Screenshot: `store-assets/screenshot-1280x800.png`
- Small promo tile: `store-assets/promo-440x280.png`
