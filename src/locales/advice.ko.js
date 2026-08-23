/**
 * 판정 문구 (한국어)
 *
 * 규칙 파일에는 조건만 남기고 글자는 여기로 옮겼다.
 * 어떤 조건에서 나오는 말인지는 키 이름으로 알 수 있게 지었다.
 *
 * {temp} {minTemp} 자리에는 단위 기호까지 붙은 값이 들어온다.
 * 화씨로 보고 있는데 근거 문장만 섭씨로 나오면 앞뒤가 안 맞아서다.
 */
export default {
  // ── 자동차 정비소 ──────────────────────────────
  'advice.repair.paintStop.title': '도장 작업은 미루세요',
  'advice.repair.paintStop.desc': '습도 {humidity}% — 도막에 수분이 물려 백화가 생깁니다',
  'advice.repair.paintSlow.title': '도장 건조 시간을 넉넉히 잡으세요',
  'advice.repair.paintSlow.desc': '습도 {humidity}% — 평소보다 경화가 느립니다',
  'advice.repair.paintGood.title': '도장 작업하기 좋은 날입니다',
  'advice.repair.paintGood.desc': '습도 {humidity}% — 건조 조건이 안정적입니다',
  'advice.repair.aircon.title': '에어컨 가스 충전 문의가 몰립니다',
  'advice.repair.aircon.desc': '낮 기온 {temp} — 냉매 재고를 확인해 두세요',
  'advice.repair.battery.title': '배터리 방전 출동이 늘어납니다',
  'advice.repair.battery.desc': '최저 {minTemp} — 배터리와 부동액 재고를 확인하세요',
  'advice.repair.crash.title': '사고 입고가 늘어납니다',
  'advice.repair.crash.desc': '{cond} 예보 — 판금·도색 일정에 여유를 두세요',

  // ── 농사 ────────────────────────────────────
  'advice.farm.sprayStop.title': '오늘 방제는 하지 마세요',
  'advice.farm.sprayStop.desc':
    '습도 {humidity}% · 강수확률 {rainProb}% — 약제가 씻겨 내려갑니다',
  'advice.farm.mold.title': '곰팡이병이 번지기 쉬운 날입니다',
  'advice.farm.mold.desc': '습도 {humidity}% — 잎에 물기가 오래 남습니다',
  'advice.farm.frost.title': '서리가 내릴 수 있습니다',
  'advice.farm.frost.desc': '최저 {minTemp} — 오늘 밤 피복하거나 수확을 앞당기세요',
  'advice.farm.heat.title': '한낮 밭일은 피하세요',
  'advice.farm.heat.desc': '낮 기온 {temp} — 12~16시는 온열질환 위험 구간입니다',
  'advice.farm.water.title': '물 주는 날입니다',
  'advice.farm.water.desc':
    '강수확률 {rainProb}% · 습도 {humidity}% — 당분간 비 소식이 없습니다',

  // ── 자전거 ───────────────────────────────────
  'advice.bike.rainStop.title': '오늘은 자전거를 두고 가세요',
  'advice.bike.rainStop.desc':
    '강수확률 {rainProb}% — 노면이 젖으면 제동 거리가 크게 늘어납니다',
  'advice.bike.rainWarn.title': '비를 만날 수 있습니다',
  'advice.bike.rainWarn.desc': '강수확률 {rainProb}% — 우비를 챙기고 무리한 코스는 피하세요',
  'advice.bike.windStop.title': '바람이 너무 강합니다',
  'advice.bike.windStop.desc': '풍속 {wind}m/s — 옆에서 부는 바람에 중심을 잃기 쉽습니다',
  'advice.bike.windWarn.title': '맞바람이 셉니다',
  'advice.bike.windWarn.desc': '풍속 {wind}m/s — 평소보다 힘이 더 듭니다',
  'advice.bike.heat.title': '한낮은 피하세요',
  'advice.bike.heat.desc': '기온 {temp} — 물을 자주 마시고 이른 아침이나 해 진 뒤에 타세요',
  'advice.bike.gloves.title': '장갑을 챙기세요',
  'advice.bike.gloves.desc': '최저 {minTemp} — 손이 먼저 시립니다',
  'advice.bike.good.title': '타기 좋은 날입니다',
  'advice.bike.good.desc': '{temp} · 바람 약함 — 오래 달려도 무리가 없습니다',

  // ── 야구 ────────────────────────────────────
  'advice.baseball.precipStop.title': '경기가 취소될 수 있습니다',
  'advice.baseball.precipStop.desc': '{cond} — 출발 전에 구단 공지를 확인하세요',
  'advice.baseball.rainHigh.title': '우천 취소 가능성이 높습니다',
  'advice.baseball.rainHigh.desc': '강수확률 {rainProb}% — 표를 미리 취소할지 정해 두세요',
  'advice.baseball.rainMid.title': '중간에 비가 올 수 있습니다',
  'advice.baseball.rainMid.desc': '강수확률 {rainProb}% — 우비를 챙기세요 (구장 우산 반입 제한)',
  'advice.baseball.hot.title': '관중석이 덥습니다',
  'advice.baseball.hot.desc': '기온 {temp} — 모자와 물을 챙기고 그늘 좌석을 고르세요',
  'advice.baseball.night.title': '해가 지면 쌀쌀합니다',
  'advice.baseball.night.desc': '최저 {minTemp} — 야간 경기라면 겉옷을 챙기세요',
  'advice.baseball.wind.title': '바람이 강합니다',
  'advice.baseball.wind.desc': '풍속 {wind}m/s — 뜬공 판단이 어려운 날입니다',
  'advice.baseball.good.title': '경기 보기 좋은 날입니다',
  'advice.baseball.good.desc': '{temp} · 강수확률 {rainProb}% — 야외 관람에 무리가 없습니다',

  // ── 현장 작업 ─────────────────────────────────
  'advice.site.heatStop.title': '옥외 작업을 조정하세요',
  'advice.site.heatStop.desc': '기온 {temp} — 폭염 구간입니다. 시간당 휴식을 넣으세요',
  'advice.site.heatWarn.title': '무더위에 주의하세요',
  'advice.site.heatWarn.desc': '기온 {temp} — 그늘과 식수를 미리 준비하세요',
  'advice.site.windStop.title': '고소 작업을 중지하세요',
  'advice.site.windStop.desc': '풍속 {wind}m/s — 크레인과 비계 작업이 위험한 구간입니다',
  'advice.site.windWarn.title': '자재가 날릴 수 있습니다',
  'advice.site.windWarn.desc': '풍속 {wind}m/s — 적재물과 가설물을 다시 고정하세요',
  'advice.site.precipStop.title': '우천 작업은 제한하세요',
  'advice.site.precipStop.desc': '감전과 추락 위험이 커집니다',
  'advice.site.rainWarn.title': '오후에 비가 올 수 있습니다',
  'advice.site.rainWarn.desc': '강수확률 {rainProb}% — 발판 미끄럼과 자재 덮개를 점검하세요',
  'advice.site.freeze.title': '노면이 얼 수 있습니다',
  'advice.site.freeze.desc': '최저 {minTemp} — 이른 시간 이동과 콘크리트 양생에 주의하세요',

  // ── 등산 ────────────────────────────────────
  'advice.hike.rainStop.title': '오늘 산행은 미루세요',
  'advice.hike.rainStop.desc':
    '강수확률 {rainProb}% — 젖은 바위와 낙엽에서 미끄러지기 쉽습니다',
  'advice.hike.rainWarn.title': '비를 만날 수 있습니다',
  'advice.hike.rainWarn.desc': '강수확률 {rainProb}% — 방수 겉옷을 챙기고 짧은 코스로 잡으세요',
  'advice.hike.ridgeWind.title': '능선 바람이 위험합니다',
  'advice.hike.ridgeWind.desc': '풍속 {wind}m/s — 산 위는 이보다 더 셉니다',
  'advice.hike.summitCold.title': '정상은 영하일 수 있습니다',
  'advice.hike.summitCold.desc': '최저 {minTemp} — 고도가 100m 오를 때마다 기온이 더 떨어집니다',
  'advice.hike.heat.title': '이른 아침에 오르세요',
  'advice.hike.heat.desc': '기온 {temp} — 한낮에는 물을 평소보다 넉넉히 챙기세요',
  'advice.hike.good.title': '산에 오르기 좋은 날입니다',
  'advice.hike.good.desc': '{temp} · 강수확률 {rainProb}% — 걷기 편한 조건입니다',

  // ── 빨래·환기 ────────────────────────────────
  'advice.laundry.rainStop.title': '밖에 널지 마세요',
  'advice.laundry.rainStop.desc': '강수확률 {rainProb}% — 걷으러 나가야 할 수 있습니다',
  'advice.laundry.humidStop.title': '오늘은 잘 마르지 않습니다',
  'advice.laundry.humidStop.desc': '습도 {humidity}% — 널어도 눅눅해지고 냄새가 납니다',
  'advice.laundry.humidWarn.title': '마르는 데 오래 걸립니다',
  'advice.laundry.humidWarn.desc': '습도 {humidity}% — 두꺼운 옷은 다음으로 미루세요',
  'advice.laundry.windy.title': '집게를 단단히 물리세요',
  'advice.laundry.windy.desc': '바람 {wind}m/s — 가벼운 옷은 날아갑니다',
  'advice.laundry.coldAir.title': '짧게 자주 환기하세요',
  'advice.laundry.coldAir.desc': '기온 {temp} — 5분씩 몇 번이면 충분합니다',
  'advice.laundry.airGood.title': '환기하기 좋습니다',
  'advice.laundry.airGood.desc':
    '습도 {humidity}% · 강수확률 {rainProb}% — 창문을 열어 두세요',
  'advice.laundry.bedding.title': '이불까지 널 만합니다',
  'advice.laundry.bedding.desc': '습도 {humidity}% · 바람 {wind}m/s — 오늘 안에 다 마릅니다',
  'advice.laundry.freeze.title': '밤새 얼 수 있습니다',
  'advice.laundry.freeze.desc': '최저 {minTemp} — 해 지기 전에 걷으세요',

  // ── 걸리는 규칙이 없을 때 ──────────────────────
  'advice.common.nothing.title': '특별히 신경 쓸 것이 없습니다',
  'advice.common.nothing.desc': '평소대로 하셔도 괜찮은 날씨입니다',
}
