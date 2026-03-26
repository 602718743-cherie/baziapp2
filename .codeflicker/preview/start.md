# 五行穿衣运势 启动指南

## 项目概述
这是一个基于五行八字的穿衣运势 Web 应用，包含后端 API 服务和静态 Web 前端页面。

### ⚠️ 必须按顺序启动

#### 步骤 1：启动后端服务

```bash
cd backend1
node server.js
```

等待日志显示：`✅ 八字穿衣运势服务已启动`

#### 步骤 2：打开前端页面

直接在浏览器中打开项目根目录下的 `index.html` 文件，或使用 VSCode Live Server 等工具。

**访问地址**：
- 后端 API：http://localhost:3000
- 前端页面：file:///path/to/index.html 或通过静态服务器访问

```yaml
backend:
  subProjectPath: backend1
  command: node server.js
  cwd: backend1
  port: 3000
  role: backend
  description: 八字穿衣运势 API 服务

frontend:
  subProjectPath: .
  command: null
  cwd: .
  port: null
  previewUrl: index.html
  role: frontend
  description: Web 前端静态页面（需要在浏览器中直接打开）
```

## 其他项目

### miniprogram - 微信小程序

微信小程序版本，需要使用微信开发者工具打开 `miniprogram` 目录。

```yaml
miniprogram:
  subProjectPath: miniprogram
  command: null
  cwd: miniprogram
  port: null
  previewUrl: null
  role: unknown
  description: 微信小程序版本（需使用微信开发者工具）
```
