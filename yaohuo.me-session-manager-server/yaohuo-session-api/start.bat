@echo off
if "%1"=="h" goto begin
mshta vbscript:createobject("wscript.shell").run("%~nx0 h",0)(window.close)&&exit
:begin
cd /d D:\temp\s1  # 切换项目目录
node index.js     # 启动Node服务
