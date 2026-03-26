// pages/query/query.js
const storageUtil = require('../../utils/storage.js')
const luckUtil = require('../../utils/luck.js')

Page({
  data: {
    queryType: 'today', // today 或 week
    persons: [],
    selectedPersonId: null,
    selectedPerson: null,
    birthDay: '',
    birthTime: ''
  },

  onLoad() {
    this.loadPersons()
  },

  onShow() {
    this.loadPersons()
  },

  // 加载人员列表
  loadPersons() {
    const persons = storageUtil.getPersons()
    const self = storageUtil.getSelf()
    
    this.setData({
      persons: persons,
      selectedPersonId: self ? self.id : null,
      selectedPerson: self,
      birthDay: self ? self.birthDay : '',
      birthTime: self ? self.birthTime : ''
    })
  },

  // 切换查询类型
  switchQueryType(e) {
    this.setData({
      queryType: e.currentTarget.dataset.type
    })
  },

  // 选择人员
  onPersonChange(e) {
    const id = Number(e.detail.value)
    const person = this.data.persons.find(p => p.id === id)
    
    this.setData({
      selectedPersonId: id,
      selectedPerson: person,
      birthDay: person.birthDay,
      birthTime: person.birthTime
    })
  },

  // 临时输入
  onTempInput() {
    wx.navigateTo({
      url: '/pages/temp-input/temp-input'
    })
  },

  // 立即查询
  onQuery() {
    const { birthDay, birthTime, queryType } = this.data
    
    if (!birthDay || !birthTime) {
      wx.showToast({
        title: '请选择或输入命主信息',
        icon: 'none'
      })
      return
    }

    wx.showLoading({ title: '计算中...' })

    try {
      const result = queryType === 'today'
        ? luckUtil.calcToday(birthDay, birthTime)
        : luckUtil.calcWeek(birthDay, birthTime)

      wx.hideLoading()

      // 跳转到结果页
      wx.navigateTo({
        url: `/pages/result/result?type=${queryType}&data=${encodeURIComponent(JSON.stringify(result))}`
      })
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '计算失败，请重试',
        icon: 'none'
      })
      console.error('查询失败', error)
    }
  }
})
