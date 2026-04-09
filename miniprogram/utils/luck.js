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

  /**
   * 按豆包逻辑计算颜色吉凶
   * 两层：① 命主底色（固定） ② 当日天干+地支旺衰调整
   *
   * 底色基础（以命主五行 me 为参考）：
   *   同我(me)  → 吉
   *   生我       → 吉/平吉
   *   我生       → 次吉/平
   *   我克       → 平/偏忌
   *   克我       → 忌/凶
   *
   * 当日干支调整规则（天干五行 + 地支五行各贡献一份旺度）：
   *   当日水旺 → 水升吉，土降平
   *   当日木旺 → 木升耗，金吉度下降
   *   当日火旺 → 火升凶大忌，木也忌（木生火助凶）
   *   当日土旺 → 土升吉，水降平
   *   当日金旺 → 金升吉，木更忌
   */
  getColorLevels(mainWuxing, ganWuxing, zhiWuxing) {
    const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }
    const ke    = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' }
    const me = mainWuxing
    const ALL = ['木', '火', '土', '金', '水']

    // ── 第一层：底色评分（命主固定，5分制）──
    // 同我=5, 生我=4, 我生=3, 我克=2, 克我=1
    const baseScore = {}
    ALL.forEach(w => {
      if (w === me)              baseScore[w] = 5  // 同我
      else if (sheng[w] === me)  baseScore[w] = 4  // 生我
      else if (sheng[me] === w)  baseScore[w] = 3  // 我生
      else if (ke[me] === w)     baseScore[w] = 2  // 我克
      else if (ke[w] === me)     baseScore[w] = 1  // 克我
    })

    // ── 第二层：当日干支调整（天干+地支各算一份旺度）──
    // 统计当日旺五行（天干+地支，同五行计2分，不同各计1分）
    const dayPower = {}
    ALL.forEach(w => { dayPower[w] = 0 })
    // 天干地支各权重1，互相克制时效果自然抵消（如癸水+丑土互克，净结果接近底色）
    if (ganWuxing) dayPower[ganWuxing] += 1
    if (zhiWuxing) dayPower[zhiWuxing] += 1

    // 根据旺五行调整评分
    const score = { ...baseScore }
    ALL.forEach(dayWx => {
      if (dayPower[dayWx] === 0) return
      const power = dayPower[dayWx]  // 1 或 2（天干地支相同时=2，加倍）

      if (dayWx === '水') {
        score['水'] += power        // 水旺→水升吉
        score['土'] -= power        // 水旺→土受克降平
      } else if (dayWx === '木') {
        score['木'] += power        // 木旺→木更耗（其实耗气更强，但本身分值上升意味着穿它更「符合当日气场」）
        score['金'] -= power        // 木旺→金被耗，吉度下降
      } else if (dayWx === '火') {
        score['火'] -= power * 2    // 火旺→火更凶，大幅降分
        score['木'] -= power        // 木生火→木助凶，也降
        score['水'] += power        // 水克火→水反成护盾，升吉
      } else if (dayWx === '土') {
        score['土'] += power        // 土旺→土升吉（生金）
        score['水'] -= power        // 土旺→水受克降平
      } else if (dayWx === '金') {
        score['金'] += power        // 金旺→金更吉
        score['木'] -= power        // 金旺→木更被克，更忌
      }
    })

    // ── 按最终得分分五级 ──
    // 排序，得分高→吉，低→不宜
    const sorted = ALL.slice().sort((a, b) => score[b] - score[a])

    // 边界划分：≥5=吉, 4=次吉, 3=平, 2=较差, ≤1=不宜（动态边界）
    const ji     = sorted.filter(w => score[w] >= 5)
    const ciji   = sorted.filter(w => score[w] === 4)
    const ping   = sorted.filter(w => score[w] === 3)
    const jiacha = sorted.filter(w => score[w] === 2)
    const buyi   = sorted.filter(w => score[w] <= 1)

    const toColors = arr => arr.map(w => COLOR_MAP[w])
    return {
      ji:     toColors(ji),
      ciji:   toColors(ciji),
      ping:   toColors(ping),
      jiacha: toColors(jiacha),
      buyi:   toColors(buyi)
    }
  },

  getClothingAdvice(mainWuxing, ganWuxing, zhiWuxing) {
    const levels = this.getColorLevels(mainWuxing, ganWuxing, zhiWuxing)
    // relation 仍按天干五行判断（用于出行建议）
    const relation = this.getRelation(mainWuxing, ganWuxing)

    const moodMap = {
      '助': '今日与自身五行同气，状态平稳顺畅，做事得心应手',
      '生': '今日五行生扶命主，贵人运强，事半功倍，宜主动出击',
      '泄': '今日五行泄耗命主，精力较易分散，宜专注一件事',
      '克': '今日五行克制命主，阻力较大，凡事留余地，勿强行',
      '制': '今日五行克制命主，易感压力，适合低调行事，养精蓄锐',
      '平': '今日五行与命主无强烈冲突，状态中正，随遇而安'
    }
    const activityMap = {
      '助': '适合稳步推进日常事务、整理规划',
      '生': '适合出行、见贵人、谈合作、重要约会',
      '泄': '适合创作、教学、帮助他人，避免大额消耗',
      '克': '适合独处思考、学习充电，避免重要决策',
      '制': '适合休息调整、近处活动，避免冲突与争论',
      '平': '适合日常活动，顺势而为'
    }
    const moodShortMap = {
      '助': '状态平稳顺畅',
      '生': '贵人运强，事半功倍',
      '泄': '精力易分散，宜专注',
      '克': '阻力较大，留余地',
      '制': '易感压力，低调为宜',
      '平': '状态中正，随遇而安'
    }
    const activityShortMap = {
      '助': '宜整理规划',
      '生': '宜出行见贵人',
      '泄': '宜合作，忌大额消耗',
      '克': '宜充电，忌重要决策',
      '制': '宜休息，忌争论',
      '平': '宜日常活动'
    }

    return {
      relation,
      ji:       levels.ji,
      ciji:     levels.ciji,
      ping:     levels.ping,
      jiacha:   levels.jiacha,
      buyi:     levels.buyi,
      suitable:   levels.ji,
      unsuitable: levels.buyi,
      normal:     levels.ping,
      mood:      moodMap[relation]       || '状态平稳，保持常态',
      activity:  activityMap[relation]   || '适合日常活动',
      moodShort: moodShortMap[relation]  || '状态平稳',
      activityShort: activityShortMap[relation] || '宜日常活动'
    }
  },

  calcToday(birthDay, birthTime) {
    const baziInfo = baziUtil.parseBazi(birthDay, birthTime)
    const today = new Date().toISOString().split('T')[0]
    const dayInfo = baziUtil.getDayWuxing(today)
    console.log('[luck] calcToday ganZhi:', dayInfo.ganZhi, 'ganWx:', dayInfo.wuxing, 'zhiWx:', dayInfo.zhiWuxing, 'mainWx:', baziInfo.mainWuxing)
    const advice = this.getClothingAdvice(baziInfo.mainWuxing, dayInfo.wuxing, dayInfo.zhiWuxing)
    console.log('[luck] result ji:', advice.ji, 'ciji:', advice.ciji, 'ping:', advice.ping)
    
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
        zhiWuxing: dayInfo.zhiWuxing,
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
      const advice = this.getClothingAdvice(baziInfo.mainWuxing, dayInfo.wuxing, dayInfo.zhiWuxing)
      
      weekData.push({
        date: dateStr,
        dateDisplay: `${m}/${d}`,
        weekday: dayInfo.weekday,
        ganZhi: dayInfo.ganZhi,
        wuxing: dayInfo.wuxing,
        zhiWuxing: dayInfo.zhiWuxing,
        wuxingFull: dayInfo.wuxingFull,
        wuxingDisplay: dayInfo.wuxingDisplay,
        ji:       advice.ji,
        ciji:     advice.ciji,
        ping:     advice.ping,
        jiacha:   advice.jiacha,
        buyi:     advice.buyi,
        suitable: advice.suitable,
        unsuitable: advice.unsuitable,
        mood:          advice.mood,
        activity:      advice.activity,
        moodShort:     advice.moodShort,
        activityShort: advice.activityShort
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
