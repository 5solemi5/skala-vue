<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// ─────────────────────────────────────────────
// [요구사항 1] 반응형 상태 관리
// ─────────────────────────────────────────────
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, rainProb: 10, minTemp: 21 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 88, rainProb: 80, minTemp: 19 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 72, rainProb: 30, minTemp: 22 },
  { id: 'city_04', name: '전주', temp: 33, status: '맑음', humidity: 45, rainProb: 5, minTemp: 24 },
  { id: 'city_05', name: '대구', temp: 21, status: '흐림', humidity: 82, rainProb: 40, minTemp: 2 },
  { id: 'city_06', name: '강릉', temp: 18, status: '맑음', humidity: 58, rainProb: 10, minTemp: 12 },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// [요구사항 5] 내가 추가한 반응형 상태 - 하는 일에 따라 조언을 바꾸는 모드
const modeList = ref([
  { id: 'repair', label: '🔧 정비' },
  { id: 'farm', label: '🌾 농사' },
  { id: 'site', label: '🏗️ 현장' },
  { id: 'sport', label: '🏃 운동' },
])
const currentMode = ref('repair')

// ─────────────────────────────────────────────
// [요구사항 2] computed 를 활용한 검색 필터링
// ─────────────────────────────────────────────
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  // 검색어가 비어 있으면 원본을 그대로 보여준다.
  if (!query) {
    return weatherList.value
  }
  return weatherList.value.filter((item) => item.name.includes(query))
})

// ─────────────────────────────────────────────
// [요구사항 5] 내가 추가한 computed
// ─────────────────────────────────────────────

/**
 * 모드별 채비 판정 규칙.
 * 1일차에는 이 함수를 템플릿에서 직접 호출했는데,
 * Code Challenge 6 에서 배운 대로 그 방식은 화면이 다시 그려질 때마다
 * 도시 수만큼 매번 재실행된다. 그래서 아래 adviceMap computed 안에서만 호출하도록 바꿨다.
 */
const buildAdvice = (item, mode) => {
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

/**
 * [요구사항 5] 도시 전체의 채비를 한 번에 계산해서 { 도시id: 조언배열 } 로 만들어 둔다.
 * weatherList 나 currentMode 가 바뀔 때만 다시 계산되고 그 외에는 캐싱된 값을 재사용한다.
 */
const adviceMap = computed(() => {
  console.log(`✅ [computed] 채비 재계산 — 모드: ${currentMode.value}`)
  const map = {}
  weatherList.value.forEach((item) => {
    map[item.id] = buildAdvice(item, currentMode.value)
  })
  return map
})

// [요구사항 5] 지금 모드에서 '하지 마세요'가 걸린 지역이 몇 곳인지
const alertCityCount = computed(() => {
  return filteredWeatherList.value.filter((item) => adviceMap.value[item.id].some((a) => a.level === 'stop')).length
})

// ─────────────────────────────────────────────
// [요구사항 3] watch / watchEffect
// ─────────────────────────────────────────────

// selectedCityInfo 감시 (watch) — 상태바 문구가 바뀔 때마다 콘솔로그
watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`👁️ [watch] 상태바 문구 변경: "${oldInfo}" ➡️ "${newInfo}"`)
})

// searchQuery 감시 (watchEffect) — 타이핑할 때마다 자동 추적
watchEffect(() => {
  console.log(`🤖 [watchEffect] 현재 검색어 '${searchQuery.value}' 로 목록을 필터링합니다.`)
})

// [요구사항 5] 내가 추가한 watcher — 모드 전환 감시
watch(currentMode, (newMode, oldMode) => {
  const label = modeList.value.find((m) => m.id === newMode)?.label
  console.log(`🧰 [watch] 모드 변경: ${oldMode} ➡️ ${newMode} — 채비 기준을 다시 적용합니다.`)
  selectedCityInfo.value = `${label} 기준으로 오늘의 채비를 다시 계산했습니다.`
})

// ─────────────────────────────────────────────
// 이벤트 핸들러
// ─────────────────────────────────────────────
const changeMode = (modeId) => {
  currentMode.value = modeId
}
const selectCard = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- [요구사항 1] 도시 검색 -->
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        class="search-input"
        placeholder="도시 이름을 한글로 입력하세요 (예: 서울)"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
      />
      <p class="search-result">
        <span v-if="searchQuery">검색 중인 도시: <strong>{{ searchQuery }}</strong></span>
        <span v-else class="dim">검색어를 입력하면 여기에 표시됩니다.</span>
      </p>
    </section>

    <!-- [요구사항 5] 모드 선택 -->
    <section class="mode-box">
      <h3>🧰 오늘 무슨 일을 하시나요?</h3>
      <div class="mode-list">
        <button
          v-for="mode in modeList"
          :key="mode.id"
          class="mode-btn"
          :class="{ on: currentMode === mode.id }"
          @click="changeMode(mode.id)"
        >
          {{ mode.label }}
        </button>
      </div>
      <!-- [요구사항 5] computed 로 계산한 요약 -->
      <p class="summary">
        <span v-if="alertCityCount > 0">⛔ 지금 보이는 지역 중 <strong>{{ alertCityCount }}곳</strong>은 오늘 작업을 미루시는 편이 낫습니다.</span>
        <span v-else class="ok">✅ 지금 보이는 지역은 모두 작업에 무리가 없습니다.</span>
      </p>
    </section>

    <!-- [요구사항 2·4] 필터링된 목록 -->
    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div class="card-grid">
        <div
          v-for="item in filteredWeatherList"
          :key="item.id"
          class="weather-card"
          @click="selectCard(item.name)"
        >
          <div class="card-head">
            <h4>{{ item.name }} ({{ item.status }})</h4>
          </div>

          <p class="temp">{{ item.temp }}<span class="unit">℃</span></p>

          <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
          <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

          <ul class="metric">
            <li><span>습도</span><b>{{ item.humidity }}%</b></li>
            <li><span>강수확률</span><b>{{ item.rainProb }}%</b></li>
            <li><span>최저기온</span><b>{{ item.minTemp }}℃</b></li>
          </ul>

          <div class="advice-box">
            <p class="advice-title">오늘의 채비</p>
            <div v-for="(advice, index) in adviceMap[item.id]" :key="index" class="advice" :class="advice.level">
              <p class="advice-head">
                <span v-if="advice.level === 'stop'">⛔</span>
                <span v-else-if="advice.level === 'warn'">⚠️</span>
                <span v-else-if="advice.level === 'good'">✅</span>
                <span v-else>📌</span>
                {{ advice.title }}
              </p>
              <p class="advice-desc">{{ advice.desc }}</p>
            </div>
          </div>

          <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">상세보기</button>
        </div>
      </div>

      <!-- [요구사항 4] 검색 결과가 없을 때 안내 -->
      <p v-if="filteredWeatherList.length === 0" class="empty">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <!-- 상태바 -->
    <div class="status-bar">📍 {{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.search-box h3,
.mode-box h3,
.list-box h3 {
  margin: 0 0 10px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #34495e;
}
.search-input {
  width: 100%;
  padding: 10px 14px;
  font-size: 15px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  outline: none;
}
.search-input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.15);
}
.search-result {
  margin: 8px 2px 0;
  font-size: 14px;
}
.dim {
  color: #adb5bd;
}
.mode-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.mode-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.mode-btn:hover {
  border-color: #adb5bd;
}
.mode-btn.on {
  color: #ffffff;
  background-color: #35495e;
  border-color: #35495e;
}
.summary {
  margin: 12px 0 0;
  padding: 10px 14px;
  font-size: 13.5px;
  background-color: #fff5f5;
  border-left: 3px solid #e03131;
  border-radius: 6px;
}
.summary .ok {
  color: #2f9e44;
}
.summary:has(.ok) {
  background-color: #f4fce3;
  border-left-color: #2f9e44;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 16px;
}
.weather-card {
  display: flex;
  flex-direction: column;
  padding: 18px;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.weather-card:hover {
  border-color: #42b883;
  box-shadow: 0 6px 16px rgba(44, 62, 80, 0.08);
}
.card-head h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}
.temp {
  margin: 8px 0 10px;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}
.unit {
  font-size: 16px;
  font-weight: 500;
  color: #868e96;
  margin-left: 2px;
}
.badge {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
}
.badge.hot {
  background-color: #ffe8e0;
  color: #d9480f;
}
.badge.cool {
  background-color: #e3f2fd;
  color: #1565c0;
}
.metric {
  margin: 14px 0 0;
  padding: 12px 0 0;
  border-top: 1px dashed #e9ecef;
  list-style: none;
  font-size: 12.5px;
  color: #868e96;
}
.metric li {
  display: flex;
  justify-content: space-between;
  padding: 1px 0;
}
.metric b {
  color: #495057;
}
.advice-box {
  flex: 1;
  margin: 14px 0;
}
.advice-title {
  margin: 0 0 8px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #adb5bd;
}
.advice {
  padding: 9px 11px;
  margin-bottom: 6px;
  border-radius: 8px;
  border-left: 3px solid #ced4da;
  background-color: #f8f9fa;
}
.advice.stop {
  border-left-color: #e03131;
  background-color: #fff5f5;
}
.advice.warn {
  border-left-color: #f08c00;
  background-color: #fff9db;
}
.advice.good {
  border-left-color: #2f9e44;
  background-color: #f4fce3;
}
.advice.info {
  border-left-color: #1971c2;
  background-color: #f1f6fb;
}
.advice-head {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  color: #2c3e50;
}
.advice-desc {
  margin: 3px 0 0;
  font-size: 12.5px;
  color: #6c757d;
  line-height: 1.5;
}
.btn-detail {
  width: 100%;
  padding: 9px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background-color: #42b883;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-detail:hover {
  background-color: #33a06f;
}
.empty {
  padding: 30px 0;
  text-align: center;
  color: #e03131;
  font-size: 14px;
}
.status-bar {
  padding: 12px 14px;
  background-color: #f1f3f5;
  border-left: 4px solid #42b883;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}
</style>
