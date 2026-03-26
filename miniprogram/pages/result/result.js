// pages/result/result.js
Page({
  data: {
    type: 'today', // today 或 week
    result: null
  },

  onLoad(options) {
    const type = options.type || 'today'
    const data = JSON.parse(decodeURIComponent(options.data))
    
    this.setData({
      type: type,
      result: data
    })
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: type === 'today' ? '今日运势' : '本周运势'
    })
  },

  // 返回
  onBack() {
    wx.navigateBack()
  }
})
