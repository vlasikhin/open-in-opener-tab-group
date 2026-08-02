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
