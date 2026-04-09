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

    let todayAdvice = { ji: [], ciji: [], ping: [], jiacha: [], buyi: [] }
    if (type === 'today' && result.today) {
      const t = result.today
      todayAdvice = {
        ji:     t.ji     || t.suitable   || [],
        ciji:   t.ciji   || [],
        ping:   t.ping   || [],
        jiacha: t.jiacha || [],
        buyi:   t.buyi   || t.unsuitable || []
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
