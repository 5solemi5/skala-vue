import { buildAdvice } from './adviceRules'

/**
 * 시간대별로 그 일을 하기에 괜찮은지 점수를 매긴다.
 *
 * 판정 규칙(adviceRules)을 그대로 재사용한다.
 * 'stop' 이 하나라도 걸리면 하지 말아야 할 시간, 'warn' 은 조심할 시간으로 본다.
 * 규칙을 고치면 시간대 판정도 같이 따라오게 하려고 별도 기준을 만들지 않았다.
 */
export const scoreHour = (row, mode) => {
  // 판정 함수는 하루 단위 값(minTemp, condition)도 함께 보므로 시간대 값으로 채워 넣는다
  const advices = buildAdvice(
    { ...row, minTemp: row.temp, condition: row.rainProb >= 60 ? 'Rain' : 'Clear' },
    mode,
  )

  if (advices.some((a) => a.level === 'stop')) return 'stop'
  if (advices.some((a) => a.level === 'warn')) return 'warn'
  return 'good'
}

/**
 * 연속된 'good' 구간 중 가장 긴 것을 찾아 추천 시간대로 쓴다.
 * 자정을 넘어가면 시각(hour)이 23 -> 0 으로 줄어들기 때문에
 * 길이는 시각 차이가 아니라 몇 칸인지(개수)로 센다.
 */
export const findBestWindow = (rows, mode) => {
  let best = null
  let cur = null

  const close = () => {
    if (cur && (!best || cur.length > best.length)) best = cur
    cur = null
  }

  rows.forEach((row) => {
    if (scoreHour(row, mode) === 'good') {
      cur = cur ?? { from: row.hour, to: row.hour, length: 0 }
      cur.to = row.hour
      cur.length += 1
    } else {
      close()
    }
  })
  close()

  return best
}
