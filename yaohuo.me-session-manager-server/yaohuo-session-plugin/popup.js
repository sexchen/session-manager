// popup.js
const API = "http://localhost:3000";

  // 从本地服务获取已保存的用户列表
function loadUsers() {
  fetch(`${API}/sessions`)
    .then(res => res.json())
    .then(users => {
      const list = document.getElementById("userList");
      list.innerHTML = "";
      users.forEach(u => {
        const li = document.createElement("li");
        li.textContent = `${u.identifier} - ${u.lasttime}`;
        const btn = document.createElement("button");
        btn.textContent = "恢复";
        btn.onclick = () => restoreUser(u.sessionId);
        li.appendChild(btn);
        list.appendChild(li);
      });
    });
}

  // 恢复 session 到当前页面
function restoreUser(sessionId) {
  fetch(`${API}/restore`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId })
  })
    .then(res => res.json())
    .then(data => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const cookies = data.cookies.split('; ').map(c => {
          const [k, v] = c.split('=');
          return `document.cookie = "${k}=${v}; path=/";`;
        }).join('\n');

        const tokenValue = JSON.parse(data.sessionStorage.token);
        const vuexValue = JSON.parse(data.sessionStorage.vuex);

          chrome.tabs.executeScript(tabs[0].id, {
            code: `
              (function() {
try {
              sessionStorage.setItem("token", ${JSON.stringify(JSON.stringify(tokenValue))});
              sessionStorage.setItem("vuex", ${JSON.stringify(JSON.stringify(vuexValue))});
              ${cookies}
                alert("会话恢复成功！");
} catch (e) {
              alert("恢复失败：" + e.message);
            }
              })();
            `
          });
      });
    });
}

  // 清除全部
document.getElementById("clear").onclick = () => {
  fetch(`${API}/clear`, { method: "DELETE" }).then(() => loadUsers());
};

loadUsers();
