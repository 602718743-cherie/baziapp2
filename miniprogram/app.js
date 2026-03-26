// app.js
App({
  onLaunch() {
    console.log('八字穿衣指南小程序启动')
    
    // 检查本地存储
    this.globalData.persons = wx.getStorageSync('persons') || []
  },
  
  globalData: {
    persons: [],
    apiBase: 'http://localhost:3000/api' // 开发环境API地址，生产环境需修改
  }
})
