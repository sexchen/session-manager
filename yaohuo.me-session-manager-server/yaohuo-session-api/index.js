const express = require('express');
const fs = require('fs');
const cors = require('cors');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;
const dataFile = path.join(__dirname, 'sessions.json');
const maxUsers = 5;
const secret = '1234567890abcdef1234567890abcdef'; // 32 字节密钥

app.use(cors());
app.use(bodyParser.json());

// AES 加密
function encrypt(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret), iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, iv: iv.toString('hex') };
}

// AES 解密
function decrypt({ encrypted, iv }) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

// 加载已保存的数据
function loadSessions() {
  if (!fs.existsSync(dataFile)) return [];
  const raw = JSON.parse(fs.readFileSync(dataFile, 'utf8') || '[]');
  return raw.map(item => ({ sessionId: item.sessionId, data: decrypt(item.data) }));
}

// 保存数据
function saveSessions(sessions) {
  const encrypted = sessions.map(s => ({
    sessionId: s.sessionId,
    data: encrypt(s.data)
  }));
  fs.writeFileSync(dataFile, JSON.stringify(encrypted, null, 2), 'utf8');
}

// 保存新数据
app.post('/save', (req, res) => {
  const { sessionId, data } = req.body;
  if (!sessionId || !data) {
    return res.status(400).send('Missing sessionId or data');
  }

  let sessions = loadSessions();
  sessions = sessions.filter(s => s.sessionId !== sessionId); // 替换已有的
  sessions.unshift({ sessionId, data });

  const now = Date.now();
  sessions = sessions.filter(s => {
    const lastTime = new Date(s.data.lasttime).getTime();
    return now - lastTime <= 24 * 60 * 60 * 1000;
  });

  if (sessions.length > maxUsers) sessions = sessions.slice(0, maxUsers);

  saveSessions(sessions);
  res.json({ success: true });
});

// 获取简要用户信息列表
app.get('/sessions', (req, res) => {
  const sessions = loadSessions();
  const result = sessions.map(s => ({
    sessionId: s.sessionId,
    identifier: s.data.identifier,
    lasttime: s.data.lasttime
  }));
  res.json(result);
});

// 恢复某个用户数据
app.post('/restore', (req, res) => {
  const { sessionId } = req.body;
  const sessions = loadSessions();
  const match = sessions.find(s => s.sessionId === sessionId);
  if (!match) return res.status(404).send('Not found');
  res.json(match.data);
});

// 删除所有保存数据
app.delete('/clear', (req, res) => {
  if (fs.existsSync(dataFile)) fs.unlinkSync(dataFile);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
