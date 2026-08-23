<script setup>
import { ref } from 'vue'
import axios from 'axios'

const weatherData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

// ⚠️ API 키는 소스에 직접 적지 않고 환경 변수(.env.local)에서 읽는다.
// .env.local 은 .gitignore 의 *.local 규칙으로 저장소에 올라가지 않는다.
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const handleFetchWeather = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=37.5665&lon=126.9780&appid=${API_KEY}&units=metric&lang=kr`

  try {
    // 비동기 통신 가동: 서버에서 데이터를 다 가져올 때까지 await 로 기다린다.
    const response = await axios.get(URL)
    // fetch 와 달리 .json() 변환 과정 없이 response.data 에 알맹이가 즉시 담긴다.
    console.log('Axios 통신 응답 전체 객체:', response)
    console.log('백엔드가 준 핵심 날씨 데이터(JSON):', response.data)
    weatherData.value = response.data
  } catch (error) {
    // 4xx, 5xx 에러나 네트워크 오프라인 시 자동으로 이 catch 영역으로 들어온다.
    console.error('통신 중 에러가 발생했습니다:', error)
    if (error.response?.status === 401) {
      errorMessage.value = 'API 키가 유효하지 않습니다. 발급 직후에는 활성화까지 시간이 걸립니다.'
    } else {
      errorMessage.value = `데이터를 가져오지 못했습니다. (${error.message})`
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>⚡ Axios 통신 검증</h2>
    <button @click="handleFetchWeather" :disabled="isLoading">
      {{ isLoading ? '데이터 로딩 중...' : '실시간 날씨 데이터 당겨오기' }}
    </button>

    <div v-if="errorMessage" class="error-card">⚠️ {{ errorMessage }}</div>

    <div v-else-if="weatherData" class="result-card">
      <p>
        📍 위치: <strong>{{ weatherData.name }}</strong>
      </p>
      <p>
        🌡️ 현재 기온: <strong>{{ weatherData.main.temp }}°C</strong> (units=metric 으로 섭씨 변환
        완료)
      </p>
      <p>
        ☁️ 날씨 상태: <strong>{{ weatherData.weather[0].description }}</strong>
      </p>
      <p>
        💧 습도: <strong>{{ weatherData.main.humidity }}%</strong>
      </p>
    </div>

    <div v-else>
      <p>아직 가져온 데이터가 없습니다. 버튼을 눌러 통신을 가동하세요.</p>
    </div>
  </div>
</template>

<style scoped>
.result-card {
  margin-top: 12px;
  padding: 15px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  line-height: 1.8;
}
.result-card strong {
  color: #0284c7;
}
.error-card {
  margin-top: 12px;
  padding: 15px;
  background: #fff5f5;
  border: 1px solid #ffc9c9;
  border-radius: 8px;
  color: #c92a2a;
  font-size: 14px;
}
</style>
