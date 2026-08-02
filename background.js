chrome.webNavigation.onCreatedNavigationTarget.addListener(async (details) => {
  try {
    const [opener, tab] = await Promise.all([
      chrome.tabs.get(details.sourceTabId),
      chrome.tabs.get(details.tabId)
    ]);

    if (opener.pinned || opener.windowId !== tab.windowId) {
      return;
    }

    if (opener.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const groupId = await chrome.tabs.group({
        tabIds: [opener.id, tab.id]
      });
      const title = (opener.title || "").replace(/\s+/g, " ").trim();

      if (title) {
        await chrome.tabGroups.update(groupId, {
          title: title.length > 40 ? `${title.slice(0, 39)}…` : title
        });
      }
    } else {
      await chrome.tabs.group({
        groupId: opener.groupId,
        tabIds: tab.id
      });
    }
  } catch {
  }
});
