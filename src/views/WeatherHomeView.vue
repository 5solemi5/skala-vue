<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import ModeSelector from '../components/exercise/ModeSelector.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { buildAdvice } from '../utils/adviceRules'
import { useConfigStore } from '@/stores/configStore'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()

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

// 모드는 상세 화면과도 공유해야 하므로 스토어에서 가져온다
const modeList = computed(() => configStore.modeList)
const currentMode = computed(() => configStore.currentMode)

// 초기 진입 시 주소창의 쿼리 스트링을 읽어 상태를 복원한다
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  if (route.query.mode) {
    configStore.setMode(route.query.mode)
  }
})

// 검색어와 모드를 주소창에 반영해 두면 링크를 그대로 공유할 수 있다
watch([searchQuery, currentMode], ([newQuery, newMode]) => {
  router.replace({
    path: route.path,
    query: {
      search: newQuery || undefined,
      mode: newMode !== 'repair' ? newMode : undefined,
    },
  })
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

const adviceMap = computed(() => {
  const map = {}
  weatherList.value.forEach((item) => {
    map[item.id] = buildAdvice(item, currentMode.value)
  })
  return map
})

const alertCityCount = computed(() => {
  return filteredWeatherList.value.filter((item) => adviceMap.value[item.id].some((a) => a.level === 'stop')).length
})

watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`👁️ [watch] 상태바 문구 변경: "${oldInfo}" ➡️ "${newInfo}"`)
})

watchEffect(() => {
  console.log(`🤖 [watchEffect] 현재 검색어 '${searchQuery.value}' 로 목록을 필터링합니다.`)
})

watch(currentMode, (newMode, oldMode) => {
  console.log(`🧰 [watch] 모드 변경: ${oldMode} ➡️ ${newMode} — 채비 기준을 다시 적용합니다.`)
  selectedCityInfo.value = `${configStore.currentModeLabel} 기준으로 오늘의 채비를 다시 계산했습니다.`
})

// 상세보기는 alert 대신 라우터 이동으로 처리한다
const handleDetailJump = (cityName) => {
  const target = weatherList.value.find((item) => item.name === cityName)
  if (target) {
    router.push(`/weather/${target.id}`)
  }
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <ModeSelector
        :mode-list="modeList"
        :current-mode="currentMode"
        :alert-count="alertCityCount"
        @change-mode="(id) => configStore.setMode(id)"
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
          @click-detail="handleDetailJump"
        />
      </div>
      <p v-if="filteredWeatherList.length === 0" class="empty">😭 검색 결과와 일치하는 도시가 없습니다.</p>
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
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
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
