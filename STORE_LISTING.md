# Chrome Web Store listing

## Name

Open in Opener Tab Group

## Summary

Automatically groups tabs opened from links with their source tab and names each new group after the source page.

## Description

Keep link exploration together without sorting tabs by hand.

Open a link in a new tab from any page. The extension automatically:

- Creates a native Chrome tab group for the source and new tab
- Reuses the source tab's existing group
- Names new groups after the source page
- Leaves links from pinned tabs, external links, new blank tabs, and cross-window tabs alone

Everything runs locally in Chrome. There are no accounts, analytics, network requests, or stored browsing data.

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

Creates native Chrome tab groups, adds tabs to an existing source group, and names a newly created group after the source page.

### webNavigation

Detects when a page opens a real navigation target in a new tab. This lets the extension group link-opened tabs while leaving external links and manually created tabs alone.

## Remote code

No. All executable code is included in the extension package.

## Data use

The extension handles website navigation metadata and the source tab title only to perform its single purpose. Processing is local, temporary, and never transmitted, sold, or shared.

## Test instructions

1. Open any webpage containing a link.
2. Command-click the link on macOS or Control-click it on Windows/Linux.
3. Confirm that the source tab and new tab are placed in one native Chrome tab group.
4. Confirm that the group name matches the source page title.
5. Open another link from the source tab and confirm that it joins the same group.
6. Open a link from another application and confirm that it remains ungrouped.
7. Pin a source tab, open a link from it in a new tab, and confirm that it remains ungrouped.

## Assets

- Icon: `icons/icon-128.png`
- Screenshot: `store-assets/screenshot-1280x800.png`
- Small promo tile: `store-assets/promo-440x280.png`
