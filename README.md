# session-manager
对某个网站的sessionStorage 进行保存并恢复

session-manager将数据保存在localStorage 中，server版将数据保存在本地json中，用以支持多设备同步及大数据保存。

#### 环境

* Node.js 版本（13.14）
* body-parser: ^1.19.0
* cors: ^2.8.5
* express: 4.17.1
* win7/win10

#### node-server
```javascript
//安装依赖 
npm install
//启动服务
node index.js
//如果一切正常，您将看到输出：
Server is running at http://localhost:3000
````
