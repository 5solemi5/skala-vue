<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
// 컴포넌트 파일명 표기법(PascalCase) 로 불러온다
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import ModeSelector from './ModeSelector.vue'
import WeatherCard from './WeatherCard.vue'

// ─────────────────────────────────────────────
// [요구사항 1] 모든 반응형 데이터는 부모가 소유한다
// ─────────────────────────────────────────────
const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    humidity: 55,
    rainProb: 10,
    minTemp: 21,
  },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 88, rainProb: 80, minTemp: 19 },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    humidity: 72,
    rainProb: 30,
    minTemp: 22,
  },
  { id: 'city_04', name: '전주', temp: 33, status: '맑음', humidity: 45, rainProb: 5, minTemp: 24 },
  { id: 'city_05', name: '대구', temp: 21, status: '흐림', humidity: 82, rainProb: 40, minTemp: 2 },
  {
    id: 'city_06',
    name: '강릉',
    temp: 18,
    status: '맑음',
    humidity: 58,
    rainProb: 10,
    minTemp: 12,
  },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const modeList = ref([
  { id: 'repair', label: '🔧 정비' },
  { id: 'farm', label: '🌾 농사' },
  { id: 'site', label: '🏗️ 현장' },
  { id: 'sport', label: '🏃 운동' },
])
const currentMode = ref('repair')

// 핵심 비즈니스 로직(computed / watch)의 소유권도 부모가 그대로 유지한다
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

const buildAdvice = (item, mode) => {
  const list = []

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

  if (mode === 'site') {
    if (item.temp >= 33) {
      list.push({
        level: 'stop',
        title: '옥외 작업을 조정하세요',
        desc: `기온 ${item.temp}℃ — 폭염 구간입니다. 시간당 휴식을 넣으세요`,
      })
    } else if (item.temp >= 31) {
      list.push({
        level: 'warn',
        title: '무더위에 주의하세요',
        desc: `기온 ${item.temp}℃ — 그늘과 식수를 준비하세요`,
      })
    }
    if (item.rainProb >= 60) {
      list.push({
        level: 'warn',
        title: '고소 작업은 미끄럼에 주의하세요',
        desc: `강수확률 ${item.rainProb}% — 발판과 안전대를 다시 점검하세요`,
      })
    }
    if (item.status === '비') {
      list.push({
        level: 'stop',
        title: '우천 작업은 제한하세요',
        desc: '감전·추락 위험이 커집니다',
      })
    }
  }

  if (mode === 'sport') {
    if (item.temp >= 31) {
      list.push({
        level: 'warn',
        title: '한낮 러닝은 피하세요',
        desc: `기온 ${item.temp}℃ — 이른 아침이나 해 진 뒤가 낫습니다`,
      })
    }
    if (item.humidity >= 80) {
      list.push({
        level: 'warn',
        title: '땀이 잘 안 마릅니다',
        desc: `습도 ${item.humidity}% — 체감이 높으니 수분을 자주 보충하세요`,
      })
    }
    if (item.rainProb >= 60) {
      list.push({
        level: 'info',
        title: '실내 운동을 권합니다',
        desc: `강수확률 ${item.rainProb}%`,
      })
    }
    if (item.temp >= 15 && item.temp <= 24 && item.humidity < 70 && item.rainProb < 40) {
      list.push({
        level: 'good',
        title: '뛰기 딱 좋은 날입니다',
        desc: `${item.temp}℃ · 습도 ${item.humidity}% — 컨디션 좋은 구간입니다`,
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

const adviceMap = computed(() => {
  const map = {}
  weatherList.value.forEach((item) => {
    map[item.id] = buildAdvice(item, currentMode.value)
  })
  return map
})

const alertCityCount = computed(() => {
  return filteredWeatherList.value.filter((item) =>
    adviceMap.value[item.id].some((a) => a.level === 'stop'),
  ).length
})

watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`👁️ [watch] 상태바 문구 변경: "${oldInfo}" ➡️ "${newInfo}"`)
})

watchEffect(() => {
  console.log(`🤖 [watchEffect] 현재 검색어 '${searchQuery.value}' 로 목록을 필터링합니다.`)
})

watch(currentMode, (newMode, oldMode) => {
  const label = modeList.value.find((m) => m.id === newMode)?.label
  console.log(`🧰 [watch] 모드 변경: ${oldMode} ➡️ ${newMode} — 채비 기준을 다시 적용합니다.`)
  selectedCityInfo.value = `${label} 기준으로 오늘의 채비를 다시 계산했습니다.`
})

// 자식이 올려보낸 이벤트를 받아 부모가 상태를 바꾼다
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- [요구사항 2] 공통 껍데기에 검색 컴포넌트를 slot 으로 주입 -->
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <!-- [요구사항 7] 내가 추가로 분리한 모드 선택 컴포넌트 -->
    <BaseDashboardCard>
      <ModeSelector
        :mode-list="modeList"
        :current-mode="currentMode"
        :alert-count="alertCityCount"
        @change-mode="(id) => (currentMode = id)"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div class="card-grid">
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :city-item="item"
          :advice-list="adviceMap[item.id]"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="showDetail"
        />
      </div>

      <p v-if="filteredWeatherList.length === 0" class="empty">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar">📍 {{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
}
h3 {
  margin: 0 0 12px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #34495e;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(270px, 100%), 1fr));
  gap: 16px;
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
