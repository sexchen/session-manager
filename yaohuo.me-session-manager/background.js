//background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveSession") {
    chrome.storage.local.get(["users"], (data) => {
      let users = data.users || [];
      let existingIndex = users.findIndex(user => user.sessionId === message.data.sessionId);
      if (existingIndex !== -1) {
        users[existingIndex] = message.data;
      } else {
        if (users.length >= 5) users.shift();
        users.push(message.data);
      }
      chrome.storage.local.set({ users });
    });
  } else if (message.action === "getSessions") {
    chrome.storage.local.get(["users"], (data) => {
      sendResponse({ users: data.users || [] });
    });
    return true;
  } else if (message.action === "clearSessions") {
    chrome.storage.local.remove("users", () => sendResponse({ success: true }));
    return true;
  }
});