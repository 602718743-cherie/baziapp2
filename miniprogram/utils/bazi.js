/**
 * 八字计算工具（小程序版）
 * 使用专业的日主五行算法
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

// 颜色映射
const COLOR_MAP = {
  '木': '绿色系',
  '火': '红色系',
  '土': '黄色/棕色系',
  '金': '白色系',
  '水': '黑色/蓝色系'
}

const baziUtil = {
  getYearGanZhi(year) {
    const baseYear = 1900
    const ganIndex = (year - baseYear) % 10
    const zhiIndex = (year - baseYear) % 12
    return TIANGAN[ganIndex] + DIZHI[zhiIndex]
  },

  getMonthGanZhi(year, month) {
    const yearGanIndex = (year - 1900) % 10
    const monthZhiIndex = (month + 1) % 12
    const monthGanIndex = (yearGanIndex * 2 + month - 1) % 10
    return TIANGAN[monthGanIndex] + DIZHI[monthZhiIndex]
  },

  getDayGanZhi(date) {
    const baseDate = new Date('1900-01-01')
    const days = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24))
    const ganIndex = days % 10
    const zhiIndex = days % 12
    return TIANGAN[ganIndex] + DIZHI[zhiIndex]
  },

  getHourGanZhi(hour, dayGan) {
    const hourZhi = HOUR_DIZHI[hour]
    const dayGanIndex = TIANGAN.indexOf(dayGan)
    const hourZhiIndex = DIZHI.indexOf(hourZhi)
    const hourGanIndex = (dayGanIndex * 2 + hourZhiIndex) % 10
    return TIANGAN[hourGanIndex] + hourZhi
  },

  parseBazi(birthDay, birthTime) {
    const [year, month, day] = birthDay.split('-').map(Number)
    const [hour, minute] = birthTime.split(':').map(Number)
    
    const date = new Date(year, month - 1, day, hour, minute)
    
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
      mainWuxing: dayGanInfo.wuxing,
      mainWuxingFull: dayGanInfo.full,
      mainWuxingDisplay: dayGanInfo.displayName,
      yinyang: dayGanInfo.yinyang,
      mainColor: COLOR_MAP[dayGanInfo.wuxing]
    }
  },

  getDayWuxing(date) {
    const dateObj = new Date(date)
    const dayGZ = this.getDayGanZhi(dateObj)
    const dayGan = dayGZ[0]
    const dayGanInfo = TIANGAN_WUXING[dayGan]
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
  }
}

module.exports = baziUtil
