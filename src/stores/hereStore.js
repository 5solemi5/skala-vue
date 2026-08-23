import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { reverseGeocode, fetchCityWeather } from '@/api/weatherApi'
import { useConfigStore } from './configStore'

/**
 * 지금 있는 곳의 날씨.
 *
 * 헤더에서 보여주고 메인 화면에서도 그 지역을 펼쳐야 해서 스토어로 뺐다.
 *
 * 들어오자마자 위치를 묻지 않는다.
 * 처음 보는 화면에서 권한 팝업부터 뜨면 무슨 사이트인지 알기도 전에 거절하게 된다.
 * 대신 이미 허용해 둔 적이 있으면 묻지 않고 바로 불러온다.
 *
 * status
 *  - idle    : 아직 묻지 않음
 *  - loading : 좌표를 받는 중이거나 날씨를 받는 중
 *  - ready   : 다 받음
 *  - denied  : 사용자가 거절했거나 브라우저가 막음
 *  - failed  : 좌표는 받았는데 그다음이 안 됨
 */
export const useHereStore = defineStore('here', () => {
  const configStore = useConfigStore()

  const status = ref('idle')
  const city = ref(null)
  const weather = ref(null)

  const isBusy = computed(() => status.value === 'loading')
  const hasWeather = computed(() => status.value === 'ready' && !!weather.value)

  /** 브라우저 위치를 Promise 로 감싼다. 콜백 두 개짜리 옛 API 라 그대로 쓰면 흐름이 끊긴다 */
  const getPosition = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('unsupported'))
        return
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 10000,
        // 방금 받아 둔 값이 있으면 다시 묻지 않는다
        maximumAge: 5 * 60 * 1000,
      })
    })

  const load = async () => {
    if (status.value === 'loading') return
    status.value = 'loading'
    try {
      const pos = await getPosition()
      const { latitude, longitude } = pos.coords

      const found = await reverseGeocode(latitude, longitude, configStore.lang)
      // 이름을 못 찾아도 좌표는 있으니 날씨는 보여줄 수 있다
      const target = found ?? {
        id: `geo_${latitude.toFixed(3)}_${longitude.toFixed(3)}`,
        name: '',
        region: '',
        lat: latitude,
        lon: longitude,
      }

      weather.value = await fetchCityWeather(target, configStore.lang)
      city.value = target
      status.value = 'ready'
    } catch (error) {
      // 거절(1) 과 그 밖의 실패를 나눈다. 거절은 다시 조르지 않아야 한다.
      status.value = error?.code === 1 ? 'denied' : 'failed'
      console.error('현재 위치 날씨를 불러오지 못했습니다:', error)
    }
  }

  /**
   * 이미 허용해 둔 브라우저에서만 조용히 불러온다.
   * Permissions API 는 팝업을 띄우지 않고 지금 상태만 알려준다.
   * 사파리처럼 이 API 가 없는 곳도 있어서 없으면 그냥 넘어간다.
   */
  const loadIfAllowed = async () => {
    try {
      const permission = await navigator.permissions?.query({ name: 'geolocation' })
      if (permission?.state === 'granted') load()
    } catch {
      // 확인할 방법이 없으면 사용자가 직접 누를 때까지 기다린다
    }
  }

  // 언어가 바뀌면 지역 이름과 날씨 설명도 그 언어로 다시 받아야 한다
  const reload = () => {
    if (status.value === 'ready') load()
  }

  return { status, city, weather, isBusy, hasWeather, load, loadIfAllowed, reload }
})
