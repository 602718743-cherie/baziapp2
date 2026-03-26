/**
 * 八字穿衣运势后端服务
 * 提供人员管理和运势查询API
 */

const express = require('express')
const cors = require('cors')
const dbSkill = require('./skills/dbSkill')
const luckSkill = require('./skills/luckSkill')

const app = express()

// 中间件
app.use(cors())
app.use(express.json())

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err)
  res.status(500).json({ 
    code: -1, 
    msg: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// ==================== 人员管理接口 ====================

/**
 * 获取所有人员列表
 * GET /api/persons
 * Response: { code: 0, data: [{id, name, birthDay, birthTime, isSelf}] }
 */
app.get('/api/persons', async (req, res, next) => {
  try {
    const data = await dbSkill.list()
    res.json({ code: 0, data })
  } catch (error) {
    next(error)
  }
})

/**
 * 获取本人信息
 * GET /api/person/self
 * Response: { code: 0, data: {id, name, birthDay, birthTime, isSelf} }
 */
app.get('/api/person/self', async (req, res, next) => {
  try {
    const data = await dbSkill.getSelf()
    res.json({ code: 0, data })
  } catch (error) {
    next(error)
  }
})

/**
 * 根据ID获取人员信息
 * GET /api/person/:id
 * Response: { code: 0, data: {id, name, birthDay, birthTime, isSelf} }
 */
app.get('/api/person/:id', async (req, res, next) => {
  try {
    const data = await dbSkill.getById(Number(req.params.id))
    if (!data) {
      return res.json({ code: -1, msg: '人员不存在' })
    }
    res.json({ code: 0, data })
  } catch (error) {
    next(error)
  }
})

/**
 * 保存人员信息（新增/更新）
 * POST /api/person/save
 * Body: { id?, name, birthDay, birthTime, isSelf }
 * Response: { code: 0, msg: '保存成功', data: {id, name, birthDay, birthTime, isSelf} }
 */
app.post('/api/person/save', async (req, res, next) => {
  try {
    const { name, birthDay, birthTime } = req.body
    
    // 参数校验
    if (!name || !birthDay || !birthTime) {
      return res.json({ code: -1, msg: '请填写完整信息' })
    }
    
    // 日期格式校验
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDay)) {
      return res.json({ code: -1, msg: '出生日期格式错误，应为 YYYY-MM-DD' })
    }
    
    // 时间格式校验
    if (!/^\d{2}:\d{2}$/.test(birthTime)) {
      return res.json({ code: -1, msg: '出生时间格式错误，应为 HH:MM' })
    }
    
    const data = await dbSkill.save(req.body)
    res.json({ code: 0, msg: '保存成功', data })
  } catch (error) {
    next(error)
  }
})

/**
 * 删除人员信息
 * POST /api/person/delete
 * Body: { id }
 * Response: { code: 0, msg: '删除成功' }
 */
app.post('/api/person/delete', async (req, res, next) => {
  try {
    const { id } = req.body
    if (!id) {
      return res.json({ code: -1, msg: '缺少人员ID' })
    }
    
    const success = await dbSkill.delete(Number(id))
    if (!success) {
      return res.json({ code: -1, msg: '人员不存在' })
    }
    
    res.json({ code: 0, msg: '删除成功' })
  } catch (error) {
    next(error)
  }
})

// ==================== 运势查询接口 ====================

/**
 * 计算今日运势
 * POST /api/luck/today
 * Body: { birthDay, birthTime }
 * Response: { code: 0, data: {bazi, mainWuxing, mainColor, today: {...}} }
 */
app.post('/api/luck/today', (req, res, next) => {
  try {
    const { birthDay, birthTime } = req.body
    
    if (!birthDay || !birthTime) {
      return res.json({ code: -1, msg: '请提供出生日期和时间' })
    }
    
    const data = luckSkill.calcToday(birthDay, birthTime)
    res.json({ code: 0, data })
  } catch (error) {
    next(error)
  }
})

/**
 * 计算本周运势
 * POST /api/luck/week
 * Body: { birthDay, birthTime }
 * Response: { code: 0, data: {bazi, mainWuxing, mainColor, week: [...]} }
 */
app.post('/api/luck/week', (req, res, next) => {
  try {
    const { birthDay, birthTime } = req.body
    
    if (!birthDay || !birthTime) {
      return res.json({ code: -1, msg: '请提供出生日期和时间' })
    }
    
    const data = luckSkill.calcWeek(birthDay, birthTime)
    res.json({ code: 0, data })
  } catch (error) {
    next(error)
  }
})

/**
 * 计算运势（兼容旧接口）
 * POST /api/luck/calc
 * Body: { birthDay, birthTime, type: 'today' | 'week' }
 */
app.post('/api/luck/calc', (req, res, next) => {
  try {
    const { birthDay, birthTime, type } = req.body
    
    if (!birthDay || !birthTime) {
      return res.json({ code: -1, msg: '请提供出生日期和时间' })
    }
    
    const data = type === 'today' 
      ? luckSkill.calcToday(birthDay, birthTime) 
      : luckSkill.calcWeek(birthDay, birthTime)
      
    res.json({ code: 0, data })
  } catch (error) {
    next(error)
  }
})

// ==================== 健康检查接口 ====================

/**
 * 健康检查
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: '八字穿衣运势服务'
  })
})

/**
 * 根路径
 * GET /
 */
app.get('/', (req, res) => {
  res.json({
    name: '八字穿衣运势 API',
    version: '1.0.0',
    description: '提供人员管理和运势查询服务',
    endpoints: {
      persons: {
        list: 'GET /api/persons',
        self: 'GET /api/person/self',
        getById: 'GET /api/person/:id',
        save: 'POST /api/person/save',
        delete: 'POST /api/person/delete'
      },
      luck: {
        today: 'POST /api/luck/today',
        week: 'POST /api/luck/week',
        calc: 'POST /api/luck/calc (兼容旧接口)'
      },
      health: 'GET /health'
    }
  })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({ code: -1, msg: '接口不存在' })
})

// 启动服务
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`\n✅ 八字穿衣运势服务已启动`)
  console.log(`🌐 服务地址: http://localhost:${PORT}`)
  console.log(`📖 API文档: http://localhost:${PORT}/`)
  console.log(`💚 健康检查: http://localhost:${PORT}/health\n`)
})