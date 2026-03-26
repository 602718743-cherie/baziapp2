/**
 * 数据库技能模块
 * 支持多种存储方式：JSON文件（默认）、MongoDB、MySQL
 */

const fs = require('fs').promises
const path = require('path')

// 数据文件路径
const DATA_FILE = path.join(__dirname, '../data/persons.json')

const dbSkill = {
  /**
   * 初始化数据文件
   */
  async init() {
    try {
      await fs.access(DATA_FILE)
    } catch {
      // 文件不存在，创建目录和文件
      const dir = path.dirname(DATA_FILE)
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(DATA_FILE, JSON.stringify([]))
    }
  },

  /**
   * 读取所有人员数据
   * @returns {Array} 人员列表
   */
  async list() {
    await this.init()
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    const persons = JSON.parse(data)
    // 本人优先，按ID倒序
    return persons.sort((a, b) => {
      if (a.isSelf && !b.isSelf) return -1
      if (!a.isSelf && b.isSelf) return 1
      return b.id - a.id
    })
  },

  /**
   * 获取本人信息
   * @returns {Object|null} 本人信息
   */
  async getSelf() {
    const list = await this.list()
    return list.find(p => p.isSelf) || null
  },

  /**
   * 根据ID获取人员信息
   * @param {number} id - 人员ID
   * @returns {Object|null} 人员信息
   */
  async getById(id) {
    const list = await this.list()
    return list.find(p => p.id === id) || null
  },

  /**
   * 保存人员信息（新增/更新）
   * @param {Object} person - 人员信息
   * @returns {Object} 保存后的人员信息
   */
  async save({ id, name, birthDay, birthTime, isSelf }) {
    await this.init()
    const list = await this.list()
    
    // 如果标记为本人，取消其他人的本人标记
    if (isSelf) {
      list.forEach(p => p.isSelf = false)
    }
    
    if (id) {
      // 更新
      const index = list.findIndex(p => p.id === id)
      if (index !== -1) {
        list[index] = { id, name, birthDay, birthTime, isSelf }
      }
    } else {
      // 新增
      const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1
      list.push({ id: newId, name, birthDay, birthTime, isSelf })
    }
    
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2))
    return id ? { id, name, birthDay, birthTime, isSelf } : list[list.length - 1]
  },

  /**
   * 删除人员信息
   * @param {number} id - 人员ID
   * @returns {boolean} 是否删除成功
   */
  async delete(id) {
    await this.init()
    const list = await this.list()
    const filtered = list.filter(p => p.id !== id)
    
    if (filtered.length === list.length) {
      return false // 未找到
    }
    
    await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2))
    return true
  },

  /**
   * 清空所有数据
   */
  async clear() {
    await fs.writeFile(DATA_FILE, JSON.stringify([]))
  }
}

module.exports = dbSkill