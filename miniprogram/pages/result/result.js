// pages/result/result.js
const COLOR_MAP = {
  '绿色系':      '#4caf50',
  '红色系':      '#e53935',
  '黄色/棕色系': '#f0a500',
  '白色系':      '#c8b89a',
  '黑色/蓝色系': '#37474f'
}

Page({
  data: {
    type: 'today',
    result: null,
    birthDay: '',
    birthTime: '',
    dateDay: '',
    dateMonth: '',
    dateYear: '',
    dateWeekday: '',
    todayAdvice: { ji: [], ciji: [], ping: [], jiacha: [], buyi: [] },
    colorMap: COLOR_MAP,
    colorMapRef: COLOR_MAP
  },

  onLoad(options) {
    const type = options.type || 'today'
    const result = JSON.parse(decodeURIComponent(options.data))
    const birthDay = options.birthDay || ''
    const birthTime = options.birthTime || ''
    const personName = options.personName ? decodeURIComponent(options.personName) : ''
    const pageTitle = personName ? `${personName}的穿衣出行指南` : '穿衣出行指南'

    wx.setNavigationBarTitle({ title: type === 'today' ? '今日运势' : '本周运势' })

    const weekdays = ['周日','周一','周二','周三','周四','周五','周六']
    const now = new Date()
    const baziUtil = require('../../utils/bazi.js')
    const dateGanZhi = result.today ? result.today.ganZhi : baziUtil.getDayGanZhi(now)

    // 颜色→五行反向映射
    const COLOR_TO_WX = {
      '白色系': '金', '黑色/蓝色系': '水', '绿色系': '木',
      '红色系': '火', '黄色/棕色系': '土'
    }
    const WX_REL = (me, w) => {
      const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }
      const ke    = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' }
      if (w === me)           return '同我'
      if (sheng[w] === me)    return '生我'
      if (sheng[me] === w)    return '我生'
      if (ke[me] === w)       return '我克'
      if (ke[w] === me)       return '克我'
      return ''
    }
    // 根据实际色系列表生成对应描述
    const descForLevel = (colors, mainWx, level) => {
      if (!colors || colors.length === 0) return ''
      const wxList = colors.map(c => COLOR_TO_WX[c]).filter(Boolean)
      const wxStr = wxList.join('、')
      const relDesc = wxList.map(w => {
        const rel = WX_REL(mainWx, w)
        const relMap = { '同我': '与命主同气', '生我': '生扶命主', '我生': '命主所生', '我克': '命主所克', '克我': '克制命主' }
        return `${w}（${relMap[rel] || rel}）`
      }).join('、')
      if (level === 'ji')     return `${relDesc}，为贵人色，穿上易招贵人相助，与环境磁场和谐，宜主动出击。`
      if (level === 'ciji')   return `${relDesc}，能量外放，穿上适合合作沟通、商务谈判，付出后易有所得。`
      if (level === 'ping')   return `${relDesc}，与命主有一定冲突，穿上状态偏平，无明显助力，重要场合建议换吉色。`
      if (level === 'jiacha') return `${relDesc}，穿上易消耗自身能量、精力外泄，今日尽量回避。`
      if (level === 'buyi')   return `${relDesc}，为不利色，穿上易感压力阻力，运势受压，建议今日回避此色系。`
      return ''
    }

    let todayAdvice = { ji: [], ciji: [], ping: [], jiacha: [], buyi: [], descs: {} }
    if (type === 'today' && result.today) {
      const t = result.today
      const mainWx = result.mainWuxing || ''
      const ji     = t.ji     || t.suitable   || []
      const ciji   = t.ciji   || []
      const ping   = t.ping   || []
      const jiacha = t.jiacha || []
      const buyi   = t.buyi   || t.unsuitable || []
      todayAdvice = {
        ji, ciji, ping, jiacha, buyi,
        descs: {
          ji:     descForLevel(ji,     mainWx, 'ji'),
          ciji:   descForLevel(ciji,   mainWx, 'ciji'),
          ping:   descForLevel(ping,   mainWx, 'ping'),
          jiacha: descForLevel(jiacha, mainWx, 'jiacha'),
          buyi:   descForLevel(buyi,   mainWx, 'buyi'),
        }
      }
    }

    this.setData({
      type,
      result,
      birthDay,
      birthTime,
      personName,
      pageTitle,
      dateDay: now.getDate(),
      dateMonth: now.getMonth() + 1,
      dateYear: now.getFullYear(),
      dateWeekday: weekdays[now.getDay()],
      dateGanZhi,
      todayAdvice
    })
  },

  onBack() {
    wx.navigateBack()
  }
})
