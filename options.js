const inputs = document.querySelectorAll('input[name="autoUngroup"]');

chrome.storage.sync.get("autoUngroup").then(({ autoUngroup = "off" }) => {
  for (const input of inputs) {
    input.checked = input.value === autoUngroup;
  }
});

for (const input of inputs) {
  input.addEventListener("change", () => {
    chrome.storage.sync.set({ autoUngroup: input.value });
  });
}
