# 八字穿衣运势应用 - 部署文档

## 📋 目录

- [项目概述](#项目概述)
- [技术架构](#技术架构)
- [部署准备](#部署准备)
- [Web版部署](#web版部署)
- [后端服务部署](#后端服务部署)
- [微信小程序部署](#微信小程序部署)
- [完整部署方案](#完整部署方案)
- [运维管理](#运维管理)
- [常见问题](#常见问题)

---

## 项目概述

### 项目简介

八字穿衣运势应用是一款基于中国传统五行理论的生活服务类应用，帮助用户根据个人生辰八字和当日五行属性，获得穿衣配色建议和出行指导。

### 项目结构

```
baziapp2/
├── index.html              # Web前端页面
├── PRD.md                  # 产品需求文档
├── backend1/               # 后端服务
│   ├── server.js          # 服务入口
│   ├── skills/            # 技能模块
│   │   ├── baziSkill.js  # 八字计算
│   │   ├── luckSkill.js  # 运势计算
│   │   └── dbSkill.js    # 数据存储
│   ├── data/             # 数据文件
│   ├── package.json      # 依赖配置
│   └── API.md            # API文档
└── miniprogram/           # 微信小程序
    ├── app.js            # 小程序入口
    ├── app.json          # 全局配置
    ├── pages/            # 页面文件
    ├── utils/            # 工具函数
    └── README.md         # 小程序说明
```

---

## 技术架构

### 前端技术栈

- **Web版**: HTML5 + CSS3 + JavaScript (ES6)
- **小程序**: 微信小程序原生框架

### 后端技术栈

- **语言**: Node.js 16+
- **框架**: Express.js
- **数据存储**: JSON文件 / MongoDB (可选)

### 核心模块

- **baziSkill**: 八字计算模块
- **luckSkill**: 五行运势计算模块
- **dbSkill**: 数据存储管理模块

---

## 部署准备

### 环境要求

#### Web版
- Web服务器（Nginx / Apache / 静态托管服务）
- 现代浏览器（Chrome 90+, Safari 14+, Firefox 88+）

#### 后端服务
- Node.js 16+ 
- npm 或 yarn
- Linux服务器 (推荐 Ubuntu 20.04+)
- 2GB+ 内存
- 10GB+ 硬盘空间

#### 微信小程序
- 微信开发者工具
- 微信小程序账号（个人/企业）
- HTTPS域名（正式环境）

### 工具准备

```bash
# 检查 Node.js 版本
node -v  # 需要 >= 16.0.0

# 检查 npm 版本
npm -v

# 安装 PM2（进程管理器）
npm install -g pm2

# 安装 Nginx（Web服务器）
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

---

## Web版部署

### 方案一：静态文件托管（推荐新手）

#### 1. 使用 Vercel 部署

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署项目
cd /path/to/baziapp2
vercel

# 4. 按提示操作
# - Set up and deploy: Yes
# - Which scope: 选择你的账号
# - Link to existing project: No
# - Project name: wuxing-luck
# - In which directory: ./
```

**特点**:
- ✅ 免费
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 自动部署

#### 2. 使用 Netlify 部署

```bash
# 1. 安装 Netlify CLI
npm install -g netlify-cli

# 2. 登录 Netlify
netlify login

# 3. 初始化项目
cd /path/to/baziapp2
netlify init

# 4. 部署
netlify deploy --prod
```

#### 3. 使用 GitHub Pages

```bash
# 1. 创建 GitHub 仓库
# 2. 推送代码
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/wuxing-luck.git
git push -u origin main

# 3. 在 GitHub 仓库设置中启用 Pages
# Settings → Pages → Source: main branch
```

### 方案二：自建服务器部署

#### 1. 使用 Nginx 部署

**步骤**:

```bash
# 1. 安装 Nginx
sudo apt update
sudo apt install nginx

# 2. 上传文件到服务器
scp index.html user@your-server:/var/www/wuxing-luck/

# 3. 配置 Nginx
sudo nano /etc/nginx/sites-available/wuxing-luck
```

**Nginx 配置文件**:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名
    
    root /var/www/wuxing-luck;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 启用 Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    
    # 缓存静态资源
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
```

**启用配置**:

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/wuxing-luck /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 设置开机自启
sudo systemctl enable nginx
```

#### 2. 配置 HTTPS (使用 Let's Encrypt)

```bash
# 1. 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 2. 获取证书并自动配置
sudo certbot --nginx -d your-domain.com

# 3. 测试自动续期
sudo certbot renew --dry-run
```

---

## 后端服务部署

### 准备工作

```bash
# 1. 上传项目到服务器
scp -r backend1 user@your-server:~/

# 2. 登录服务器
ssh user@your-server

# 3. 进入项目目录
cd ~/backend1

# 4. 安装依赖
npm install
```

### 方案一：使用 PM2 部署（推荐）

#### 1. 安装 PM2

```bash
npm install -g pm2
```

#### 2. 创建 PM2 配置文件

创建 `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'wuxing-luck-api',
    script: './server.js',
    instances: 2,  // 进程数量（根据CPU核心数调整）
    exec_mode: 'cluster',  // 集群模式
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    max_memory_restart: '500M',  // 内存超限重启
    watch: false,  // 生产环境不建议开启
    autorestart: true,  // 自动重启
    max_restarts: 10,  // 最大重启次数
    min_uptime: '10s'  // 最小运行时间
  }]
}
```

#### 3. 启动服务

```bash
# 启动服务
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs wuxing-luck-api

# 监控
pm2 monit

# 重启服务
pm2 restart wuxing-luck-api

# 停止服务
pm2 stop wuxing-luck-api

# 删除服务
pm2 delete wuxing-luck-api
```

#### 4. 设置开机自启

```bash
# 保存当前进程列表
pm2 save

# 生成启动脚本
pm2 startup

# 执行上一步输出的命令（类似下面）
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-username --hp /home/your-username
```

### 方案二：使用 Docker 部署

#### 1. 创建 Dockerfile

```dockerfile
# backend1/Dockerfile
FROM node:16-alpine

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 创建数据目录
RUN mkdir -p data

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "server.js"]
```

#### 2. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    container_name: wuxing-luck-api
    restart: always
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
      - PORT=3000
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

#### 3. 部署

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

### 配置反向代理

#### Nginx 反向代理配置

```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 健康检查
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}
```

---

## 微信小程序部署

### 1. 准备工作

#### 注册小程序账号

1. 访问 [微信公众平台](https://mp.weixin.qq.com)
2. 注册小程序账号
3. 完成小程序信息设置
4. 获取 AppID

#### 配置服务器域名

如果需要调用后端API：

1. 登录小程序后台
2. 开发 → 开发管理 → 开发设置 → 服务器域名
3. 添加 request 合法域名：`https://api.your-domain.com`

### 2. 配置项目

修改 `miniprogram/project.config.json`:

```json
{
  "appid": "wx1234567890abcdef",  // 替换为你的 AppID
  "projectname": "wuxing-luck-miniprogram",
  "setting": {
    "urlCheck": true,  // 生产环境建议开启
    "es6": true,
    "minified": true
  }
}
```

修改 `miniprogram/app.js`（如果使用后端API）:

```javascript
App({
  globalData: {
    apiBase: 'https://api.your-domain.com/api'  // 生产环境API地址
  }
})
```

### 3. 开发者工具操作

#### 导入项目

1. 打开微信开发者工具
2. 点击"导入项目"
3. 选择 `miniprogram` 目录
4. 填写 AppID
5. 点击"导入"

#### 预览和调试

1. **模拟器预览**: 在开发者工具中直接查看
2. **真机调试**: 点击"真机调试"，扫码在手机上调试
3. **预览**: 点击"预览"，扫码在手机上预览

### 4. 上传代码

```
1. 点击开发者工具顶部"上传"按钮
2. 填写版本号（如：1.0.0）
3. 填写项目备注（如：初始版本）
4. 点击"上传"
```

### 5. 提交审核

```
1. 登录小程序后台 https://mp.weixin.qq.com
2. 进入"版本管理"
3. 找到开发版本，点击"提交审核"
4. 填写审核信息：
   - 功能描述：八字穿衣运势查询工具
   - 隐私说明：数据本地存储，不上传服务器
   - 页面配置：添加所有页面路径
5. 提交审核
```

### 6. 发布上线

```
审核通过后：
1. 进入"版本管理"
2. 找到审核版本
3. 点击"发布"
4. 确认发布
```

---

## 完整部署方案

### 方案A：纯前端方案（无后端）

**适用场景**: 个人使用、快速上线、低成本

```
部署内容：
- Web前端（Vercel/Netlify）
- 微信小程序

特点：
✅ 零成本
✅ 快速部署
✅ 无需服务器
✅ 数据本地存储
```

**部署步骤**:

```bash
# 1. 部署Web版
vercel

# 2. 部署小程序
# 使用微信开发者工具上传
```

### 方案B：前后端分离（推荐）

**适用场景**: 商业项目、多用户、需要数据同步

```
部署内容：
- Web前端（Nginx + HTTPS）
- 后端API（Node.js + PM2）
- 微信小程序
- 数据库（可选）

架构：
[用户] → [CDN] → [Nginx] → [前端]
                      ↓
                [反向代理]
                      ↓
              [Node.js API] → [数据库]
```

**部署步骤**:

```bash
# 1. 部署后端
cd backend1
npm install
pm2 start ecosystem.config.js

# 2. 配置Nginx反向代理
sudo nano /etc/nginx/sites-available/api.your-domain.com

# 3. 部署前端
sudo cp index.html /var/www/wuxing-luck/

# 4. 配置HTTPS
sudo certbot --nginx -d your-domain.com -d api.your-domain.com

# 5. 部署小程序
# 使用微信开发者工具上传
```

### 方案C：Docker容器化部署

**适用场景**: 大型项目、需要扩展、多环境

**docker-compose.yml**:

```yaml
version: '3.8'

services:
  # 后端API
  api:
    build: ./backend1
    container_name: wuxing-api
    restart: always
    ports:
      - "3000:3000"
    volumes:
      - ./backend1/data:/app/data
    environment:
      - NODE_ENV=production

  # Nginx
  nginx:
    image: nginx:alpine
    container_name: wuxing-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./index.html:/usr/share/nginx/html/index.html
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
```

**部署**:

```bash
# 启动所有服务
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

---

## 运维管理

### 日志管理

#### PM2 日志

```bash
# 查看所有日志
pm2 logs

# 查看特定应用日志
pm2 logs wuxing-luck-api

# 清空日志
pm2 flush

# 日志轮转（防止日志文件过大）
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

#### Nginx 日志

```bash
# 访问日志
tail -f /var/log/nginx/access.log

# 错误日志
tail -f /var/log/nginx/error.log

# 日志切割（每天）
# 创建 /etc/logrotate.d/nginx
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

### 性能监控

#### PM2 监控

```bash
# 实时监控
pm2 monit

# Web监控面板
pm2 install pm2-server-monit
```

#### 系统资源监控

```bash
# 安装 htop
sudo apt install htop

# 查看系统资源
htop

# 查看端口占用
sudo netstat -tlnp | grep :3000
```

### 备份策略

#### 数据备份脚本

```bash
#!/bin/bash
# backup.sh

# 配置
BACKUP_DIR="/var/backups/wuxing-luck"
DATA_DIR="/home/user/backend1/data"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据
tar -czf $BACKUP_DIR/data_$DATE.tar.gz -C $DATA_DIR .

# 保留最近7天的备份
find $BACKUP_DIR -name "data_*.tar.gz" -mtime +7 -delete

echo "备份完成: $BACKUP_DIR/data_$DATE.tar.gz"
```

**设置定时备份**:

```bash
# 编辑 crontab
crontab -e

# 添加定时任务（每天凌晨2点备份）
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

### 安全加固

#### 防火墙配置

```bash
# 安装 UFW
sudo apt install ufw

# 默认规则
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 允许SSH
sudo ufw allow 22/tcp

# 允许HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

#### API 限流

修改 `backend1/server.js`:

```javascript
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 最多100个请求
  message: '请求过于频繁，请稍后再试'
})

app.use('/api/', limiter)
```

---

## 常见问题

### 1. 端口被占用

**问题**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决**:

```bash
# 查找占用端口的进程
sudo lsof -i :3000

# 杀死进程
sudo kill -9 PID

# 或修改端口
export PORT=3001
node server.js
```

### 2. 权限问题

**问题**: `EACCES: permission denied`

**解决**:

```bash
# 修改文件所有者
sudo chown -R $USER:$USER /path/to/project

# 修改文件权限
chmod -R 755 /path/to/project
```

### 3. 内存不足

**问题**: `FATAL ERROR: Ineffective mark-compacts near heap limit`

**解决**:

```bash
# 增加 Node.js 内存限制
node --max-old-space-size=2048 server.js

# 或在 PM2 配置中设置
# ecosystem.config.js
node_args: '--max-old-space-size=2048'
```

### 4. CORS 跨域问题

**问题**: `Access to fetch at 'http://api...' has been blocked by CORS policy`

**解决**:

```javascript
// server.js 中已配置 cors
const cors = require('cors')
app.use(cors())

// 或指定域名
app.use(cors({
  origin: 'https://your-domain.com'
}))
```

### 5. 小程序请求失败

**问题**: `request:fail url not in domain list`

**解决**:

1. 在小程序后台配置合法域名
2. 确保使用 HTTPS
3. 开发时可在开发者工具设置中关闭"域名校验"

### 6. 数据丢失

**问题**: 服务器重启后数据丢失

**解决**:

```bash
# 确保 data 目录存在
mkdir -p backend1/data

# 检查文件权限
ls -la backend1/data

# 设置定时备份（见上文）
```

---

## 性能优化建议

### 前端优化

```javascript
// 1. 启用浏览器缓存
// 在 Nginx 配置中添加
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 30d;
}

// 2. 压缩资源
// 启用 Gzip
gzip on;
gzip_types text/plain text/css application/json application/javascript;

// 3. 使用 CDN
// 将静态资源上传到 CDN
```

### 后端优化

```javascript
// 1. 使用集群模式
// PM2 配置中设置
instances: 'max',  // 根据CPU核心数自动设置
exec_mode: 'cluster'

// 2. 数据库连接池（如使用MongoDB）
mongoose.connect(uri, {
  maxPoolSize: 10
})

// 3. 响应缓存
const apicache = require('apicache')
app.use(apicache.middleware('5 minutes'))
```

---

## 技术支持

- **文档位置**: `/docs` 目录
- **API文档**: `backend1/API.md`
- **小程序文档**: `miniprogram/README.md`

---

**版本**: v1.0.0  
**更新日期**: 2026-03-26  
**维护团队**: 产品开发团队
