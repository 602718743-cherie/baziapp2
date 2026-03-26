/**
 * 八字计算技能模块
 * 基于出生年月日时生成完整八字信息
 */

// 天干
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

// 地支
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 地支对应时辰
const HOUR_DIZHI = {
  23: '子', 0: '子', 1: '丑', 2: '丑', 3: '寅', 4: '寅',
  5: '卯', 6: '卯', 7: '辰', 8: '辰', 9: '巳', 10: '巳',
  11: '午', 12: '午', 13: '未', 14: '未', 15: '申', 16: '申',
  17: '酉', 18: '酉', 19: '戌', 20: '戌', 21: '亥', 22: '亥'
}

// 天干阴阳五行映射（专业日主五行）
const TIANGAN_WUXING = {
  '甲': { wuxing: '木', yinyang: '阳', full: '阳木', displayName: '甲木' },
  '乙': { wuxing: '木', yinyang: '阴', full: '阴木', displayName: '乙木' },
  '丙': { wuxing: '火', yinyang: '阳', full: '阳火', displayName: '丙火' },
  '丁': { wuxing: '火', yinyang: '阴', full: '阴火', displayName: '丁火' },
  '戊': { wuxing: '土', yinyang: '阳', full: '阳土', displayName: '戊土' },
  '己': { wuxing: '土', yinyang: '阴', full: '阴土', displayName: '己土' },
  '庚': { wuxing: '金', yinyang: '阳', full: '阳金', displayName: '庚金' },
  '辛': { wuxing: '金', yinyang: '阴', full: '阴金', displayName: '辛金' },
  '壬': { wuxing: '水', yinyang: '阳', full: '阳水', displayName: '壬水' },
  '癸': { wuxing: '水', yinyang: '阴', full: '阴水', displayName: '癸水' }
}

// 地支五行映射
const DIZHI_WUXING = {
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '辰': '土', '戌': '土', '丑': '土', '未': '土',
  '申': '金', '酉': '金',
  '子': '水', '亥': '水'
}

// 颜色映射
const COLOR_MAP = {
  '木': '绿色系',
  '火': '红色系',
  '土': '黄色/棕色系',
  '金': '白色系',
  '水': '黑色/蓝色系'
}

const baziSkill = {
  /**
   * 计算年柱（天干地支）
   * @param {number} year - 公历年份
   * @returns {string} 年柱（如：甲子）
   */
  getYearGanZhi(year) {
    // 1900年为庚子年
    const baseYear = 1900
    const ganIndex = (year - baseYear) % 10
    const zhiIndex = (year - baseYear) % 12
    return TIANGAN[ganIndex] + DIZHI[zhiIndex]
  },

  /**
   * 计算月柱（基于年份和月份）
   * @param {number} year - 年份
   * @param {number} month - 月份（1-12）
   * @returns {string} 月柱
   */
  getMonthGanZhi(year, month) {
    // 简化算法：年干配月支
    const yearGanIndex = (year - 1900) % 10
    const monthZhiIndex = (month + 1) % 12
    const monthGanIndex = (yearGanIndex * 2 + month - 1) % 10
    return TIANGAN[monthGanIndex] + DIZHI[monthZhiIndex]
  },

  /**
   * 计算日柱（基于日期）
   * @param {Date} date - 日期对象
   * @returns {string} 日柱
   */
  getDayGanZhi(date) {
    // 简化算法：基于时间戳计算
    const baseDate = new Date('1900-01-01')
    const days = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24))
    const ganIndex = days % 10
    const zhiIndex = days % 12
    return TIANGAN[ganIndex] + DIZHI[zhiIndex]
  },

  /**
   * 计算时柱（基于小时）
   * @param {number} hour - 小时（0-23）
   * @param {string} dayGan - 日干
   * @returns {string} 时柱
   */
  getHourGanZhi(hour, dayGan) {
    const hourZhi = HOUR_DIZHI[hour]
    const dayGanIndex = TIANGAN.indexOf(dayGan)
    const hourZhiIndex = DIZHI.indexOf(hourZhi)
    const hourGanIndex = (dayGanIndex * 2 + hourZhiIndex) % 10
    return TIANGAN[hourGanIndex] + hourZhi
  },

  /**
   * 解析完整八字
   * @param {string} birthDay - 出生日期 YYYY-MM-DD
   * @param {string} birthTime - 出生时间 HH:MM
   * @returns {Object} 八字信息
   */
  parseBazi(birthDay, birthTime) {
    const [year, month, day] = birthDay.split('-').map(Number)
    const [hour, minute] = birthTime.split(':').map(Number)
    
    const date = new Date(year, month - 1, day, hour, minute)
    
    // 计算四柱
    const yearGZ = this.getYearGanZhi(year)
    const monthGZ = this.getMonthGanZhi(year, month)
    const dayGZ = this.getDayGanZhi(date)
    const hourGZ = this.getHourGanZhi(hour, dayGZ[0])
    
    // 日元（日干）- 命主的核心五行
    const dayGan = dayGZ[0]
    const dayGanInfo = TIANGAN_WUXING[dayGan]
    
    return {
      year: yearGZ,
      month: monthGZ,
      day: dayGZ,
      hour: hourGZ,
      bazi: `${yearGZ} ${monthGZ} ${dayGZ} ${hourGZ}`,
      dayGan: dayGan,
      mainWuxing: dayGanInfo.wuxing,        // 五行（木火土金水）
      mainWuxingFull: dayGanInfo.full,      // 阴阳五行（如：阳木、阴水）
      mainWuxingDisplay: dayGanInfo.displayName, // 显示名称（如：甲木、癸水）
      yinyang: dayGanInfo.yinyang,          // 阴阳
      mainColor: COLOR_MAP[dayGanInfo.wuxing]
    }
  },

  /**
   * 计算当日五行
   * @param {string} date - 日期 YYYY-MM-DD
   * @returns {Object} 当日五行信息
   */
  getDayWuxing(date) {
    const dateObj = new Date(date)
    const dayGZ = this.getDayGanZhi(dateObj)
    const dayGan = dayGZ[0]
    const dayGanInfo = TIANGAN_WUXING[dayGan]
    
    // 获取星期
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekday = weekdays[dateObj.getDay()]
    
    return {
      ganZhi: dayGZ,
      dayGan: dayGan,
      wuxing: dayGanInfo.wuxing,
      wuxingFull: dayGanInfo.full,
      wuxingDisplay: dayGanInfo.displayName,
      yinyang: dayGanInfo.yinyang,
      weekday: weekday,
      color: COLOR_MAP[dayGanInfo.wuxing]
    }
  },

  /**
   * 五行生克关系
   * @param {string} me - 命主五行
   * @param {string} day - 当日五行
   * @returns {string} 关系类型
   */
  getWuxingRelation(me, day) {
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
   * 计算穿衣建议
   * @param {string} mainWuxing - 命主五行
   * @param {string} dayWuxing - 当日五行
   * @returns {Object} 穿衣建议
   */
  getClothingAdvice(mainWuxing, dayWuxing) {
    const relation = this.getWuxingRelation(mainWuxing, dayWuxing)
    const ke = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' }
    
    let advice = {
      relation: relation,
      suitable: [],
      unsuitable: [],
      normal: []
    }
    
    const allColors = ['绿色系', '红色系', '黄色/棕色系', '白色系', '黑色/蓝色系']
    
    if (['助', '生'].includes(relation)) {
      // 状态顺畅
      advice.suitable = [COLOR_MAP[mainWuxing], COLOR_MAP[dayWuxing]]
      advice.unsuitable = [COLOR_MAP[ke[mainWuxing]]]
      advice.mood = '状态顺畅，心情舒畅'
      advice.activity = '适合出行、约会、办事'
    } else if (['制', '克'].includes(relation)) {
      // 受制约
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
    
    // 计算平级色系
    advice.normal = allColors.filter(c => 
      !advice.suitable.includes(c) && !advice.unsuitable.includes(c)
    )
    
    return advice
  }
}

module.exports = baziSkill
