# Chrome Web Store listing

## Name

Open in Opener Tab Group

## Summary

Automatically groups tabs opened from links with their source tab, names each new group after the source page, and can ungroup lone tabs.

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

Creates native Chrome tab groups, adds tabs to an existing source group, and names a newly created group after the source page.

### storage

Saves the ungroup setting chosen on the options page, and keeps the identifiers of groups the extension created for the current browser session so that the "Only groups created by this extension" setting can tell them apart. No browsing data is stored.

### webNavigation

Detects when a page opens a real navigation target in a new tab. This lets the extension group link-opened tabs while leaving external links and manually created tabs alone.

## Remote code

No. All executable code is included in the extension package.

## Data use

The extension handles website navigation metadata and the source tab title only to perform its single purpose. Processing is local, temporary, and never transmitted, sold, or shared. The only stored data are the ungroup setting and tab-group identifiers, which are cleared when the browser closes.

## Test instructions

1. Open any webpage containing a link.
2. Command-click the link on macOS or Control-click it on Windows/Linux.
3. Confirm that the source tab and new tab are placed in one native Chrome tab group.
4. Confirm that the group name matches the source page title.
5. Open another link from the source tab and confirm that it joins the same group.
6. Open a link from another application and confirm that it remains ungrouped.
7. Pin a source tab, open a link from it in a new tab, and confirm that it remains ungrouped.
8. Open the extension's options and choose "Only groups created by this extension".
9. Close one of the two tabs in a group the extension created and confirm that the group disappears while the other tab stays open.
10. Create a group manually with two tabs, close one, and confirm that the group remains.
11. Choose "All groups", repeat step 10, and confirm that the group disappears.

## Assets

- Icon: `icons/icon-128.png`
- Screenshot: `store-assets/screenshot-1280x800.png`
- Small promo tile: `store-assets/promo-440x280.png`
