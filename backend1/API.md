# 八字穿衣运势 API 文档

## 基础信息

- **服务名称**: 八字穿衣运势服务
- **版本**: v1.0.0
- **基础URL**: `http://localhost:3000`
- **协议**: HTTP
- **数据格式**: JSON

## 通用响应格式

所有接口响应均遵循以下格式：

```json
{
  "code": 0,          // 0表示成功，-1表示失败
  "msg": "操作成功",   // 提示信息
  "data": {}          // 响应数据（可选）
}
```

---

## 1. 人员管理接口

### 1.1 获取所有人员列表

**接口**: `GET /api/persons`

**描述**: 获取所有已保存的人员信息，本人优先排序

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "name": "张三",
      "birthDay": "1990-05-15",
      "birthTime": "08:30",
      "isSelf": true
    },
    {
      "id": 2,
      "name": "李四",
      "birthDay": "1985-10-20",
      "birthTime": "14:45",
      "isSelf": false
    }
  ]
}
```

---

### 1.2 获取本人信息

**接口**: `GET /api/person/self`

**描述**: 获取标记为"本人"的人员信息

**请求参数**: 无

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "name": "张三",
    "birthDay": "1990-05-15",
    "birthTime": "08:30",
    "isSelf": true
  }
}
```

**说明**: 如果没有本人信息，`data` 为 `null`

---

### 1.3 根据ID获取人员信息

**接口**: `GET /api/person/:id`

**描述**: 根据人员ID获取详细信息

**路径参数**:
- `id` (number, 必填): 人员ID

**请求示例**: `GET /api/person/1`

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "name": "张三",
    "birthDay": "1990-05-15",
    "birthTime": "08:30",
    "isSelf": true
  }
}
```

**错误响应**:
```json
{
  "code": -1,
  "msg": "人员不存在"
}
```

---

### 1.4 保存人员信息（新增/更新）

**接口**: `POST /api/person/save`

**描述**: 新增或更新人员信息

**请求体**:
```json
{
  "id": 1,                      // 可选，有则更新，无则新增
  "name": "张三",                // 必填，人员昵称
  "birthDay": "1990-05-15",     // 必填，出生日期 YYYY-MM-DD
  "birthTime": "08:30",         // 必填，出生时间 HH:MM
  "isSelf": true                // 可选，是否本人，默认false
}
```

**字段说明**:
- `id`: 更新时必填，新增时不传
- `name`: 人员昵称，1-20个字符
- `birthDay`: 出生日期，格式 `YYYY-MM-DD`
- `birthTime`: 出生时间，格式 `HH:MM` (24小时制)
- `isSelf`: 是否本人，如果设为true，会自动取消其他人的本人标记

**响应示例**:
```json
{
  "code": 0,
  "msg": "保存成功",
  "data": {
    "id": 1,
    "name": "张三",
    "birthDay": "1990-05-15",
    "birthTime": "08:30",
    "isSelf": true
  }
}
```

**错误响应**:
```json
{
  "code": -1,
  "msg": "请填写完整信息"
}
```
```json
{
  "code": -1,
  "msg": "出生日期格式错误，应为 YYYY-MM-DD"
}
```

---

### 1.5 删除人员信息

**接口**: `POST /api/person/delete`

**描述**: 删除指定人员信息

**请求体**:
```json
{
  "id": 1  // 必填，人员ID
}
```

**响应示例**:
```json
{
  "code": 0,
  "msg": "删除成功"
}
```

**错误响应**:
```json
{
  "code": -1,
  "msg": "人员不存在"
}
```

---

## 2. 运势查询接口

### 2.1 计算今日运势

**接口**: `POST /api/luck/today`

**描述**: 根据出生信息计算今日穿衣运势

**请求体**:
```json
{
  "birthDay": "1990-05-15",   // 必填，出生日期
  "birthTime": "08:30"        // 必填，出生时间
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "bazi": "庚午 辛巳 甲寅 戊辰",
    "mainWuxing": "木",
    "mainColor": "绿色系",
    "today": {
      "date": "2026-03-26",
      "ganZhi": "丙申",
      "wuxing": "火",
      "suitable": ["绿色系", "火红色系"],
      "unsuitable": ["金白色系"],
      "normal": ["黄色/棕色系", "黑色/蓝色系"],
      "mood": "状态顺畅，心情舒畅",
      "activity": "适合出行、约会、办事"
    }
  }
}
```

**字段说明**:
- `bazi`: 完整八字（年月日时四柱）
- `mainWuxing`: 命主五行属性
- `mainColor`: 命主对应色系
- `today.date`: 查询日期
- `today.ganZhi`: 当日干支
- `today.wuxing`: 当日五行属性
- `today.suitable`: 适合穿着的色系列表
- `today.unsuitable`: 不适合穿着的色系列表
- `today.normal`: 平级色系列表
- `today.mood`: 当日心情状态
- `today.activity`: 活动建议

---

### 2.2 计算本周运势

**接口**: `POST /api/luck/week`

**描述**: 根据出生信息计算未来7天穿衣运势

**请求体**:
```json
{
  "birthDay": "1990-05-15",
  "birthTime": "08:30"
}
```

**响应示例**:
```json
{
  "code": 0,
  "data": {
    "bazi": "庚午 辛巳 甲寅 戊辰",
    "mainWuxing": "木",
    "mainColor": "绿色系",
    "week": [
      {
        "date": "2026-03-26",
        "weekday": "周三",
        "ganZhi": "丙申",
        "wuxing": "火",
        "suitable": ["绿色系", "红色系"],
        "unsuitable": ["白色系"],
        "normal": ["黄色/棕色系", "黑色/蓝色系"],
        "mood": "状态顺畅，心情舒畅",
        "activity": "适合出行、约会、办事"
      },
      // ... 共7天数据
    ]
  }
}
```

---

### 2.3 计算运势（兼容接口）

**接口**: `POST /api/luck/calc`

**描述**: 兼容旧版接口，根据type参数返回今日或本周运势

**请求体**:
```json
{
  "birthDay": "1990-05-15",
  "birthTime": "08:30",
  "type": "today"  // 'today' 或 'week'
}
```

**响应格式**: 与 2.1 或 2.2 相同

---

## 3. 系统接口

### 3.1 健康检查

**接口**: `GET /health`

**描述**: 检查服务运行状态

**响应示例**:
```json
{
  "status": "ok",
  "timestamp": "2026-03-26T06:38:09.123Z",
  "service": "八字穿衣运势服务"
}
```

---

### 3.2 API信息

**接口**: `GET /`

**描述**: 获取API基本信息和接口列表

**响应示例**:
```json
{
  "name": "八字穿衣运势 API",
  "version": "1.0.0",
  "description": "提供人员管理和运势查询服务",
  "endpoints": {
    "persons": {
      "list": "GET /api/persons",
      "self": "GET /api/person/self",
      "getById": "GET /api/person/:id",
      "save": "POST /api/person/save",
      "delete": "POST /api/person/delete"
    },
    "luck": {
      "today": "POST /api/luck/today",
      "week": "POST /api/luck/week",
      "calc": "POST /api/luck/calc (兼容旧接口)"
    },
    "health": "GET /health"
  }
}
```

---

## 4. 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| -1 | 通用错误（参数错误、数据不存在、操作失败等） |

---

## 5. 使用示例

### 5.1 完整流程示例

```javascript
// 1. 新增本人信息
const person = await fetch('http://localhost:3000/api/person/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '张三',
    birthDay: '1990-05-15',
    birthTime: '08:30',
    isSelf: true
  })
})

// 2. 查询今日运势
const luck = await fetch('http://localhost:3000/api/luck/today', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    birthDay: '1990-05-15',
    birthTime: '08:30'
  })
})

// 3. 获取所有人员列表
const persons = await fetch('http://localhost:3000/api/persons')
```

### 5.2 cURL 示例

```bash
# 查询今日运势
curl -X POST http://localhost:3000/api/luck/today \
  -H "Content-Type: application/json" \
  -d '{"birthDay":"1990-05-15","birthTime":"08:30"}'

# 获取人员列表
curl http://localhost:3000/api/persons

# 保存人员信息
curl -X POST http://localhost:3000/api/person/save \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","birthDay":"1990-05-15","birthTime":"08:30","isSelf":true}'
```

---

## 6. 数据存储说明

- 数据存储方式：JSON 文件（默认）
- 存储路径：`backend1/data/persons.json`
- 数据持久化：本地文件系统
- 可扩展性：支持切换到 MongoDB 或 MySQL

---

## 7. 部署说明

### 7.1 安装依赖
```bash
cd backend1
npm install
```

### 7.2 启动服务
```bash
npm start
# 或
node server.js
```

### 7.3 环境变量
- `PORT`: 服务端口，默认 3000
- `NODE_ENV`: 运行环境，development 或 production

---

## 8. 注意事项

1. **时间格式**: 所有时间使用24小时制，精确到分钟
2. **日期格式**: 所有日期使用 `YYYY-MM-DD` 格式
3. **本人标记**: 同一时间只能有一个人员标记为"本人"
4. **数据安全**: 生产环境建议增加身份验证和数据加密
5. **跨域支持**: 已配置 CORS，支持前端跨域请求

---

**文档版本**: v1.0.0  
**更新日期**: 2026-03-26
