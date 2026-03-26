/**
 * 本地存储工具（小程序版）
 */

const storageUtil = {
  // 获取所有人员
  getPersons() {
    try {
      const persons = wx.getStorageSync('persons') || []
      return persons.sort((a, b) => {
        if (a.isSelf && !b.isSelf) return -1
        if (!a.isSelf && b.isSelf) return 1
        return b.id - a.id
      })
    } catch (e) {
      console.error('获取人员列表失败', e)
      return []
    }
  },

  // 获取本人
  getSelf() {
    const persons = this.getPersons()
    return persons.find(p => p.isSelf) || null
  },

  // 根据ID获取人员
  getById(id) {
    const persons = this.getPersons()
    return persons.find(p => p.id === id) || null
  },

  // 保存人员（新增/更新）
  savePerson(person) {
    try {
      let persons = this.getPersons()
      
      // 如果标记为本人，取消其他人的本人标记
      if (person.isSelf) {
        persons.forEach(p => p.isSelf = false)
      }
      
      if (person.id) {
        // 更新
        const index = persons.findIndex(p => p.id === person.id)
        if (index !== -1) {
          persons[index] = person
        }
      } else {
        // 新增
        const newId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) + 1 : 1
        person.id = newId
        persons.push(person)
      }
      
      wx.setStorageSync('persons', persons)
      return true
    } catch (e) {
      console.error('保存人员失败', e)
      return false
    }
  },

  // 删除人员
  deletePerson(id) {
    try {
      let persons = this.getPersons()
      persons = persons.filter(p => p.id !== id)
      wx.setStorageSync('persons', persons)
      return true
    } catch (e) {
      console.error('删除人员失败', e)
      return false
    }
  },

  // 清空所有数据
  clear() {
    try {
      wx.removeStorageSync('persons')
      return true
    } catch (e) {
      console.error('清空数据失败', e)
      return false
    }
  }
}

module.exports = storageUtil
