//popup.js
document.addEventListener("DOMContentLoaded", function() {
  let userList = document.getElementById("user-list");
  let clearBtn = document.getElementById("clear");

  function loadUsers() {
    chrome.runtime.sendMessage({ action: "getSessions" }, (response) => {
      userList.innerHTML = "";
      (response.users || []).forEach(user => {
        let li = document.createElement("li");
        li.textContent = `${user.identifier} - ${user.lasttime}`;
        let restoreBtn = document.createElement("button");
        restoreBtn.textContent = "Restore";
        restoreBtn.addEventListener("click", () => restoreSession(user));
        li.appendChild(restoreBtn);
        userList.appendChild(li);
      });
    });
  }

  function restoreSession(user) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (data) => {
          sessionStorage.setItem("token", data.sessionStorage.token);
          sessionStorage.setItem("vuex", data.sessionStorage.vuex);
        },
        args: [user]
      });
    });
  }

  clearBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "clearSessions" }, loadUsers);
  });

  loadUsers();
});
