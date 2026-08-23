import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_CITIES } from '@/api/weatherApi'

const STORAGE_KEY = 'skala-chaebi-cities'

/**
 * 사용자가 보고 있는 지역 목록.
 *
 * 기본값은 교재에서 준 서울·수원·부산에 내가 고른 세 곳을 더한 여섯 곳이다.
 * 여기에 직접 도시를 추가하거나 뺄 수 있고, 그 결과를 localStorage 에 남긴다.
 * 다음에 다시 들어와도 자기가 만든 목록이 그대로 남아 있어야 쓸 만한 서비스가 된다.
 */
export const useCityStore = defineStore('city', () => {
  const load = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return [...DEFAULT_CITIES]
      const parsed = JSON.parse(saved)
      // 저장된 값이 깨졌을 때를 대비해 최소한의 모양만 확인한다
      if (!Array.isArray(parsed) || parsed.some((c) => !c?.id || c.lat === undefined)) {
        return [...DEFAULT_CITIES]
      }
      return parsed
    } catch {
      return [...DEFAULT_CITIES]
    }
  }

  const cities = ref(load())

  // 목록이 바뀔 때마다 저장한다
  watch(
    cities,
    (list) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
      } catch {
        // 사파리 시크릿 모드처럼 저장이 막힌 경우엔 그냥 넘어간다
      }
    },
    { deep: true },
  )

  // 위쪽 검색에서 결과가 없을 때 그 검색어로 지역 추가를 이어가기 위한 통로
  const pendingQuery = ref('')
  const requestAdd = (query) => {
    pendingQuery.value = query
  }
  const clearPending = () => {
    pendingQuery.value = ''
  }

  const count = computed(() => cities.value.length)
  const has = (id) => cities.value.some((c) => c.id === id)

  const addCity = (city) => {
    if (has(city.id)) return false
    cities.value.push(city)
    return true
  }

  const removeCity = (id) => {
    cities.value = cities.value.filter((c) => c.id !== id)
  }

  const resetCities = () => {
    cities.value = [...DEFAULT_CITIES]
  }

  return {
    cities,
    count,
    has,
    addCity,
    removeCity,
    resetCities,
    pendingQuery,
    requestAdd,
    clearPending,
  }
})
