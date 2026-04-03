// pages/query/query.js
const storageUtil = require('../../utils/storage.js')
const luckUtil = require('../../utils/luck.js')
const baziUtil = require('../../utils/bazi.js')

Page({
  data: {
    queryType: 'today',
    persons: [],
    selectedIndex: 0,
    selectedPerson: null,
    birthDay: '',
    birthTime: '',
    todayDay: '',
    todayMonth: '',
    todayYear: '',
    todayWeekday: '',
    todayGanZhi: ''
  },

  onLoad() {
    this.initTodayInfo()
    this.loadPersons()
  },

  onShow() {
    this.loadPersons()
  },

  initTodayInfo() {
    const now = new Date()
    const weekdays = ['周日','周一','周二','周三','周四','周五','周六']
    const dayGZ = baziUtil.getDayGanZhi(now)
    this.setData({
      todayDay: now.getDate(),
      todayMonth: now.getMonth() + 1,
      todayYear: now.getFullYear(),
      todayWeekday: weekdays[now.getDay()],
      todayGanZhi: dayGZ
    })
  },

  loadPersons() {
    const persons = storageUtil.getPersons()
    const selfIndex = persons.findIndex(p => p.isSelf)
    const idx = selfIndex >= 0 ? selfIndex : 0
    const person = persons[idx] || null
    // 给每个人添加 displayName 用于 picker 显示
    const displayPersons = persons.map(p => ({
      ...p,
      displayName: p.name + (p.isSelf ? '（本人）' : '')
    }))
    this.setData({
      persons: displayPersons,
      selectedIndex: idx,
      selectedPerson: person,
      birthDay: person ? person.birthDay : '',
      birthTime: person ? person.birthTime : ''
    })
  },

  switchQueryType(e) {
    this.setData({ queryType: e.currentTarget.dataset.type })
  },

  onPersonChange(e) {
    const idx = Number(e.detail.value)
    const person = this.data.persons[idx]
    this.setData({
      selectedIndex: idx,
      selectedPerson: person,
      birthDay: person ? person.birthDay : '',
      birthTime: person ? person.birthTime : ''
    })
  },

  onBirthDayChange(e) {
    this.setData({ birthDay: e.detail.value })
  },

  onBirthTimeChange(e) {
    this.setData({ birthTime: e.detail.value })
  },

  onQuery() {
    const { birthDay, birthTime, queryType } = this.data
    if (!birthDay || !birthTime) {
      wx.showToast({ title: '请选择出生日期和时间', icon: 'none' })
      return
    }
    wx.showLoading({ title: '计算中...' })
    try {
      const result = queryType === 'today'
        ? luckUtil.calcToday(birthDay, birthTime)
        : luckUtil.calcWeek(birthDay, birthTime)
      wx.hideLoading()
      const personName = this.data.selectedPerson ? this.data.selectedPerson.name : ''
      wx.navigateTo({
        url: `/pages/result/result?type=${queryType}&data=${encodeURIComponent(JSON.stringify(result))}&birthDay=${birthDay}&birthTime=${birthTime}&personName=${encodeURIComponent(personName)}`
      })
    } catch (error) {
      wx.hideLoading()
      wx.showToast({ title: '计算失败，请重试', icon: 'none' })
      console.error('查询失败', error)
    }
  }
})
