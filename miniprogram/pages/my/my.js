// pages/my/my.js
const storageUtil = require('../../utils/storage.js')

Page({
  data: {
    persons: [],
    showModal: false,
    modalTitle: '新增人员',
    editingPerson: null,
    formData: {
      id: null,
      name: '',
      birthDay: '',
      birthTime: '',
      isSelf: false
    }
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
    this.setData({ persons })
  },

  // 打开新增弹窗
  onAddPerson() {
    this.setData({
      showModal: true,
      modalTitle: '新增人员',
      editingPerson: null,
      formData: {
        id: null,
        name: '',
        birthDay: '',
        birthTime: '',
        isSelf: false
      }
    })
  },

  // 编辑人员
  onEditPerson(e) {
    const id = e.currentTarget.dataset.id
    const person = storageUtil.getById(id)
    
    this.setData({
      showModal: true,
      modalTitle: '编辑人员',
      editingPerson: person,
      formData: {
        id: person.id,
        name: person.name,
        birthDay: person.birthDay,
        birthTime: person.birthTime,
        isSelf: person.isSelf
      }
    })
  },

  // 删除人员
  onDeletePerson(e) {
    const id = e.currentTarget.dataset.id
    const person = storageUtil.getById(id)
    
    wx.showModal({
      title: '确认删除',
      content: `确定删除"${person.name}"的信息吗？`,
      confirmColor: '#FF3B30',
      success: (res) => {
        if (res.confirm) {
          const success = storageUtil.deletePerson(id)
          if (success) {
            wx.showToast({ title: '删除成功', icon: 'success' })
            this.loadPersons()
          } else {
            wx.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  },

  // 表单输入
  onNameInput(e) {
    this.setData({ 'formData.name': e.detail.value })
  },

  onBirthDayChange(e) {
    this.setData({ 'formData.birthDay': e.detail.value })
  },

  onBirthTimeChange(e) {
    this.setData({ 'formData.birthTime': e.detail.value })
  },

  onIsSelfChange(e) {
    this.setData({ 'formData.isSelf': e.detail.value })
  },

  // 关闭弹窗
  onCloseModal() {
    this.setData({ showModal: false })
  },

  // 保存人员
  onSavePerson() {
    const { formData } = this.data
    
    // 验证
    if (!formData.name || !formData.birthDay || !formData.birthTime) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    
    // 保存
    const success = storageUtil.savePerson(formData)
    if (success) {
      wx.showToast({ 
        title: formData.id ? '修改成功' : '添加成功', 
        icon: 'success' 
      })
      this.setData({ showModal: false })
      this.loadPersons()
    } else {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  }
})
