<script setup>
import { ref } from 'vue'

/**
 * [교재 요구사항 1] 배열 렌더링용 날씨 데이터
 *  - 서울 / 수원 / 부산 3개는 교재에서 주어진 원본 데이터를 그대로 사용한다.
 *  - [요구사항 5] 전주 / 대구 / 강릉을 추가하고,
 *    "오늘의 채비"를 판정하려면 기온만으로는 부족해서
 *    습도(humidity) · 강수확률(rainProb) · 최저기온(minTemp) 항목을 함께 넣었다.
 */
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, rainProb: 10, minTemp: 21 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 88, rainProb: 80, minTemp: 19 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 72, rainProb: 30, minTemp: 22 },
  { id: 'city_04', name: '전주', temp: 33, status: '맑음', humidity: 45, rainProb: 5, minTemp: 24 },
  { id: 'city_05', name: '대구', temp: 21, status: '흐림', humidity: 82, rainProb: 40, minTemp: 2 },
  { id: 'city_06', name: '강릉', temp: 18, status: '맑음', humidity: 58, rainProb: 10, minTemp: 12 },
])

/**
 * [요구사항 5] 내가 추가한 기능 - 하는 일에 따라 조언이 달라지는 모드
 * 같은 날씨라도 정비소와 농사는 준비해야 하는 것이 정반대라서 모드를 나눴다.
 */
const modeList = ref([
  { id: 'repair', label: '🔧 정비' },
  { id: 'farm', label: '🌾 농사' },
  { id: 'site', label: '🏗️ 현장' },
  { id: 'sport', label: '🏃 운동' },
])
const currentMode = ref('repair')
const changeMode = (modeId) => {
  currentMode.value = modeId
}

/**
 * [요구사항 5] 모드별 오늘의 채비 판정
 * 아직 computed 를 배우기 전이라 일반 함수로 작성하고 템플릿에서 호출한다.
 * level: stop(하지 마세요) / warn(주의) / info(참고) / good(좋음)
 */
const getAdviceList = (item) => {
  const list = []

  if (currentMode.value === 'repair') {
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

  if (currentMode.value === 'farm') {
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

  if (currentMode.value === 'site') {
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

  if (currentMode.value === 'sport') {
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

// [요구사항 3] 도시 이름 한글 검색 (v-model 대신 :value + @input 으로 직접 처리)
const searchQuery = ref('')
const onSearchInput = (e) => {
  searchQuery.value = e.target.value
}

// [요구사항 4] 카드를 클릭하면 상태바 문구가 바뀐다
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const selectCard = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

// [요구사항 4] 상세보기는 버블링 없이 alert 로만 띄운다
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- [요구사항 3] 도시 검색 -->
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        class="search-input"
        placeholder="도시 이름을 한글로 입력하세요 (예: 서울)"
        :value="searchQuery"
        @input="onSearchInput"
      />
      <p class="search-result">
        <span v-if="searchQuery">검색 중인 도시: <strong>{{ searchQuery }}</strong></span>
        <span v-else class="dim">검색어를 입력하면 여기에 표시됩니다.</span>
      </p>
    </section>

    <!-- [요구사항 5] 하는 일에 따라 조언을 바꾸는 모드 선택 -->
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
    </section>

    <!-- [요구사항 1] 배열 렌더링 (:key 에 id 바인딩) -->
    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>
      <div class="card-grid">
        <div
          v-for="item in weatherList"
          :key="item.id"
          class="weather-card"
          :class="{ 'is-matched': searchQuery && item.name.includes(searchQuery) }"
          @click="selectCard(item.name)"
        >
          <div class="card-head">
            <h4>{{ item.name }} ({{ item.status }})</h4>
          </div>

          <p class="temp">{{ item.temp }}<span class="unit">℃</span></p>

          <!-- [요구사항 2] 조건부 렌더링 (25도 기준) -->
          <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
          <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

          <!-- [요구사항 5] 판정에 사용한 관측값 -->
          <ul class="metric">
            <li><span>습도</span><b>{{ item.humidity }}%</b></li>
            <li><span>강수확률</span><b>{{ item.rainProb }}%</b></li>
            <li><span>최저기온</span><b>{{ item.minTemp }}℃</b></li>
          </ul>

          <!-- [요구사항 5] 모드별 오늘의 채비 -->
          <div class="advice-box">
            <p class="advice-title">오늘의 채비</p>
            <div v-for="(advice, index) in getAdviceList(item)" :key="index" class="advice" :class="advice.level">
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

          <!-- [요구사항 4] 버블링 없이 상세보기 -->
          <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">상세보기</button>
        </div>
      </div>
    </section>

    <!-- [요구사항 4] 상태바 -->
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

/* 검색 */
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

/* 모드 선택 */
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

/* 카드 */
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
.weather-card.is-matched {
  border-color: #42b883;
  background-color: #f4fbf8;
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

/* 관측값 */
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

/* 오늘의 채비 */
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

/* 상세보기 / 상태바 */
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
.status-bar {
  padding: 12px 14px;
  background-color: #f1f3f5;
  border-left: 4px solid #42b883;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}
</style>
