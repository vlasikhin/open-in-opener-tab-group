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
      await chrome.storage.session.set({ [`group-${groupId}`]: true });
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

async function ungroupLoneTabs(windowId, skipGroupId) {
  try {
    const { autoUngroup = "off" } = await chrome.storage.sync.get("autoUngroup");

    if (autoUngroup === "off") {
      return;
    }

    const groups = await chrome.tabGroups.query({ windowId });

    for (const group of groups) {
      if (group.id === skipGroupId) {
        continue;
      }

      if (autoUngroup === "created") {
        const key = `group-${group.id}`;
        const stored = await chrome.storage.session.get(key);

        if (!stored[key]) {
          continue;
        }
      }

      const tabs = await chrome.tabs.query({ groupId: group.id });

      if (tabs.length === 1) {
        await chrome.tabs.ungroup(tabs[0].id);
      }
    }
  } catch {
  }
}

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (!removeInfo.isWindowClosing) {
    ungroupLoneTabs(removeInfo.windowId);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.groupId !== undefined) {
    ungroupLoneTabs(tab.windowId, changeInfo.groupId);
  }
});

chrome.tabs.onDetached.addListener((tabId, detachInfo) => {
  ungroupLoneTabs(detachInfo.oldWindowId);
});
