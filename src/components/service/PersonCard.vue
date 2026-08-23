<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import VerdictMark from './VerdictMark.vue'

const configStore = useConfigStore()

const props = defineProps({
  person: { type: Object, required: true },
  weather: { type: Object, default: null },
  adviceList: { type: Array, default: () => [] },
  selected: { type: Boolean, default: false },
  modeLabel: { type: String, default: '' },
})

defineEmits(['select'])

const order = { stop: 0, warn: 1, info: 2, good: 3 }
const lead = computed(
  () => [...props.adviceList].sort((a, b) => order[a.level] - order[b.level])[0],
)
const displayTemp = computed(() =>
  props.weather ? configStore.convertTemp(props.weather.temp) : null,
)
</script>

<template>
  <button
    type="button"
    class="person"
    :class="[lead?.level, { on: selected }]"
    :aria-pressed="selected"
    @click="$emit('select', person)"
  >
    <span class="who">{{ person.who }}</span>
    <span class="what">{{ modeLabel }} · {{ person.city.name }}</span>

    <span v-if="weather" class="now">
      <span class="deg tnum"
        >{{ displayTemp }}<i>{{ configStore.unitSymbol }}</i></span
      >
      <img
        v-if="weather.icon"
        :src="`https://openweathermap.org/img/wn/${weather.icon}.png`"
        :alt="weather.description"
      />
    </span>
    <span v-else class="now dim">불러오는 중</span>

    <VerdictMark v-if="lead" :level="lead.level" />
    <span v-if="lead" class="say">{{ lead.title }}</span>
  </button>
</template>

<style scoped>
.person {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  padding: 16px 16px 18px;
  font-family: inherit;
  text-align: left;
  background: var(--color-paper);
  border: 0;
  cursor: pointer;
  transition: background 0.12s ease;
}
.person:hover {
  background: var(--color-paper-2);
}
.person.on {
  background: var(--color-paper-2);
}
/* 선택된 사람만 위쪽에 굵은 선 */
.person.on::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: var(--color-ink);
}
.person.stop::after,
.person.warn::after,
.person.good::after {
  content: '';
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 0;
  height: 2px;
}
.person.stop::after {
  background: var(--color-stop);
}
.person.warn::after {
  background: var(--color-warn);
}
.person.good::after {
  background: var(--color-good);
}

.who {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.015em;
}
.what {
  font-size: 11px;
  color: var(--color-ink-3);
}
.now {
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 8px 0 10px;
}
.deg {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.03em;
}
.deg i {
  font-size: 12px;
  font-weight: 500;
  font-style: normal;
  color: var(--color-ink-3);
  margin-left: 1px;
}
.now img {
  width: 28px;
  height: 28px;
  opacity: 0.8;
}
.now.dim {
  font-size: 12px;
  color: var(--color-ink-4);
}
.say {
  margin-top: 7px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-ink-2);
}
</style>
