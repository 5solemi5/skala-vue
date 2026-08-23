<script setup>
import { ref, watch } from 'vue'
import { searchCity } from '@/api/weatherApi'
import { useCityStore } from '@/stores/cityStore'
import { Button } from '@/components/ui/button'

const cityStore = useCityStore()

const query = ref('')
const results = ref([])
const isSearching = ref(false)
const message = ref('')
const isOpen = ref(false)

const handleSearch = async () => {
  const q = query.value.trim()
  if (!q) return

  isSearching.value = true
  message.value = ''
  results.value = []

  try {
    const found = await searchCity(q)
    if (found.length === 0) {
      message.value = `'${q}' 로 찾은 지역이 없습니다. 다른 이름으로 검색해 보세요.`
    }
    results.value = found
  } catch (error) {
    console.error('지역 검색 실패:', error)
    message.value = '지역을 검색하지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isSearching.value = false
  }
}

const handleAdd = (city) => {
  const added = cityStore.addCity(city)
  message.value = added
    ? `${city.name} 을(를) 추가했습니다.`
    : `${city.name} 은(는) 이미 목록에 있습니다.`
  if (added) {
    query.value = ''
    results.value = []
  }
}

// 위쪽 검색에서 '지역 추가' 를 누르면 패널을 열고 그 검색어로 바로 찾는다
watch(
  () => cityStore.pendingQuery,
  async (q) => {
    if (!q) return
    isOpen.value = true
    query.value = q
    cityStore.clearPending()
    await handleSearch()
  },
)

const emit = defineEmits(['changed'])
const handleRemove = (city) => {
  cityStore.removeCity(city.id)
  message.value = `${city.name} 을(를) 목록에서 뺐습니다.`
  emit('changed')
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h3>📍 내 지역</h3>
      <Button variant="ghost" size="sm" @click="isOpen = !isOpen">
        {{ isOpen ? '닫기' : '지역 추가·삭제' }}
      </Button>
    </div>

    <!-- 현재 목록 -->
    <div class="mt-3 flex flex-wrap gap-1.5">
      <span
        v-for="city in cityStore.cities"
        :key="city.id"
        class="inline-flex items-center gap-1 rounded-full border border-border bg-background py-1 pl-3 pr-1.5 text-xs"
      >
        {{ city.name }}
        <button
          v-if="isOpen"
          type="button"
          class="grid h-4 w-4 place-items-center rounded-full text-muted-foreground hover:bg-destructive hover:text-white"
          :aria-label="`${city.name} 삭제`"
          @click="handleRemove(city)"
        >
          ×
        </button>
      </span>
      <span v-if="cityStore.count === 0" class="text-xs text-muted-foreground">
        목록이 비었습니다. 아래에서 지역을 추가해 주세요.
      </span>
    </div>

    <!-- 추가 패널 -->
    <div v-if="isOpen" class="mt-4 rounded-md border border-border bg-background p-4">
      <form class="flex gap-2" @submit.prevent="handleSearch">
        <input
          v-model="query"
          type="text"
          class="flex-1 rounded-md border border-input px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          placeholder="추가할 지역 이름 (예: 광주, 제주, Busan)"
          aria-label="추가할 지역 검색"
        />
        <Button type="submit" size="sm" :disabled="isSearching">
          {{ isSearching ? '찾는 중' : '검색' }}
        </Button>
      </form>

      <ul v-if="results.length" class="mt-3 space-y-1">
        <li
          v-for="city in results"
          :key="city.id"
          class="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
        >
          <span>
            {{ city.name }}
            <span class="ml-1 text-xs text-muted-foreground"
              >{{ city.originalName }} · {{ city.region }}</span
            >
          </span>
          <Button
            v-if="!cityStore.has(city.id)"
            variant="outline"
            size="sm"
            @click="handleAdd(city)"
            >추가</Button
          >
          <span v-else class="text-xs text-muted-foreground">이미 있음</span>
        </li>
      </ul>

      <p v-if="message" class="mt-3 text-xs text-muted-foreground">{{ message }}</p>

      <button
        type="button"
        class="mt-3 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        @click="cityStore.resetCities()"
      >
        기본 목록으로 되돌리기
      </button>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #34495e;
}
</style>
