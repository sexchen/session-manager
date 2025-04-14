//content.js
(function() {
  let tokenData = sessionStorage.getItem("token");
  let vuexData = sessionStorage.getItem("vuex");
  if (tokenData && vuexData) {
    let parsedVuex = JSON.parse(vuexData);
    let sessionIdMatch = JSON.parse(tokenData).sessionId;
    if (sessionIdMatch) {
      let userInfo = parsedVuex.app.userinfo;
      let data = {
        sessionId: sessionIdMatch,
        identifier: userInfo.identifier,
        lasttime: userInfo.lasttime,
        sessionStorage: { token: tokenData, vuex: vuexData }
      };
      chrome.runtime.sendMessage({ action: "saveSession", data });
    }
  }
})();