import axios from 'axios'

/**
 * 날씨 데이터 수집 계층
 *
 * 두 곳에서 데이터를 받아 하나로 합친다.
 *  - OpenWeatherMap : 현재 기온 / 날씨 상태 / 습도 / 풍속  (교재 요구사항)
 *  - Open-Meteo     : 오늘 최저기온 / 강수확률             (요구사항 3번, 기타 외부 API)
 *
 * OpenWeatherMap 무료 플랜은 '오늘의 강수확률'과 '일 최저기온'을 주지 않는다.
 * 그런데 '오늘의 채비'를 판정하려면 이 두 값이 꼭 필요해서
 * 키 없이 쓸 수 있는 Open-Meteo 를 함께 호출해 보완했다.
 */

const OWM_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const OWM_URL = 'https://api.openweathermap.org/data/2.5/weather'
const METEO_URL = 'https://api.open-meteo.com/v1/forecast'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'

// 처음 접속했을 때 보여줄 기본 지역 (교재 지정 3곳 + 개인 추가 3곳)
export const DEFAULT_CITIES = [
  { id: 'city_01', name: '서울', lat: 37.5665, lon: 126.978, region: '수도권' },
  { id: 'city_02', name: '수원', lat: 37.2636, lon: 127.0286, region: '수도권' },
  { id: 'city_03', name: '부산', lat: 35.1796, lon: 129.0756, region: '영남권' },
  { id: 'city_04', name: '전주', lat: 35.8242, lon: 127.148, region: '호남권' },
  { id: 'city_05', name: '대구', lat: 35.8714, lon: 128.6014, region: '영남권' },
  { id: 'city_06', name: '강릉', lat: 37.7519, lon: 128.8761, region: '강원권' },
]

/** OpenWeatherMap 의 영문 상태를 교재 예제와 같은 한글 표기로 맞춘다 */
const toStatusLabel = (main) => {
  const map = {
    Clear: '맑음',
    Clouds: '구름',
    Rain: '비',
    Drizzle: '비',
    Thunderstorm: '비',
    Snow: '눈',
    Mist: '흐림',
    Fog: '흐림',
    Haze: '흐림',
    Dust: '흐림',
    Smoke: '흐림',
  }
  return map[main] ?? '흐림'
}

/** 한 도시의 현재 날씨 (OpenWeatherMap) */
const fetchCurrent = async (city) => {
  const { data } = await axios.get(OWM_URL, {
    params: { lat: city.lat, lon: city.lon, appid: OWM_KEY, units: 'metric', lang: 'kr' },
  })
  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    wind: Number(data.wind.speed.toFixed(1)),
    status: toStatusLabel(data.weather[0].main),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
  }
}

/** 한 도시의 오늘 최저기온·강수확률 (Open-Meteo, API 키 불필요) */
const fetchDaily = async (city) => {
  const { data } = await axios.get(METEO_URL, {
    params: {
      latitude: city.lat,
      longitude: city.lon,
      daily: 'temperature_2m_min,precipitation_probability_max',
      timezone: 'Asia/Seoul',
      forecast_days: 1,
    },
  })
  return {
    minTemp: Math.round(data.daily.temperature_2m_min[0]),
    rainProb: data.daily.precipitation_probability_max[0] ?? 0,
  }
}

/** 두 API 를 합쳐 화면이 쓰는 형태로 만든다 */
export const fetchCityWeather = async (city) => {
  // 서로 의존하지 않는 요청이라 순차 대기하지 않고 동시에 보낸다
  const [current, daily] = await Promise.all([fetchCurrent(city), fetchDaily(city)])
  return { id: city.id, name: city.name, region: city.region, ...current, ...daily }
}

/**
 * 목록에 있는 도시를 한 번에 불러온다.
 * Promise.all 은 하나만 실패해도 전부 버려서, 도시 한 곳 때문에 화면이 통째로 비어버린다.
 * allSettled 로 바꿔서 성공한 것만 모으고 실패한 도시는 따로 알려준다.
 */
export const fetchAllWeather = async (cities) => {
  const results = await Promise.allSettled(cities.map((city) => fetchCityWeather(city)))
  const ok = []
  const failed = []
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') ok.push(r.value)
    else failed.push({ city: cities[i], reason: r.reason })
  })
  return { list: ok, failed }
}

/**
 * 도시 이름으로 좌표를 찾는다 (OpenWeatherMap Geocoding API).
 * 한글로 검색해도 되고, local_names.ko 로 한글 지명을 돌려준다.
 * '광주' 처럼 같은 이름이 여러 곳이면 여러 개가 나오므로 사용자가 고르게 한다.
 */
export const searchCity = async (query) => {
  const { data } = await axios.get(GEO_URL, {
    params: { q: query, limit: 5, appid: OWM_KEY },
  })
  return data.map((c) => ({
    id: `geo_${c.lat.toFixed(4)}_${c.lon.toFixed(4)}`,
    name: c.local_names?.ko ?? c.name,
    originalName: c.name,
    region: c.state ?? c.country,
    lat: c.lat,
    lon: c.lon,
  }))
}
