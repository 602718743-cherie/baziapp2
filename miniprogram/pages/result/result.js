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

    wx.setNavigationBarTitle({ title: type === 'today' ? '今日运势' : '本周运势' })

    const weekdays = ['周日','周一','周二','周三','周四','周五','周六']
    const now = new Date()

    let todayAdvice = { ji: [], ciji: [], ping: [], jiacha: [], buyi: [] }
    if (type === 'today' && result.today) {
      const t = result.today
      // 重新映射到五级分类（使用 luck.js 返回的 suitable/unsuitable）
      todayAdvice = {
        ji:     t.suitable || [],
        ciji:   [],
        ping:   [],
        jiacha: [],
        buyi:   t.unsuitable || []
      }
    }

    this.setData({
      type,
      result,
      birthDay,
      birthTime,
      dateDay: now.getDate(),
      dateMonth: now.getMonth() + 1,
      dateYear: now.getFullYear(),
      dateWeekday: weekdays[now.getDay()],
      todayAdvice
    })
  },

  onBack() {
    wx.navigateBack()
  }
})
