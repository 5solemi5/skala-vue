<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import ModeSelector from '../components/exercise/ModeSelector.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { buildAdvice } from '../utils/adviceRules'
import { fetchAllWeather } from '../api/weatherApi'
import { useCityStore } from '@/stores/cityStore'
import CityManager from '../components/exercise/CityManager.vue'
import { Button } from '@/components/ui/button'
import { useConfigStore } from '@/stores/configStore'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()
const cityStore = useCityStore()

// 실제 API 에서 받아온 날씨 데이터가 담긴다 (Hands on 7 이전에는 목업 배열이었다)
const weatherList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const failedCities = ref([])
const updatedAt = ref('')

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 모드는 상세 화면과도 공유해야 하므로 스토어에서 가져온다
const modeList = computed(() => configStore.modeList)
const currentMode = computed(() => configStore.currentMode)

// 초기 진입 시 주소창의 쿼리 스트링을 읽어 상태를 복원한다
const loadWeather = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { list, failed } = await fetchAllWeather(cityStore.cities)
    weatherList.value = list
    failedCities.value = failed.map((f) => f.city.name)
    updatedAt.value = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    console.log('🌤️ [API] 지역 날씨를 불러왔습니다.', list)
  } catch (error) {
    console.error('날씨 데이터를 불러오지 못했습니다:', error)
    if (error.response?.status === 401) {
      errorMessage.value =
        'OpenWeatherMap API 키가 유효하지 않습니다. .env.local 의 키를 확인해 주세요.'
    } else {
      errorMessage.value = `날씨 데이터를 불러오지 못했습니다. (${error.message})`
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  if (route.query.mode) {
    configStore.setMode(route.query.mode)
  }
  loadWeather()
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
  return filteredWeatherList.value.filter((item) =>
    adviceMap.value[item.id].some((a) => a.level === 'stop'),
  ).length
})

// 지역을 추가하거나 빼면 그 지역만 다시 불러온다
watch(
  () => cityStore.cities.map((c) => c.id).join(','),
  () => loadWeather(),
)

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
      <CityManager />
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
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3>🏙️ 지역별 날씨 현황</h3>
        <div class="flex items-center gap-2">
          <span v-if="updatedAt" class="text-xs text-muted-foreground">{{ updatedAt }} 기준</span>
          <Button variant="outline" size="sm" :disabled="isLoading" @click="loadWeather">
            {{ isLoading ? '불러오는 중...' : '새로고침' }}
          </Button>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        ⚠️ {{ errorMessage }}
      </div>

      <div
        v-else-if="isLoading && weatherList.length === 0"
        class="py-12 text-center text-sm text-muted-foreground"
      >
        실시간 날씨를 불러오는 중입니다...
      </div>

      <p
        v-if="!errorMessage && failedCities.length"
        class="mb-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800"
      >
        {{ failedCities.join(', ') }} 은(는) 불러오지 못했습니다. 나머지 지역만 표시합니다.
      </p>

      <div v-else class="card-grid">
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :city-item="item"
          :advice-list="adviceMap[item.id]"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="handleDetailJump"
        />
      </div>
      <p v-if="cityStore.count === 0" class="empty">
        보고 있는 지역이 없습니다. 위에서 지역을 추가해 주세요.
      </p>

      <div v-else-if="filteredWeatherList.length === 0" class="empty">
        <p class="mb-3">
          😭 내 지역 목록에 '{{ searchQuery.trim() }}' 와(과) 일치하는 곳이 없습니다.
        </p>
        <Button variant="outline" size="sm" @click="cityStore.requestAdd(searchQuery.trim())">
          '{{ searchQuery.trim() }}' 지역 추가하기
        </Button>
      </div>
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
