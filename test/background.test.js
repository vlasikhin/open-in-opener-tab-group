const test = require("node:test");
const assert = require("node:assert/strict");

test("does not group tabs opened from a pinned source tab", async () => {
  let listener;
  const groupCalls = [];

  global.chrome = {
    webNavigation: {
      onCreatedNavigationTarget: {
        addListener(callback) {
          listener = callback;
        }
      }
    },
    tabs: {
      onRemoved: { addListener() {} },
      onUpdated: { addListener() {} },
      onDetached: { addListener() {} },
      async get(tabId) {
        if (tabId === 1) {
          return {
            id: 1,
            pinned: true,
            windowId: 1,
            groupId: -1,
            title: "Pinned source"
          };
        }

        return {
          id: 2,
          pinned: false,
          windowId: 1,
          groupId: -1,
          title: "Destination"
        };
      },
      async group(options) {
        groupCalls.push(options);
        return 7;
      }
    },
    tabGroups: {
      TAB_GROUP_ID_NONE: -1,
      async update() {}
    }
  };

  const backgroundPath = require.resolve("../background.js");
  delete require.cache[backgroundPath];
  require(backgroundPath);

  await listener({ sourceTabId: 1, tabId: 2 });

  assert.deepEqual(groupCalls, []);
  delete global.chrome;
});

function loadBackground({ autoUngroup, createdGroupIds = [], groups }) {
  const listeners = {};
  const ungroupCalls = [];

  global.chrome = {
    webNavigation: {
      onCreatedNavigationTarget: { addListener() {} }
    },
    storage: {
      sync: {
        async get() {
          return autoUngroup === undefined ? {} : { autoUngroup };
        }
      },
      session: {
        async get(key) {
          return createdGroupIds.some((id) => key === `group-${id}`) ? { [key]: true } : {};
        }
      }
    },
    tabs: {
      onRemoved: { addListener: (callback) => { listeners.removed = callback; } },
      onUpdated: { addListener: (callback) => { listeners.updated = callback; } },
      onDetached: { addListener: (callback) => { listeners.detached = callback; } },
      async query({ groupId }) {
        return groups[groupId].map((id) => ({ id }));
      },
      async ungroup(tabIds) {
        ungroupCalls.push(tabIds);
      }
    },
    tabGroups: {
      TAB_GROUP_ID_NONE: -1,
      async query() {
        return Object.keys(groups).map((id) => ({ id: Number(id) }));
      }
    }
  };

  const backgroundPath = require.resolve("../background.js");
  delete require.cache[backgroundPath];
  require(backgroundPath);

  return { listeners, ungroupCalls };
}

function settle() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

test("records groups it creates", async () => {
  const sessionSets = [];

  global.chrome = {
    webNavigation: {
      onCreatedNavigationTarget: {
        addListener(callback) {
          global.listener = callback;
        }
      }
    },
    storage: {
      session: {
        async set(items) {
          sessionSets.push(items);
        }
      }
    },
    tabs: {
      onRemoved: { addListener() {} },
      onUpdated: { addListener() {} },
      onDetached: { addListener() {} },
      async get(tabId) {
        return { id: tabId, pinned: false, windowId: 1, groupId: -1, title: "Source" };
      },
      async group() {
        return 7;
      }
    },
    tabGroups: {
      TAB_GROUP_ID_NONE: -1,
      async update() {}
    }
  };

  const backgroundPath = require.resolve("../background.js");
  delete require.cache[backgroundPath];
  require(backgroundPath);

  await global.listener({ sourceTabId: 1, tabId: 2 });

  assert.deepEqual(sessionSets, [{ "group-7": true }]);
  delete global.listener;
  delete global.chrome;
});

test("keeps lone tabs grouped when the setting is off", async () => {
  const { listeners, ungroupCalls } = loadBackground({ groups: { 7: [1] } });

  listeners.removed(2, { windowId: 1, isWindowClosing: false });
  await settle();

  assert.deepEqual(ungroupCalls, []);
  delete global.chrome;
});

test("ungroups a lone tab in any group when set to all", async () => {
  const { listeners, ungroupCalls } = loadBackground({
    autoUngroup: "all",
    groups: { 7: [1], 8: [3, 4] }
  });

  listeners.removed(2, { windowId: 1, isWindowClosing: false });
  await settle();

  assert.deepEqual(ungroupCalls, [1]);
  delete global.chrome;
});

test("ungroups only extension-created groups when set to created", async () => {
  const { listeners, ungroupCalls } = loadBackground({
    autoUngroup: "created",
    createdGroupIds: [7],
    groups: { 7: [1], 8: [3] }
  });

  listeners.removed(2, { windowId: 1, isWindowClosing: false });
  await settle();

  assert.deepEqual(ungroupCalls, [1]);
  delete global.chrome;
});

test("ignores tabs closed with their window", async () => {
  const { listeners, ungroupCalls } = loadBackground({
    autoUngroup: "all",
    groups: { 7: [1] }
  });

  listeners.removed(2, { windowId: 1, isWindowClosing: true });
  await settle();

  assert.deepEqual(ungroupCalls, []);
  delete global.chrome;
});

test("ungroups a lone tab after a tab leaves its group", async () => {
  const { listeners, ungroupCalls } = loadBackground({
    autoUngroup: "all",
    groups: { 7: [1] }
  });

  listeners.updated(2, { groupId: -1 }, { id: 2, windowId: 1 });
  await settle();

  assert.deepEqual(ungroupCalls, [1]);
  delete global.chrome;
});

test("keeps a group the tab just joined", async () => {
  const { listeners, ungroupCalls } = loadBackground({
    autoUngroup: "all",
    groups: { 7: [2] }
  });

  listeners.updated(2, { groupId: 7 }, { id: 2, windowId: 1 });
  await settle();

  assert.deepEqual(ungroupCalls, []);
  delete global.chrome;
});

test("ungroups a lone tab after a tab moves to another window", async () => {
  const { listeners, ungroupCalls } = loadBackground({
    autoUngroup: "all",
    groups: { 7: [1] }
  });

  listeners.detached(2, { oldWindowId: 1, oldPosition: 0 });
  await settle();

  assert.deepEqual(ungroupCalls, [1]);
  delete global.chrome;
});
