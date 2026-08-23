/**
 * 오늘의 채비 판정 규칙
 *
 * 같은 날씨 데이터라도 하는 일에 따라 해야 할 준비가 달라진다.
 * 화면(뷰) 세 곳에서 같은 규칙을 쓰다 보니 로직이 그대로 복사되어 있었다.
 * 규칙을 고칠 때 세 군데를 다 고쳐야 하는 상태라 공용 모듈로 분리했다.
 *
 * level 의미
 *  - stop : 오늘은 하지 마세요
 *  - warn : 주의가 필요합니다
 *  - info : 참고하세요
 *  - good : 조건이 좋습니다
 */
export const buildAdvice = (item, mode) => {
  const list = []

  if (mode === 'repair') {
    if (item.humidity >= 80) {
      list.push({ level: 'stop', title: '도장 작업은 미루세요', desc: `습도 ${item.humidity}% — 도막에 수분이 물려 백화가 생깁니다` })
    } else if (item.humidity >= 60) {
      list.push({ level: 'warn', title: '도장 건조 시간을 넉넉히 잡으세요', desc: `습도 ${item.humidity}% — 평소보다 경화가 느립니다` })
    } else {
      list.push({ level: 'good', title: '도장 작업하기 좋은 날입니다', desc: `습도 ${item.humidity}% — 건조 조건이 안정적입니다` })
    }
    if (item.temp >= 30) {
      list.push({ level: 'info', title: '에어컨 가스 충전 문의가 몰립니다', desc: `낮 기온 ${item.temp}℃ — 냉매 재고를 확인해 두세요` })
    }
    if (item.minTemp <= 3) {
      list.push({ level: 'info', title: '배터리 방전 출동이 늘어납니다', desc: `최저 ${item.minTemp}℃ — 배터리와 부동액 재고를 확인하세요` })
    }
    if (item.status === '비' || item.status === '눈') {
      list.push({ level: 'info', title: '사고 입고가 늘어납니다', desc: `${item.status} 예보 — 판금·도색 일정에 여유를 두세요` })
    }
  }

  if (mode === 'farm') {
    if (item.humidity >= 80 && item.rainProb >= 30) {
      list.push({ level: 'stop', title: '오늘 방제는 하지 마세요', desc: `습도 ${item.humidity}% · 강수확률 ${item.rainProb}% — 약제가 씻겨 내려갑니다` })
    } else if (item.humidity >= 80) {
      list.push({ level: 'warn', title: '곰팡이병이 번지기 쉬운 날입니다', desc: `습도 ${item.humidity}% — 잎에 물기가 오래 남습니다` })
    }
    if (item.minTemp <= 3) {
      list.push({ level: 'stop', title: '서리가 내릴 수 있습니다', desc: `최저 ${item.minTemp}℃ — 오늘 밤 피복하거나 수확을 앞당기세요` })
    }
    if (item.temp >= 31) {
      list.push({ level: 'warn', title: '한낮 밭일은 피하세요', desc: `낮 기온 ${item.temp}℃ — 12~16시는 온열질환 위험 구간입니다` })
    }
    if (item.rainProb <= 20 && item.humidity < 60) {
      list.push({ level: 'info', title: '물 주는 날입니다', desc: `강수확률 ${item.rainProb}% · 습도 ${item.humidity}% — 당분간 비 소식이 없습니다` })
    }
  }

  if (mode === 'site') {
    if (item.temp >= 33) {
      list.push({ level: 'stop', title: '옥외 작업을 조정하세요', desc: `기온 ${item.temp}℃ — 폭염 구간입니다. 시간당 휴식을 넣으세요` })
    } else if (item.temp >= 31) {
      list.push({ level: 'warn', title: '무더위에 주의하세요', desc: `기온 ${item.temp}℃ — 그늘과 식수를 준비하세요` })
    }
    if (item.rainProb >= 60) {
      list.push({ level: 'warn', title: '고소 작업은 미끄럼에 주의하세요', desc: `강수확률 ${item.rainProb}% — 발판과 안전대를 다시 점검하세요` })
    }
    if (item.status === '비') {
      list.push({ level: 'stop', title: '우천 작업은 제한하세요', desc: '감전·추락 위험이 커집니다' })
    }
  }

  if (mode === 'sport') {
    if (item.temp >= 31) {
      list.push({ level: 'warn', title: '한낮 러닝은 피하세요', desc: `기온 ${item.temp}℃ — 이른 아침이나 해 진 뒤가 낫습니다` })
    }
    if (item.humidity >= 80) {
      list.push({ level: 'warn', title: '땀이 잘 안 마릅니다', desc: `습도 ${item.humidity}% — 체감이 높으니 수분을 자주 보충하세요` })
    }
    if (item.rainProb >= 60) {
      list.push({ level: 'info', title: '실내 운동을 권합니다', desc: `강수확률 ${item.rainProb}%` })
    }
    if (item.temp >= 15 && item.temp <= 24 && item.humidity < 70 && item.rainProb < 40) {
      list.push({ level: 'good', title: '뛰기 딱 좋은 날입니다', desc: `${item.temp}℃ · 습도 ${item.humidity}% — 컨디션 좋은 구간입니다` })
    }
  }

  if (list.length === 0) {
    list.push({ level: 'good', title: '특별히 신경 쓸 것이 없습니다', desc: '평소대로 하셔도 괜찮은 날씨입니다' })
  }
  return list
}
