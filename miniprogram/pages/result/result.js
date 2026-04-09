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

    // 根据命主五行动态生成描述
    const buildDescs = (mainWx, dayWx) => {
      const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }
      const ke    = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' }
      const ALL   = ['木', '火', '土', '金', '水']
      const jiWxList   = ALL.filter(w => w === mainWx || sheng[w] === mainWx).join('、')
      const cijiWx     = sheng[mainWx]
      const pingWxList = ALL.filter(w => ke[w] === mainWx && w !== dayWx).join('、')
      const jiachWx    = ke[mainWx]
      return {
        ji:     `${jiWxList}五行与${mainWx}（命主）同气或相生，为贵人色，穿上易招贵人相助，与环境磁场和谐，宜主动出击。`,
        ciji:   `${mainWx}（命主）生助${cijiWx}五行，能量外放，穿上适合合作沟通、商务谈判，付出后易有所得。`,
        ping:   `${pingWxList || '此'}五行克制${mainWx}（命主），但今日不构成直接冲突，穿上状态偏平，无明显助力，重要场合建议换吉色。`,
        jiacha: `${mainWx}（命主）克制${jiachWx}五行，穿上如逆水行舟，易消耗自身能量、精力外泄，今日尽量回避。`,
        buyi:   `今日${dayWx}五行克制${mainWx}（命主），为不利色，穿上易感压力阻力，运势受压，建议今日回避此色系。`
      }
    }

    let todayAdvice = { ji: [], ciji: [], ping: [], jiacha: [], buyi: [], descs: {} }
    if (type === 'today' && result.today) {
      const t = result.today
      const mainWx = result.mainWuxing || ''
      const dayWx  = t.wuxing || ''
      todayAdvice = {
        ji:     t.ji     || t.suitable   || [],
        ciji:   t.ciji   || [],
        ping:   t.ping   || [],
        jiacha: t.jiacha || [],
        buyi:   t.buyi   || t.unsuitable || [],
        descs:  buildDescs(mainWx, dayWx)
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
