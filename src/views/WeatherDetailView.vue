<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buildAdvice } from '../utils/adviceRules'
import AdviceList from '../components/exercise/AdviceList.vue'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

// 도시 코드에 해당하는 상세 Mock Data
const mockDetails = {
  city_01: {
    name: '서울특별시',
    temp: 28,
    status: '맑음',
    humidity: 55,
    rainProb: 10,
    minTemp: 21,
    wind: 2.1,
    region: '수도권',
  },
  city_02: {
    name: '경기도 수원시',
    temp: 24,
    status: '비',
    humidity: 88,
    rainProb: 80,
    minTemp: 19,
    wind: 3.4,
    region: '수도권',
  },
  city_03: {
    name: '부산광역시',
    temp: 26,
    status: '구름',
    humidity: 72,
    rainProb: 30,
    minTemp: 22,
    wind: 5.2,
    region: '영남권',
  },
  city_04: {
    name: '전라북도 전주시',
    temp: 33,
    status: '맑음',
    humidity: 45,
    rainProb: 5,
    minTemp: 24,
    wind: 1.8,
    region: '호남권',
  },
  city_05: {
    name: '대구광역시',
    temp: 21,
    status: '흐림',
    humidity: 82,
    rainProb: 40,
    minTemp: 2,
    wind: 0.9,
    region: '영남권',
  },
  city_06: {
    name: '강원도 강릉시',
    temp: 18,
    status: '맑음',
    humidity: 58,
    rainProb: 10,
    minTemp: 12,
    wind: 4.5,
    region: '강원권',
  },
}

const cityData = ref(null)

// 동적 경로의 cityId 로 Mock Data 에서 도시 객체를 선택한다
const loadCity = (id) => {
  cityData.value = mockDetails[id] ?? null
}

// Mount 시점 처리
onMounted(() => {
  loadCity(route.params.cityId)
  if (route.query.mode) {
    configStore.setMode(route.query.mode)
  }
})

// ⚠️ /weather/city_01 → /weather/city_02 처럼 파라미터만 바뀌면
// Vue Router 는 같은 컴포넌트를 재사용하기 때문에 onMounted 가 다시 실행되지 않는다.
// 그래서 파라미터를 따로 감시해서 데이터를 다시 읽어준다.
watch(
  () => route.params.cityId,
  (newId) => {
    if (newId) loadCity(newId)
  },
)

// 모든 모드의 채비를 한 번에 보여준다 (상세 페이지에서만 제공하는 정보)
const adviceByMode = computed(() => {
  if (!cityData.value) return []
  return configStore.modeList.map((mode) => ({
    ...mode,
    advices: buildAdvice(cityData.value, mode.id),
  }))
})

// 스토어에 설정된 단위에 맞춰 기온을 변환한다
const displayTemp = computed(() =>
  cityData.value ? configStore.convertTemp(cityData.value.temp) : 0,
)
const displayMinTemp = computed(() =>
  cityData.value ? configStore.convertTemp(cityData.value.minTemp) : 0,
)

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="detail-container">
    <div v-if="cityData">
      <p class="crumb">{{ cityData.region }}</p>
      <h2>{{ cityData.name }}</h2>

      <div class="hero">
        <p class="temp">
          {{ displayTemp }}<span class="unit">{{ configStore.unitSymbol }}</span>
        </p>
        <div class="hero-meta">
          <p class="status">{{ cityData.status }}</p>
          <span v-if="cityData.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
          <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>
        </div>
      </div>

      <h3>관측값</h3>
      <ul class="metric">
        <li>
          <span>습도</span><b>{{ cityData.humidity }}%</b>
        </li>
        <li>
          <span>강수확률</span><b>{{ cityData.rainProb }}%</b>
        </li>
        <li>
          <span>최저기온</span><b>{{ displayMinTemp }}{{ configStore.unitSymbol }}</b>
        </li>
        <li>
          <span>풍속</span><b>{{ cityData.wind }}m/s</b>
        </li>
      </ul>

      <h3>하는 일별 오늘의 채비</h3>
      <p class="hint">
        메인 화면에서는 선택한 한 가지만 보이지만, 여기서는 네 가지를 한눈에 비교할 수 있습니다.
      </p>
      <div class="mode-grid">
        <div v-for="mode in adviceByMode" :key="mode.id" class="mode-column">
          <p class="mode-label" :class="{ on: mode.id === configStore.currentMode }">
            {{ mode.label }}
          </p>
          <AdviceList :advice-list="mode.advices" />
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <p>해당 지역의 상세 데이터가 존재하지 않습니다.</p>
      <p class="dim">주소창의 도시 코드를 확인해 주세요. (예: /weather/city_01)</p>
    </div>

    <button class="back-btn" @click="goHome">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.crumb {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: #adb5bd;
}
h2 {
  margin: 4px 0 20px;
  font-size: 1.6rem;
  font-weight: 700;
}
h3 {
  margin: 26px 0 10px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #34495e;
}
.hero {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f1f6fb 0%, #f4fbf8 100%);
  border-radius: 12px;
}
.temp {
  margin: 0;
  font-size: 54px;
  font-weight: 700;
  line-height: 1;
}
.unit {
  font-size: 22px;
  font-weight: 500;
  color: #868e96;
  margin-left: 2px;
}
.status {
  margin: 0 0 8px;
  font-size: 15px;
  color: #495057;
}
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px 20px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
  color: #868e96;
}
.metric li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f5;
}
.metric b {
  color: #212529;
}
.hint {
  margin: 0 0 14px;
  font-size: 13px;
  color: #868e96;
}
.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.mode-column {
  padding: 14px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 10px;
}
.mode-label {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #adb5bd;
}
/* 지금 선택되어 있는 모드를 강조한다 */
.mode-label.on {
  color: #35495e;
}
.not-found {
  padding: 40px 0;
  text-align: center;
}
.dim {
  color: #adb5bd;
  font-size: 13px;
}
.back-btn {
  width: 100%;
  margin-top: 28px;
  padding: 11px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background-color: #35495e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.back-btn:hover {
  background-color: #2c3e50;
}
</style>
