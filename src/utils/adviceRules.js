import { translate } from '@/locales'
import { groupOf, isPrecipitating } from './weatherCondition'

/**
 * 오늘의 채비 판정 규칙
 *
 * 같은 날씨라도 챙기는 사람에 따라 해야 할 준비가 다르다.
 * 화면 여러 곳에서 같은 규칙을 쓰기 때문에 한곳에 모아 두었다.
 *
 * level 의미
 *  - stop : 오늘은 하지 마세요
 *  - warn : 주의가 필요합니다
 *  - info : 참고하세요
 *  - good : 조건이 좋습니다
 *
 * 이 파일에는 조건만 두고 문구는 locales/advice.*.js 로 옮겼다.
 * 처음에는 규칙과 문장이 같이 있었는데 화면을 한국어·영어로 나누면서
 * 규칙 하나에 언어 수만큼 문장이 붙어 조건이 안 보이게 됐다.
 */

const LEVEL_ORDER = { stop: 0, warn: 1, info: 2, good: 3 }

/**
 * @param item  도시 한 곳의 날씨 (temp, minTemp, humidity, wind, rainProb, condition)
 * @param mode  하는 일 id
 * @param opts  { lang, unit } — 문구를 만들 때만 쓴다. 판정 자체는 언제나 섭씨 기준.
 */
export const buildAdvice = (item, mode, opts = {}) => {
  const { lang = 'ko', unit = 'celsius' } = opts
  const list = []

  // 기준값은 섭씨로 두고 보여줄 때만 바꾼다.
  // 화씨로 보고 있는데 근거 문장만 섭씨로 나오면 앞뒤가 안 맞는다.
  const deg = (celsius) =>
    unit === 'fahrenheit' ? `${Math.round((celsius * 9) / 5 + 32)}℉` : `${celsius}℃`

  const say = (level, key, values = {}) => {
    list.push({
      level,
      key,
      title: translate(lang, `advice.${key}.title`, values),
      desc: translate(lang, `advice.${key}.desc`, values),
    })
  }

  // 문구에서 자주 쓰는 값들을 미리 만들어 둔다
  const v = {
    humidity: item.humidity,
    rainProb: item.rainProb,
    wind: item.wind,
    temp: deg(item.temp),
    minTemp: deg(item.minTemp),
    cond: translate(lang, `cond.${groupOf(item.condition)}`),
  }
  const wet = isPrecipitating(item.condition)

  // ── 자동차 정비소 ──────────────────────────────
  // 도장 작업은 온도와 습도에 예민하다. 계절에 따라 몰리는 정비 항목도 다르다.
  if (mode === 'repair') {
    if (item.humidity >= 80) say('stop', 'repair.paintStop', v)
    else if (item.humidity >= 60) say('warn', 'repair.paintSlow', v)
    else say('good', 'repair.paintGood', v)

    if (item.temp >= 30) say('info', 'repair.aircon', v)
    if (item.minTemp <= 3) say('info', 'repair.battery', v)
    if (wet) say('info', 'repair.crash', v)
  }

  // ── 농사 ────────────────────────────────────
  if (mode === 'farm') {
    if (item.humidity >= 80 && item.rainProb >= 30) say('stop', 'farm.sprayStop', v)
    else if (item.humidity >= 80) say('warn', 'farm.mold', v)

    if (item.minTemp <= 3) say('stop', 'farm.frost', v)
    if (item.temp >= 31) say('warn', 'farm.heat', v)
    if (item.rainProb <= 20 && item.humidity < 60) say('info', 'farm.water', v)
  }

  // ── 자전거 ───────────────────────────────────
  // 자전거는 노면과 바람이 안전에 직결된다. 측풍은 넘어질 수 있어 기온보다 위험하다.
  if (mode === 'bike') {
    if (wet || item.rainProb >= 60) say('stop', 'bike.rainStop', v)
    else if (item.rainProb >= 30) say('warn', 'bike.rainWarn', v)

    if (item.wind !== undefined && item.wind >= 7) say('stop', 'bike.windStop', v)
    else if (item.wind !== undefined && item.wind >= 4) say('warn', 'bike.windWarn', v)

    if (item.temp >= 31) say('warn', 'bike.heat', v)
    if (item.minTemp <= 3) say('info', 'bike.gloves', v)

    if (
      item.temp >= 12 &&
      item.temp <= 26 &&
      item.rainProb < 30 &&
      (item.wind === undefined || item.wind < 4)
    ) {
      say('good', 'bike.good', v)
    }
  }

  // ── 야구 ────────────────────────────────────
  // 야구는 비에 가장 약하다. 그라운드가 젖으면 경기가 열리지 않는다.
  if (mode === 'baseball') {
    if (wet) say('stop', 'baseball.precipStop', v)
    else if (item.rainProb >= 60) say('stop', 'baseball.rainHigh', v)
    else if (item.rainProb >= 30) say('warn', 'baseball.rainMid', v)

    if (item.temp >= 31) say('warn', 'baseball.hot', v)
    if (item.minTemp <= 8) say('info', 'baseball.night', v)
    if (item.wind !== undefined && item.wind >= 7) say('info', 'baseball.wind', v)
    if (item.rainProb < 30 && item.temp >= 15 && item.temp <= 28) say('good', 'baseball.good', v)
  }

  // ── 현장 작업 ─────────────────────────────────
  // 산업안전보건법의 폭염·강풍 작업 조정 기준을 참고했다.
  if (mode === 'site') {
    if (item.temp >= 33) say('stop', 'site.heatStop', v)
    else if (item.temp >= 31) say('warn', 'site.heatWarn', v)

    if (item.wind !== undefined && item.wind >= 10) say('stop', 'site.windStop', v)
    else if (item.wind !== undefined && item.wind >= 7) say('warn', 'site.windWarn', v)

    if (wet) say('stop', 'site.precipStop', v)
    else if (item.rainProb >= 60) say('warn', 'site.rainWarn', v)

    if (item.minTemp <= 0) say('warn', 'site.freeze', v)
  }

  // ── 등산 ────────────────────────────────────
  // 산은 아래보다 기온이 낮고 바람이 세다. 해가 지면 체온이 빠르게 떨어진다.
  if (mode === 'hike') {
    if (wet || item.rainProb >= 60) say('stop', 'hike.rainStop', v)
    else if (item.rainProb >= 30) say('warn', 'hike.rainWarn', v)

    if (item.wind !== undefined && item.wind >= 9) say('stop', 'hike.ridgeWind', v)
    if (item.minTemp <= 0) say('warn', 'hike.summitCold', v)
    if (item.temp >= 30) say('warn', 'hike.heat', v)
    if (item.temp >= 8 && item.temp <= 22 && item.rainProb < 30) say('good', 'hike.good', v)
  }

  // ── 빨래·환기 ────────────────────────────────
  // 습도가 높으면 아무리 널어도 마르지 않고, 바람이 있으면 빨리 마른다.
  if (mode === 'laundry') {
    if (wet || item.rainProb >= 50) say('stop', 'laundry.rainStop', v)
    else if (item.humidity >= 80) say('stop', 'laundry.humidStop', v)
    else if (item.humidity >= 65) say('warn', 'laundry.humidWarn', v)

    // 바람이 너무 세면 빨래가 날아간다
    if (item.wind !== undefined && item.wind >= 8) say('warn', 'laundry.windy', v)

    if (item.temp <= 5) {
      // 추운 날에도 환기는 해야 하지만 오래 열어두면 난방이 다 날아간다
      say('info', 'laundry.coldAir', v)
    } else if (item.humidity < 60 && item.rainProb < 30) {
      say('good', 'laundry.airGood', v)
    }

    if (
      item.humidity < 55 &&
      item.rainProb < 30 &&
      item.temp >= 10 &&
      item.wind !== undefined &&
      item.wind >= 3 &&
      item.wind < 8
    ) {
      say('good', 'laundry.bedding', v)
    }

    if (item.minTemp <= 0) say('info', 'laundry.freeze', v)
  }

  if (list.length === 0) say('good', 'common.nothing', v)
  return list
}

/** 가장 무거운 판정이 앞에 오도록 정렬한다. 여러 화면이 같은 순서를 쓴다 */
export const byWeight = (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]
