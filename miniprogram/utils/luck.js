/**
 * 运势计算工具（小程序版）
 * 使用专业五行算法并去重
 */

const baziUtil = require('./bazi.js')

// 颜色映射
const COLOR_MAP = {
  '木': '绿色系',
  '火': '红色系',
  '土': '黄色/棕色系',
  '金': '白色系',
  '水': '黑色/蓝色系'
}

const ALL_COLORS = ['绿色系', '红色系', '黄色/棕色系', '白色系', '黑色/蓝色系']

const luckUtil = {
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

  getColorLevels(mainWuxing, dayWuxing) {
    const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }
    const ke    = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' }
    const me = mainWuxing, day = dayWuxing
    const ALL = ['木', '火', '土', '金', '水']

    // 吉：生我的 + 同我的
    const jiWx    = ALL.filter(w => w === me || sheng[w] === me)
    // 次吉：我生的
    const cijiWx  = ALL.filter(w => sheng[me] === w)
    // 平：克我的（排除当日本身，当日若克我则归入不宜）
    const pingWx  = ALL.filter(w => ke[w] === me && w !== day)
    // 较差：我克的
    const jiachWx = ALL.filter(w => ke[me] === w)
    // 不宜：克我的当日五行 + 其余未分配
    const buyiWx  = ALL.filter(w => ke[w] === me && w === day)

    // 去重（优先级：吉 > 次吉 > 平 > 较差 > 不宜）
    const used = new Set()
    const pick = (arr) => {
      const res = []
      arr.forEach(w => { if (!used.has(w)) { used.add(w); res.push(w) } })
      return res
    }
    const ji     = pick(jiWx)
    const ciji   = pick(cijiWx)
    const ping   = pick(pingWx)
    const jiacha = pick(jiachWx)
    const buyi   = pick(buyiWx.concat(ALL.filter(w => !used.has(w))))

    const toColors = arr => arr.map(w => COLOR_MAP[w])
    return {
      ji:     toColors(ji),
      ciji:   toColors(ciji),
      ping:   toColors(ping),
      jiacha: toColors(jiacha),
      buyi:   toColors(buyi)
    }
  },

  getClothingAdvice(mainWuxing, dayWuxing) {
    const levels = this.getColorLevels(mainWuxing, dayWuxing)
    const relation = this.getRelation(mainWuxing, dayWuxing)
    const goodRel = ['助', '生'].includes(relation)
    return {
      relation,
      ji:       levels.ji,
      ciji:     levels.ciji,
      ping:     levels.ping,
      jiacha:   levels.jiacha,
      buyi:     levels.buyi,
      // 兼容旧字段
      suitable:   levels.ji,
      unsuitable: levels.buyi,
      normal:     levels.ping,
      mood:     goodRel ? '状态顺畅，心情舒畅' : '状态一般，谨慎为上',
      activity: goodRel ? '适合出行、约会、办事' : '适合近处活动、休息'
    }
  },

  calcToday(birthDay, birthTime) {
    const baziInfo = baziUtil.parseBazi(birthDay, birthTime)
    const today = new Date().toISOString().split('T')[0]
    const dayInfo = baziUtil.getDayWuxing(today)
    const advice = this.getClothingAdvice(baziInfo.mainWuxing, dayInfo.wuxing)
    
    return {
      bazi: baziInfo.bazi,
      mainWuxing: baziInfo.mainWuxing,
      mainWuxingFull: baziInfo.mainWuxingFull,
      mainWuxingDisplay: baziInfo.mainWuxingDisplay,
      mainColor: baziInfo.mainColor,
      today: {
        date: today,
        weekday: dayInfo.weekday,
        ganZhi: dayInfo.ganZhi,
        wuxing: dayInfo.wuxing,
        wuxingFull: dayInfo.wuxingFull,
        wuxingDisplay: dayInfo.wuxingDisplay,
        ji:       advice.ji,
        ciji:     advice.ciji,
        ping:     advice.ping,
        jiacha:   advice.jiacha,
        buyi:     advice.buyi,
        suitable: advice.suitable,
        unsuitable: advice.unsuitable,
        mood:     advice.mood,
        activity: advice.activity
      }
    }
  },

  calcWeek(birthDay, birthTime) {
    const baziInfo = baziUtil.parseBazi(birthDay, birthTime)
    const weekData = []
    
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const dateStr = `${y}-${m}-${d}`
      
      const dayInfo = baziUtil.getDayWuxing(dateStr)
      const advice = this.getClothingAdvice(baziInfo.mainWuxing, dayInfo.wuxing)
      
      weekData.push({
        date: dateStr,
        dateDisplay: `${m}/${d}`,
        weekday: dayInfo.weekday,
        ganZhi: dayInfo.ganZhi,
        wuxing: dayInfo.wuxing,
        wuxingFull: dayInfo.wuxingFull,
        wuxingDisplay: dayInfo.wuxingDisplay,
        ji:       advice.ji,
        ciji:     advice.ciji,
        ping:     advice.ping,
        jiacha:   advice.jiacha,
        buyi:     advice.buyi,
        suitable: advice.suitable,
        unsuitable: advice.unsuitable,
        mood:     advice.mood,
        activity: advice.activity
      })
    }
    
    return {
      bazi: baziInfo.bazi,
      mainWuxing: baziInfo.mainWuxing,
      mainWuxingFull: baziInfo.mainWuxingFull,
      mainWuxingDisplay: baziInfo.mainWuxingDisplay,
      mainColor: baziInfo.mainColor,
      week: weekData
    }
  }
}

module.exports = luckUtil
