// pages/my/my.js
const storageUtil = require('../../utils/storage.js')
const baziUtil = require('../../utils/bazi.js')

Page({
  data: {
    persons: [],
    showModal: false,
    modalTitle: '新增命主',
    formData: { id: null, name: '', birthDay: '', birthTime: '', isSelf: false }
  },

  onLoad() { this.loadPersons() },
  onShow() { this.loadPersons() },

  loadPersons() {
    const persons = storageUtil.getPersons()
    // 补充 mainWuxingDisplay
    const enriched = persons.map(p => {
      try {
        const info = baziUtil.parseBazi(p.birthDay, p.birthTime)
        return { ...p, mainWuxingDisplay: info.mainWuxingDisplay }
      } catch(e) { return p }
    })
    this.setData({ persons: enriched })
  },

  onAddPerson() {
    this.setData({
      showModal: true, modalTitle: '新增命主',
      formData: { id: null, name: '', birthDay: '', birthTime: '', isSelf: false }
    })
  },

  onEditPerson(e) {
    const person = storageUtil.getById(e.currentTarget.dataset.id)
    this.setData({
      showModal: true, modalTitle: '编辑命主',
      formData: { id: person.id, name: person.name, birthDay: person.birthDay, birthTime: person.birthTime, isSelf: person.isSelf }
    })
  },

  onDeletePerson(e) {
    const id = e.currentTarget.dataset.id
    const person = storageUtil.getById(id)
    wx.showModal({
      title: '确认删除',
      content: `确定删除"${person.name}"？`,
      confirmColor: '#c0392b',
      success: (res) => {
        if (res.confirm) {
          storageUtil.deletePerson(id)
          wx.showToast({ title: '删除成功', icon: 'success' })
          this.loadPersons()
        }
      }
    })
  },

  onNameInput(e) { this.setData({ 'formData.name': e.detail.value }) },
  onBirthDayChange(e) { this.setData({ 'formData.birthDay': e.detail.value }) },
  onBirthTimeChange(e) { this.setData({ 'formData.birthTime': e.detail.value }) },
  onIsSelfChange(e) { this.setData({ 'formData.isSelf': e.detail.value }) },
  onCloseModal() { this.setData({ showModal: false }) },

  onSavePerson() {
    const { formData } = this.data
    if (!formData.name || !formData.birthDay || !formData.birthTime) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    storageUtil.savePerson(formData)
    wx.showToast({ title: formData.id ? '修改成功' : '添加成功', icon: 'success' })
    this.setData({ showModal: false })
    this.loadPersons()
  }
})
