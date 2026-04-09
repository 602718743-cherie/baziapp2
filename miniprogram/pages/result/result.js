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
    const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }
    const ke    = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' }

    // 获取五行与命主的基础关系
    const getBaseRel = (me, w) => {
      if (w === me)           return '同我'
      if (sheng[w] === me)    return '生我'
      if (sheng[me] === w)    return '我生'
      if (ke[me] === w)       return '我克'
      if (ke[w] === me)       return '克我'
      return ''
    }

    // 根据当日干支判断某五行被强化还是被削弱（返回影响说明或空字符串）
    const getDayEffect = (wx, ganWx, zhiWx) => {
      const dayWxs = [ganWx, zhiWx].filter(Boolean)
      const notes = []
      dayWxs.forEach(d => {
        if (d === wx) notes.push(`今日${d}旺，同气加持`)
        else if (ke[d] === wx) notes.push(`今日${d}旺，受克力减`)
        else if (ke[wx] === d) notes.push(`今日${d}旺，反成护盾`)
        else if (sheng[d] === wx) notes.push(`今日${d}旺，生助更强`)
      })
      // 去重取最关键一条
      return notes.length > 0 ? notes[0] : ''
    }

    // 每级描述模板
    const relTextMap = {
      '同我': '与命主同气',
      '生我': '生扶命主',
      '我生': '命主泄气于此',
      '我克': '命主克制耗气',
      '克我': '克制命主'
    }
    const levelAdvice = {
      ji:     '为贵人色，穿上易招贵人，整体磁场顺畅。',
      ciji:   '为合作色，适合沟通谈判，付出易有收获。',
      ping:   '状态偏平，无明显助力，重要场合建议换吉色。',
      jiacha: '易消耗精力，做事费力，今日尽量少用。',
      buyi:   '为不利色，易感压力阻力，建议今日回避。'
    }

    const descForLevel = (colors, mainWx, level, ganWx, zhiWx) => {
      if (!colors || colors.length === 0) return ''
      const parts = colors.map(c => {
        const w = COLOR_TO_WX[c]
        if (!w) return c
        const rel = getBaseRel(mainWx, w)
        const relText = relTextMap[rel] || ''
        const effect = getDayEffect(w, ganWx, zhiWx)
        const effectStr = effect ? `，${effect}` : ''
        return `${c}（${w}${relText ? '·' + relText : ''}${effectStr}）`
      }).join('、')
      return `${parts}，${levelAdvice[level]}`
    }

    let todayAdvice = { ji: [], ciji: [], ping: [], jiacha: [], buyi: [], descs: {} }
    if (type === 'today' && result.today) {
      const t = result.today
      const mainWx = result.mainWuxing || ''
      const ganWx  = t.wuxing     || ''
      const zhiWx  = t.zhiWuxing  || ''
      const ji     = t.ji     || t.suitable   || []
      const ciji   = t.ciji   || []
      const ping   = t.ping   || []
      const jiacha = t.jiacha || []
      const buyi   = t.buyi   || t.unsuitable || []
      todayAdvice = {
        ji, ciji, ping, jiacha, buyi,
        descs: {
          ji:     descForLevel(ji,     mainWx, 'ji',     ganWx, zhiWx),
          ciji:   descForLevel(ciji,   mainWx, 'ciji',   ganWx, zhiWx),
          ping:   descForLevel(ping,   mainWx, 'ping',   ganWx, zhiWx),
          jiacha: descForLevel(jiacha, mainWx, 'jiacha', ganWx, zhiWx),
          buyi:   descForLevel(buyi,   mainWx, 'buyi',   ganWx, zhiWx),
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
