function generateRandomToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let sessionId = '';
    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            sessionId += '-';
        } else {
            sessionId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    }
    return `{"sessionId":"${sessionId}"}`;
}

function generateRandomUserInfo() {
    const names = ['张三', '李四', '王五', '赵六', '陈韵涵'];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const lastTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return {
        app: {
            userinfo: {
                identifier: randomName,
                lasttime: lastTime
            }
        }
    };
}

// 生成随机 token 并保存到 sessionStorage
const randomToken = generateRandomToken();
sessionStorage.setItem('token', randomToken);

// 生成随机 vuex 数据并保存到 sessionStorage
const randomVuexData = generateRandomUserInfo();
sessionStorage.setItem('vuex', JSON.stringify(randomVuexData));

// 打印 sessionStorage 中的数据
console.log('sessionStorage 中的 token:', sessionStorage.getItem('token'));
console.log('sessionStorage 中的 vuex:', sessionStorage.getItem('vuex'));
    