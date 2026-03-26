/**
 * 运势计算技能模块
 * 基于八字和五行生克理论计算穿衣建议
 */

const baziSkill = require('./baziSkill')

// 颜色映射（五行 → 色系）
const COLOR_MAP = {
  '木': '绿色系',
  '火': '红色系',
  '土': '黄色/棕色系',
  '金': '白色系',
  '水': '黑色/蓝色系'
}

// 所有色系列表
const ALL_COLORS = ['绿色系', '红色系', '黄色/棕色系', '白色系', '黑色/蓝色系']

const luckSkill = {
  /**
   * 五行生克关系判断
   * @param {string} me - 命主五行
   * @param {string} day - 当日五行
   * @returns {string} 关系类型：助、生、泄、制、克
   */
  getRelation(me, day) {
    const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }
    const ke = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' }
    
    if (me === day) return '助'
    if (sheng[day] === me) return '生'
    if (sheng[me] === day) return '泄'
    if (ke[day] === me) return '制'
    if (ke[me] === day) return '克'
    return '平'
  },

  /**
   * 计算穿衣建议（三级分类）
   * @param {string} mainWuxing - 命主五行
   * @param {string} dayWuxing - 当日五行
   * @returns {Object} 建议：{suitable: [], unsuitable: [], normal: [], mood: '', activity: ''}
   */
  getClothingAdvice(mainWuxing, dayWuxing) {
    const relation = this.getRelation(mainWuxing, dayWuxing)
    const ke = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' }
    
    let advice = {
      relation: relation,
      suitable: [],
      unsuitable: [],
      normal: [],
      mood: '',
      activity: ''
    }
    
    if (['助', '生'].includes(relation)) {
      // 状态顺畅 - 使用Set去重
      const suitableSet = new Set([COLOR_MAP[mainWuxing], COLOR_MAP[dayWuxing]])
      advice.suitable = Array.from(suitableSet)
      
      const keWuxing = Object.keys(ke).find(k => ke[k] === mainWuxing)
      advice.unsuitable = keWuxing ? [COLOR_MAP[keWuxing]] : []
      advice.mood = '状态顺畅，心情舒畅'
      advice.activity = '适合出行、约会、办事'
    } else if (['制', '克'].includes(relation)) {
      // 受制约或消耗
      advice.suitable = [COLOR_MAP[mainWuxing]]
      advice.unsuitable = [COLOR_MAP[dayWuxing]]
      advice.mood = '状态一般，谨慎为上'
      advice.activity = '适合近处活动、休息'
    } else {
      // 泄气
      advice.suitable = [COLOR_MAP[mainWuxing]]
      advice.unsuitable = [COLOR_MAP[dayWuxing]]
      advice.mood = '状态平稳，保持常态'
      advice.activity = '适合日常活动'
    }
    
    // 计算平级色系（去重）
    const usedColors = [...new Set([...advice.suitable, ...advice.unsuitable])]
    advice.normal = ALL_COLORS.filter(c => !usedColors.includes(c))
    
    return advice
  },

  /**
   * 计算今日运势
   * @param {string} birthDay - 出生日期 YYYY-MM-DD
   * @param {string} birthTime - 出生时间 HH:MM
   * @returns {Object} 今日运势信息
   */
  calcToday(birthDay, birthTime) {
    // 解析命主八字
    const baziInfo = baziSkill.parseBazi(birthDay, birthTime)
    
    // 获取当日五行
    const today = new Date().toISOString().split('T')[0]
    const dayInfo = baziSkill.getDayWuxing(today)
    
    // 计算穿衣建议
    const advice = this.getClothingAdvice(baziInfo.mainWuxing, dayInfo.wuxing)
    
    return {
      bazi: baziInfo.bazi,
      mainWuxing: baziInfo.mainWuxing,
      mainWuxingFull: baziInfo.mainWuxingFull,
      mainWuxingDisplay: baziInfo.mainWuxingDisplay,
      yinyang: baziInfo.yinyang,
      dayGan: baziInfo.dayGan,
      mainColor: baziInfo.mainColor,
      today: {
        date: today,
        weekday: dayInfo.weekday,
        ganZhi: dayInfo.ganZhi,
        wuxing: dayInfo.wuxing,
        wuxingFull: dayInfo.wuxingFull,
        wuxingDisplay: dayInfo.wuxingDisplay,
        yinyang: dayInfo.yinyang,
        suitable: advice.suitable,
        unsuitable: advice.unsuitable,
        normal: advice.normal,
        mood: advice.mood,
        activity: advice.activity
      }
    }
  },

  /**
   * 计算本周运势
   * @param {string} birthDay - 出生日期 YYYY-MM-DD
   * @param {string} birthTime - 出生时间 HH:MM
   * @returns {Object} 本周运势信息
   */
  calcWeek(birthDay, birthTime) {
    // 解析命主八字
    const baziInfo = baziSkill.parseBazi(birthDay, birthTime)
    
    // 计算未来7天
    const weekData = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayInfo = baziSkill.getDayWuxing(dateStr)
      const advice = this.getClothingAdvice(baziInfo.mainWuxing, dayInfo.wuxing)
      
      weekData.push({
        date: dateStr,
        weekday: dayInfo.weekday,
        ganZhi: dayInfo.ganZhi,
        wuxing: dayInfo.wuxing,
        wuxingFull: dayInfo.wuxingFull,
        wuxingDisplay: dayInfo.wuxingDisplay,
        yinyang: dayInfo.yinyang,
        suitable: advice.suitable,
        unsuitable: advice.unsuitable,
        normal: advice.normal,
        mood: advice.mood,
        activity: advice.activity
      })
    }
    
    return {
      bazi: baziInfo.bazi,
      mainWuxing: baziInfo.mainWuxing,
      mainWuxingFull: baziInfo.mainWuxingFull,
      mainWuxingDisplay: baziInfo.mainWuxingDisplay,
      yinyang: baziInfo.yinyang,
      dayGan: baziInfo.dayGan,
      mainColor: baziInfo.mainColor,
      week: weekData
    }
  }
}

module.exports = luckSkill