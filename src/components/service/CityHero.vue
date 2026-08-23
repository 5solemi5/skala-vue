<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { groupOf } from '@/utils/weatherCondition'
import VerdictMark from './VerdictMark.vue'
import HourlyBar from './HourlyBar.vue'

const configStore = useConfigStore()

const props = defineProps({
  city: { type: Object, default: null },
  adviceList: { type: Array, default: () => [] },
  hourlyRows: { type: Array, default: () => [] },
  statusText: { type: String, default: '' },
})

defineEmits(['open-detail'])

const displayTemp = computed(() => (props.city ? configStore.convertTemp(props.city.temp) : 0))

// 가장 무거운 판정 하나를 대표로 세운다. 나머지는 아래에 목록으로.
const order = { stop: 0, warn: 1, info: 2, good: 3 }
const sorted = computed(() => [...props.adviceList].sort((a, b) => order[a.level] - order[b.level]))
const lead = computed(() => sorted.value[0] ?? null)
// description 이 비어 있을 때만 쓰는 대체 표기
const conditionLabel = computed(() =>
  props.city ? configStore.t(`cond.${groupOf(props.city.condition)}`) : '',
)
const rest = computed(() => sorted.value.slice(1))
</script>

<template>
  <section v-if="city" class="hero" :class="lead?.level">
    <div class="top">
      <div class="place">
        <p class="region">{{ city.region }}</p>
        <h2>{{ city.name }}</h2>
        <p class="cond">
          {{ city.description ?? conditionLabel }}
          <span class="sep">·</span>
          {{ configStore.t('hero.humidity') }} <span class="tnum">{{ city.humidity }}%</span>
          <span class="sep">·</span>
          {{ configStore.t('hero.rainProb') }} <span class="tnum">{{ city.rainProb }}%</span>
        </p>
      </div>

      <div class="temp">
        <img
          v-if="city.icon"
          :src="`https://openweathermap.org/img/wn/${city.icon}@2x.png`"
          :alt="city.description"
          class="ico"
        />
        <p class="deg tnum">
          {{ displayTemp }}<span class="unit">{{ configStore.unitSymbol }}</span>
        </p>
        <p class="band">
          <span v-if="city.temp >= 25">{{ configStore.t('hero.hot') }}</span>
          <span v-else>{{ configStore.t('hero.mild') }}</span>
        </p>
      </div>
    </div>

    <div v-if="lead" class="verdict">
      <VerdictMark :level="lead.level" size="lg" />
      <h3>{{ lead.title }}</h3>
      <p class="reason">{{ lead.desc }}</p>
    </div>

    <ul v-if="rest.length" class="rest">
      <li v-for="(advice, i) in rest" :key="i">
        <VerdictMark :level="advice.level" />
        <span class="t">{{ advice.title }}</span>
        <span class="d">{{ advice.desc }}</span>
      </li>
    </ul>

    <HourlyBar
      v-if="hourlyRows.length"
      class="hb"
      :rows="hourlyRows"
      :mode="configStore.currentMode"
    />

    <div class="foot">
      <p class="status" aria-live="polite">{{ statusText }}</p>
      <button type="button" class="more" @click="$emit('open-detail', city)">
        {{ configStore.t('hero.detail') }}
        <span aria-hidden="true">→</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 28px 30px 22px;
  background: var(--color-paper);
  border: 1px solid var(--color-line);
  border-radius: 6px;
}
/* 판정 등급을 왼쪽 세로선 하나로만 표시한다 */
.hero::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 6px 0 0 6px;
  background: var(--color-line-2);
}
.hero.stop::before {
  background: var(--color-stop);
}
.hero.warn::before {
  background: var(--color-warn);
}
.hero.good::before {
  background: var(--color-good);
}

.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}
.region {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--color-ink-3);
}
h2 {
  margin: 3px 0 0;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.cond {
  margin: 8px 0 0;
  font-size: 13.5px;
  color: var(--color-ink-2);
}
.sep {
  margin: 0 6px;
  color: var(--color-ink-4);
}

.temp {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: none;
}
.ico {
  width: 52px;
  height: 52px;
  margin-bottom: -8px;
  opacity: 0.85;
}
.deg {
  margin: 0;
  font-size: 60px;
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 0.9;
}
.unit {
  margin-left: 2px;
  font-size: 22px;
  font-weight: 500;
  color: var(--color-ink-3);
}
.band {
  margin: 10px 0 0;
  font-size: 11.5px;
  color: var(--color-ink-3);
}

.verdict {
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid var(--color-line);
}
.verdict h3 {
  margin: 10px 0 0;
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.015em;
}
.reason {
  margin: 5px 0 0;
  font-size: 14px;
  color: var(--color-ink-2);
  line-height: 1.65;
}

.rest {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.rest li {
  display: flex;
  align-items: baseline;
  gap: 9px;
  flex-wrap: wrap;
  font-size: 13px;
}
.rest .t {
  font-weight: 500;
}
.rest .d {
  color: var(--color-ink-3);
  font-size: 12.5px;
}

.hb {
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid var(--color-line);
}

.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid var(--color-line);
}
.status {
  margin: 0;
  font-size: 12px;
  color: var(--color-ink-3);
}
.more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink);
  background: none;
  border: 0;
  border-bottom: 1px solid var(--color-line-2);
  padding-bottom: 2px;
  cursor: pointer;
  white-space: nowrap;
}
.more:hover {
  border-bottom-color: var(--color-ink);
}

@media (max-width: 640px) {
  .hero {
    padding: 22px 20px 18px;
  }
  .top {
    gap: 14px;
  }
  h2 {
    font-size: 24px;
  }
  .deg {
    font-size: 44px;
  }
  .ico {
    width: 40px;
    height: 40px;
  }
  .verdict h3 {
    font-size: 18px;
  }
}
</style>
