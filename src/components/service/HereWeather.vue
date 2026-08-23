<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useCityStore } from '@/stores/cityStore'
import { useHereStore } from '@/stores/hereStore'

const router = useRouter()
const configStore = useConfigStore()
const cityStore = useCityStore()
const hereStore = useHereStore()

const placeName = computed(
  () => hereStore.city?.name || configStore.t('here.unnamed'),
)
const temp = computed(() =>
  hereStore.weather ? configStore.convertTemp(hereStore.weather.temp) : null,
)

// 상태마다 눌렀을 때 할 일이 다르다
const label = computed(() => {
  if (hereStore.isBusy) return configStore.t('here.loading')
  if (hereStore.status === 'denied') return configStore.t('here.denied')
  if (hereStore.status === 'failed') return configStore.t('here.failed')
  if (hereStore.hasWeather) return placeName.value
  return configStore.t('here.ask')
})

const title = computed(() => {
  if (hereStore.status === 'denied') return configStore.t('here.deniedTitle')
  if (hereStore.status === 'failed') return configStore.t('here.failedTitle')
  if (hereStore.hasWeather) return configStore.t('here.goTitle', { name: placeName.value })
  return configStore.t('here.askTitle')
})

const handleClick = () => {
  // 거절한 사람에게 다시 조르지 않는다. 브라우저 설정에서 풀어야 하는 상태다.
  if (hereStore.status === 'denied' || hereStore.isBusy) return

  if (hereStore.hasWeather) {
    // 이미 받아 뒀으면 그곳을 메인 화면에 펼친다
    cityStore.addCity({ ...hereStore.city })
    router.push({ path: '/', query: { city: hereStore.city.id } })
    return
  }
  hereStore.load()
}

// 이미 허용해 둔 브라우저에서만 조용히 불러온다
onMounted(() => hereStore.loadIfAllowed())

// 언어를 바꾸면 지역 이름과 날씨 설명도 그 언어로 다시 받는다
watch(() => configStore.lang, () => hereStore.reload())
</script>

<template>
  <!--
    지금 있는 곳의 날씨.

    들어오자마자 위치를 묻지 않는다. 무슨 사이트인지 알기도 전에 권한 팝업이 뜨면
    일단 거절하게 되고, 한 번 거절하면 브라우저 설정을 열기 전까지 되돌릴 수 없다.
    그래서 처음에는 누를 수 있는 글자 하나로 두고, 이미 허용해 둔 적이 있으면
    묻지 않고 바로 불러온다.
  -->
  <button
    type="button"
    class="here"
    :class="[hereStore.status, { has: hereStore.hasWeather }]"
    :disabled="hereStore.status === 'denied'"
    :title="title"
    @click="handleClick"
  >
    <!-- 위치 표시. 받아오는 동안 바깥 고리가 돌고, 다 받으면 가운데 점이 자리를 잡는다 -->
    <svg class="pin" viewBox="0 0 16 16" aria-hidden="true">
      <circle class="ring" cx="8" cy="8" r="5.5" />
      <circle class="dot" cx="8" cy="8" r="1.75" />
    </svg>

    <span class="label">{{ label }}</span>

    <span v-if="hereStore.hasWeather" class="temp tnum">
      {{ temp }}<i>{{ configStore.unitSymbol }}</i>
    </span>
  </button>
</template>

<style scoped>
.here {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px 4px 6px;
  font-family: inherit;
  font-size: 11.5px;
  font-weight: 500;
  line-height: 1;
  color: var(--color-ink-3);
  white-space: nowrap;
  background: none;
  border: 1px solid transparent;
  border-radius: 2px;
  cursor: pointer;
  transition:
    color 0.14s ease,
    border-color 0.14s ease;
}
.here:hover:not(:disabled) {
  color: var(--color-ink);
  border-color: var(--color-line);
}
.here:disabled {
  cursor: default;
  opacity: 0.55;
}

/* 날씨를 받아 온 뒤에는 이름과 기온이 또렷하게 읽혀야 한다 */
.here.has {
  color: var(--color-ink-2);
}
.here.has .label {
  color: var(--color-ink);
}
.here.has:hover {
  border-color: var(--color-line-2);
}

.pin {
  width: 12px;
  height: 12px;
  flex: none;
  overflow: visible;
}
.ring {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.2;
  opacity: 0.45;
}
.dot {
  fill: currentColor;
  opacity: 0.55;
  transform-origin: center;
}
.here.has .dot {
  opacity: 1;
  /* 자리를 잡았다는 표시로 한 번만 짚어 준다 */
  animation: settle 0.5s ease-out;
}
.here.has .ring {
  opacity: 0.7;
}

/* 받아오는 동안에는 고리만 돈다. 점은 가운데 그대로 있는다 */
.here.loading .ring {
  stroke-dasharray: 8 26;
  transform-origin: center;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes settle {
  0% {
    transform: scale(2.4);
    opacity: 0;
  }
  60% {
    transform: scale(0.85);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.temp {
  font-weight: 600;
  color: var(--color-ink);
}
.temp i {
  margin-left: 1px;
  font-size: 9px;
  font-style: normal;
  color: var(--color-ink-3);
}

@media (prefers-reduced-motion: reduce) {
  .here.loading .ring,
  .here.has .dot {
    animation: none;
  }
}
</style>
