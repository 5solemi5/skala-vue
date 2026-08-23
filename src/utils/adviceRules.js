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
 */

export const buildAdvice = (item, mode) => {
  const list = []

  // ── 자동차 정비소 ──────────────────────────────
  // 도장 작업은 온도와 습도에 예민하다. 계절에 따라 몰리는 정비 항목도 다르다.
  if (mode === 'repair') {
    if (item.humidity >= 80) {
      list.push({
        level: 'stop',
        title: '도장 작업은 미루세요',
        desc: `습도 ${item.humidity}% — 도막에 수분이 물려 백화가 생깁니다`,
      })
    } else if (item.humidity >= 60) {
      list.push({
        level: 'warn',
        title: '도장 건조 시간을 넉넉히 잡으세요',
        desc: `습도 ${item.humidity}% — 평소보다 경화가 느립니다`,
      })
    } else {
      list.push({
        level: 'good',
        title: '도장 작업하기 좋은 날입니다',
        desc: `습도 ${item.humidity}% — 건조 조건이 안정적입니다`,
      })
    }
    if (item.temp >= 30) {
      list.push({
        level: 'info',
        title: '에어컨 가스 충전 문의가 몰립니다',
        desc: `낮 기온 ${item.temp}℃ — 냉매 재고를 확인해 두세요`,
      })
    }
    if (item.minTemp <= 3) {
      list.push({
        level: 'info',
        title: '배터리 방전 출동이 늘어납니다',
        desc: `최저 ${item.minTemp}℃ — 배터리와 부동액 재고를 확인하세요`,
      })
    }
    if (item.status === '비' || item.status === '눈') {
      list.push({
        level: 'info',
        title: '사고 입고가 늘어납니다',
        desc: `${item.status} 예보 — 판금·도색 일정에 여유를 두세요`,
      })
    }
  }

  // ── 농사 ────────────────────────────────────
  if (mode === 'farm') {
    if (item.humidity >= 80 && item.rainProb >= 30) {
      list.push({
        level: 'stop',
        title: '오늘 방제는 하지 마세요',
        desc: `습도 ${item.humidity}% · 강수확률 ${item.rainProb}% — 약제가 씻겨 내려갑니다`,
      })
    } else if (item.humidity >= 80) {
      list.push({
        level: 'warn',
        title: '곰팡이병이 번지기 쉬운 날입니다',
        desc: `습도 ${item.humidity}% — 잎에 물기가 오래 남습니다`,
      })
    }
    if (item.minTemp <= 3) {
      list.push({
        level: 'stop',
        title: '서리가 내릴 수 있습니다',
        desc: `최저 ${item.minTemp}℃ — 오늘 밤 피복하거나 수확을 앞당기세요`,
      })
    }
    if (item.temp >= 31) {
      list.push({
        level: 'warn',
        title: '한낮 밭일은 피하세요',
        desc: `낮 기온 ${item.temp}℃ — 12~16시는 온열질환 위험 구간입니다`,
      })
    }
    if (item.rainProb <= 20 && item.humidity < 60) {
      list.push({
        level: 'info',
        title: '물 주는 날입니다',
        desc: `강수확률 ${item.rainProb}% · 습도 ${item.humidity}% — 당분간 비 소식이 없습니다`,
      })
    }
  }

  // ── 자전거 ───────────────────────────────────
  // 자전거는 노면과 바람이 안전에 직결된다. 측풍은 넘어질 수 있어 기온보다 위험하다.
  if (mode === 'bike') {
    if (item.status === '비' || item.status === '눈' || item.rainProb >= 60) {
      list.push({
        level: 'stop',
        title: '오늘은 자전거를 두고 가세요',
        desc: `강수확률 ${item.rainProb}% — 노면이 젖으면 제동 거리가 크게 늘어납니다`,
      })
    } else if (item.rainProb >= 30) {
      list.push({
        level: 'warn',
        title: '비를 만날 수 있습니다',
        desc: `강수확률 ${item.rainProb}% — 우비를 챙기고 무리한 코스는 피하세요`,
      })
    }
    if (item.wind !== undefined && item.wind >= 7) {
      list.push({
        level: 'stop',
        title: '바람이 너무 강합니다',
        desc: `풍속 ${item.wind}m/s — 옆에서 부는 바람에 중심을 잃기 쉽습니다`,
      })
    } else if (item.wind !== undefined && item.wind >= 4) {
      list.push({
        level: 'warn',
        title: '맞바람이 셉니다',
        desc: `풍속 ${item.wind}m/s — 평소보다 힘이 더 듭니다`,
      })
    }
    if (item.temp >= 31) {
      list.push({
        level: 'warn',
        title: '한낮은 피하세요',
        desc: `기온 ${item.temp}℃ — 물을 자주 마시고 이른 아침이나 해 진 뒤에 타세요`,
      })
    }
    if (item.minTemp <= 3) {
      list.push({
        level: 'info',
        title: '장갑을 챙기세요',
        desc: `최저 ${item.minTemp}℃ — 손이 먼저 시립니다`,
      })
    }
    if (
      item.temp >= 12 &&
      item.temp <= 26 &&
      item.rainProb < 30 &&
      (item.wind === undefined || item.wind < 4)
    ) {
      list.push({
        level: 'good',
        title: '타기 좋은 날입니다',
        desc: `${item.temp}℃ · 바람 약함 — 오래 달려도 무리가 없습니다`,
      })
    }
  }

  // ── 야구 ────────────────────────────────────
  // 야구는 비에 가장 약하다. 그라운드가 젖으면 경기가 열리지 않는다.
  if (mode === 'baseball') {
    if (item.status === '비' || item.status === '눈') {
      list.push({
        level: 'stop',
        title: '경기가 취소될 수 있습니다',
        desc: `${item.status} — 출발 전에 구단 공지를 확인하세요`,
      })
    } else if (item.rainProb >= 60) {
      list.push({
        level: 'stop',
        title: '우천 취소 가능성이 높습니다',
        desc: `강수확률 ${item.rainProb}% — 표를 미리 취소할지 정해 두세요`,
      })
    } else if (item.rainProb >= 30) {
      list.push({
        level: 'warn',
        title: '중간에 비가 올 수 있습니다',
        desc: `강수확률 ${item.rainProb}% — 우비를 챙기세요 (구장 우산 반입 제한)`,
      })
    }
    if (item.temp >= 31) {
      list.push({
        level: 'warn',
        title: '관중석이 덥습니다',
        desc: `기온 ${item.temp}℃ — 모자와 물을 챙기고 그늘 좌석을 고르세요`,
      })
    }
    if (item.minTemp <= 8) {
      list.push({
        level: 'info',
        title: '해가 지면 쌀쌀합니다',
        desc: `최저 ${item.minTemp}℃ — 야간 경기라면 겉옷을 챙기세요`,
      })
    }
    if (item.wind !== undefined && item.wind >= 7) {
      list.push({
        level: 'info',
        title: '바람이 강합니다',
        desc: `풍속 ${item.wind}m/s — 뜬공 판단이 어려운 날입니다`,
      })
    }
    if (item.rainProb < 30 && item.temp >= 15 && item.temp <= 28) {
      list.push({
        level: 'good',
        title: '경기 보기 좋은 날입니다',
        desc: `${item.temp}℃ · 강수확률 ${item.rainProb}% — 야외 관람에 무리가 없습니다`,
      })
    }
  }

  if (list.length === 0) {
    list.push({
      level: 'good',
      title: '특별히 신경 쓸 것이 없습니다',
      desc: '평소대로 하셔도 괜찮은 날씨입니다',
    })
  }
  return list
}
