# 八字穿衣运势应用

> 基于中国传统五行理论的智能穿衣配色建议应用

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![WeChat](https://img.shields.io/badge/WeChat-MiniProgram-07C160.svg)](https://mp.weixin.qq.com/)

## ✨ 项目简介

八字穿衣运势应用是一款融合传统文化与现代科技的生活服务类应用，通过解析用户的生辰八字，结合五行生克理论，为用户提供个性化的每日穿衣配色建议，帮助用户在日常生活中趋吉避凶。

### 核心功能

- 🎯 **八字解析**: 根据出生年月日时自动生成完整八字
- 🎨 **穿衣建议**: 基于五行生克关系提供三级色系建议（适合/不适合/平）
- 📅 **多周期查询**: 支持查询今日和本周运势
- 👥 **多人管理**: 存储多个家人朋友信息，快速切换查询
- 🔒 **隐私保护**: 所有数据本地存储，保护用户隐私

### 技术特色

- ⚡️ 前后端分离架构，支持纯前端运行
- 🎁 提供Web版、微信小程序双端体验
- 🧩 模块化技能设计，易于扩展维护
- 📦 完整的部署方案，支持多种部署方式

## 📦 项目结构

```
baziapp2/
├── index.html              # Web前端页面
├── PRD.md                  # 产品需求文档
├── DEPLOY.md               # 部署文档
├── README.md               # 项目说明
├── backend1/               # 后端服务
│   ├── server.js          # Express服务入口
│   ├── skills/            # 核心技能模块
│   │   ├── baziSkill.js  # 八字计算模块
│   │   ├── luckSkill.js  # 运势计算模块
│   │   └── dbSkill.js    # 数据存储模块
│   ├── data/             # 数据文件目录
│   ├── package.json      # 依赖配置
│   └── API.md            # API接口文档
└── miniprogram/           # 微信小程序
    ├── app.js            # 小程序入口
    ├── app.json          # 全局配置
    ├── app.wxss          # 全局样式
    ├── pages/            # 页面文件
    │   ├── query/        # 查询页
    │   ├── my/           # 我的页
    │   └── result/       # 结果页
    ├── utils/            # 工具函数
    │   ├── bazi.js       # 八字计算工具
    │   ├── luck.js       # 运势计算工具
    │   └── storage.js    # 本地存储工具
    └── README.md         # 小程序说明
```

## 🚀 快速开始

### 前置要求

- Node.js >= 16.0.0
- npm 或 yarn
- 微信开发者工具（小程序版）
- 现代浏览器（Web版）

### 方式一：纯前端体验（Web版）

**最简单的方式，无需后端！**

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/wuxing-luck.git
cd wuxing-luck

# 2. 直接打开 index.html
# 方式1: 双击打开
open index.html

# 方式2: 使用 http-server
npx http-server .

# 访问 http://localhost:8080
```

### 方式二：启动后端服务

```bash
# 1. 进入后端目录
cd backend1

# 2. 安装依赖
npm install

# 3. 启动服务
npm start

# 服务运行在 http://localhost:3000
```

### 方式三：微信小程序

```bash
# 1. 打开微信开发者工具

# 2. 导入项目
# - 选择 miniprogram 目录
# - 填写 AppID（测试可使用测试号）

# 3. 编译预览
# - 点击"编译"按钮
# - 在模拟器中查看效果
```

## 💡 使用指南

### Web版使用流程

1. **首次使用**
   - 打开应用
   - 切换到"我的"页面
   - 点击"新增人员"
   - 填写姓名、出生日期、出生时间
   - 标记为"本人"
   - 保存

2. **查询运势**
   - 回到"查询"页面
   - 自动选中本人信息
   - 选择查询类型（今日/本周）
   - 点击"立即查询"
   - 查看穿衣建议

3. **管理人员**
   - 在"我的"页面编辑或删除人员
   - 支持保存多个家人朋友信息

### 小程序使用流程

1. 扫码进入小程序
2. 首次进入添加本人信息
3. 选择查询周期（今日/本周）
4. 查看穿衣色系建议
5. 可添加家人朋友信息快速切换

## 🎨 功能演示

### 今日运势查询

```
命主信息：
八字：甲午 戊午 己巳 戊辰
五行属性：土
对应色系：黄色/棕色系

今日穿衣建议（2026-03-26）：
✅ 适合：黄色/棕色系
❌ 不适合：绿色系
⚪ 平：红色系、白色系、黑色/蓝色系

心情状态：状态顺畅，心情舒畅
活动建议：适合出行、约会、办事
```

### 本周运势查询

```
未来7天穿衣建议：

03-26 周四：适合 黄色/棕色系 | 不适合 绿色系
03-27 周五：适合 黄色/棕色系 | 不适合 白色系
03-28 周六：适合 黄色/棕色系、红色系 | 不适合 白色系
...
```

## 🛠 技术栈

### 前端技术

- **Web版**: HTML5 + CSS3 + JavaScript (ES6)
- **小程序**: 微信小程序原生框架
- **UI风格**: 苹果极简风格

### 后端技术

- **框架**: Node.js + Express.js
- **数据存储**: JSON文件 / MongoDB（可选）
- **进程管理**: PM2

### 核心算法

- 八字计算：基于天干地支系统
- 五行生克：传统五行相生相克理论
- 颜色映射：五行与色系对应关系

## 📚 文档导航

- [📋 产品需求文档 (PRD.md)](PRD.md) - 完整的产品设计和功能说明
- [🚀 部署文档 (DEPLOY.md)](DEPLOY.md) - 详细的部署指南和运维方案
- [🔌 API文档 (backend1/API.md)](backend1/API.md) - 后端接口说明
- [📱 小程序文档 (miniprogram/README.md)](miniprogram/README.md) - 小程序开发说明

## 🌐 部署方案

### 快速部署（推荐新手）

**Vercel 一键部署**:

```bash
npm install -g vercel
vercel
```

**Netlify 部署**:

```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

### 生产环境部署

详见 [部署文档](DEPLOY.md)，支持：

- ✅ Nginx + PM2 部署
- ✅ Docker 容器化部署
- ✅ 云服务器部署（阿里云、腾讯云）
- ✅ Serverless 部署

## 🔧 开发指南

### 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
cd backend1
npm run dev  # 或 nodemon server.js

# 3. 访问应用
# Web: http://localhost:8080
# API: http://localhost:3000
```

### 代码规范

- 使用 ES6+ 语法
- 遵循 Airbnb JavaScript Style Guide
- 函数注释使用 JSDoc 格式
- 提交前确保代码通过 ESLint 检查

### 扩展开发

#### 添加新的五行属性

```javascript
// skills/luckSkill.js
const COLOR_MAP = {
  '木': '绿色系',
  '火': '红色系',
  '土': '黄色/棕色系',
  '金': '白色系',
  '水': '黑色/蓝色系',
  // 添加新的映射
  '风': '青色系'
}
```

#### 添加新的API接口

```javascript
// server.js
app.get('/api/new-endpoint', (req, res) => {
  // 实现逻辑
  res.json({ code: 0, data: {} })
})
```

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具链相关
```

## 📝 更新日志

### v1.0.0 (2026-03-26)

**初始版本发布**

- ✅ 完成八字计算核心算法
- ✅ 实现五行运势计算
- ✅ 完成Web版前端
- ✅ 完成后端API服务
- ✅ 完成微信小程序版本
- ✅ 编写完整文档

## ⚠️ 注意事项

### 免责声明

本应用基于中国传统五行理论开发，所提供的穿衣建议仅供娱乐和文化参考，不构成任何专业建议。用户应理性看待，切勿过度依赖。

### 隐私保护

- 所有数据默认本地存储
- 不收集用户敏感信息
- 用户可随时删除个人数据
- 符合相关隐私保护法规

### 使用限制

- 仅供个人学习和研究使用
- 商业使用需获得授权
- 不得用于非法用途

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- 感谢中国传统文化的智慧传承
- 感谢开源社区的技术支持
- 感谢所有贡献者的付出

## 📞 联系方式

- **项目地址**: https://github.com/yourusername/wuxing-luck
- **问题反馈**: https://github.com/yourusername/wuxing-luck/issues
- **邮箱**: your-email@example.com

## 🌟 Star History

如果这个项目对你有帮助，请给我们一个 Star ⭐️

---

**Made with ❤️ by 产品开发团队**

**版本**: v1.0.0 | **更新时间**: 2026-03-26
