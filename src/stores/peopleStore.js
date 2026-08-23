import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'skala-chaebi-people'

/**
 * 챙기는 사람 목록.
 *
 * 처음에는 "하는 일"과 "지역"을 따로 골랐다.
 * 그런데 아버지 정비소는 전주에 있고 할머니 밭은 철원에 있는데
 * 아버지를 고르면 서울 날씨로 정비 판정을 하고 있었다.
 * 사람마다 지역이 다르니 둘을 하나로 묶어야 맞다.
 *
 * 한 사람 = 호칭 + 하는 일 + 지역
 */
const DEFAULT_PEOPLE = [
  {
    id: 'p_father',
    who: '아버지',
    modeId: 'repair',
    city: {
      id: 'geo_35.824_127.148',
      name: '전주',
      region: '전라북도',
      lat: 35.8242,
      lon: 127.148,
    },
  },
  {
    id: 'p_grandma',
    who: '할머니',
    modeId: 'farm',
    city: {
      id: 'geo_38.209_127.218',
      name: '철원',
      region: '강원도 철원군',
      lat: 38.2092,
      lon: 127.2175,
    },
  },
  {
    id: 'p_me',
    who: '나',
    modeId: 'bike',
    city: { id: 'geo_37.567_126.978', name: '서울', region: '수도권', lat: 37.5665, lon: 126.978 },
  },
  {
    id: 'p_game',
    who: '주말 경기',
    modeId: 'baseball',
    city: {
      id: 'geo_37.512_127.072',
      name: '잠실',
      region: '서울 송파구',
      lat: 37.5122,
      lon: 127.0719,
    },
  },
]

export const usePeopleStore = defineStore('people', () => {
  const load = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return structuredClone(DEFAULT_PEOPLE)
      const parsed = JSON.parse(saved)
      // 저장된 값이 깨졌을 때를 대비해 최소한의 모양만 확인한다
      const ok =
        Array.isArray(parsed) &&
        parsed.every((p) => p?.id && p?.who && p?.modeId && p?.city?.lat !== undefined)
      return ok ? parsed : structuredClone(DEFAULT_PEOPLE)
    } catch {
      return structuredClone(DEFAULT_PEOPLE)
    }
  }

  const people = ref(load())

  // 한 번도 손대지 않았으면 예시 목록이라는 뜻이다.
  // 처음 들어온 사람에게 남의 아버지 이야기를 그대로 보여줄 수는 없어서,
  // 예시임을 알리고 바꾸도록 안내하는 데 쓴다.
  const isSample = ref(localStorage.getItem(STORAGE_KEY) === null)
  const markTouched = () => {
    isSample.value = false
  }

  watch(
    people,
    (list) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
      } catch {
        // 저장이 막힌 환경에서는 넘어간다
      }
    },
    { deep: true },
  )

  const count = computed(() => people.value.length)

  const addPerson = (person) => {
    people.value.push({ ...person, id: `p_${Date.now()}` })
    markTouched()
  }

  const updatePerson = (id, patch) => {
    const target = people.value.find((p) => p.id === id)
    if (target) Object.assign(target, patch)
    markTouched()
  }

  const removePerson = (id) => {
    people.value = people.value.filter((p) => p.id !== id)
    markTouched()
  }

  const resetPeople = () => {
    people.value = structuredClone(DEFAULT_PEOPLE)
    isSample.value = true
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // 저장이 막힌 환경에서는 넘어간다
    }
  }

  return { people, count, isSample, addPerson, updatePerson, removePerson, resetPeople }
})
