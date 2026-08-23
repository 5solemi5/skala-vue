<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

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
    <span class="who">
      <i v-if="lead" class="pip" :class="lead.level" aria-hidden="true"></i>
      {{ person.who }}
    </span>

    <span class="place">
      {{ person.city.name }}
      <i class="dot" aria-hidden="true">·</i>
      <span class="job">{{ modeLabel }}</span>
    </span>

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

    <span v-if="lead" class="say">{{ lead.title }}</span>
  </button>
</template>

<style scoped>
.person {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 18px 22px;
  font-family: inherit;
  text-align: left;
  background: var(--color-paper);
  border: 0;
  cursor: pointer;
  transition: background 0.14s ease;
}
.person:hover {
  background: var(--color-paper-2);
}
.person.on {
  background: var(--color-paper-2);
}

/*
 * 처음엔 카드 위에 판정 색 막대를 깔았는데,
 * 네 곳이 모두 같은 등급이면 빨간 줄이 나란히 서서 경고판처럼 보였다.
 * 색은 문구에만 남기고 여기서는 작은 점 하나로 알린다.
 */

/* 지금 보고 있는 사람은 왼쪽에 잉크 선으로 표시 */
.person.on::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-ink);
}

.who {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
/* 판정 등급을 알리는 작은 점. 지금 보고 있는 카드에서는 옅게 빛난다. */
.pip {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex: none;
  background: var(--color-line-2);
}
.pip.stop {
  background: var(--color-stop);
}
.pip.warn {
  background: var(--color-warn);
}
.pip.good {
  background: var(--color-good);
}
.person.on .pip {
  box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 0%, transparent);
}
.person.on .pip.stop {
  box-shadow: 0 0 0 3px rgba(158, 43, 37, 0.16);
}
.person.on .pip.warn {
  box-shadow: 0 0 0 3px rgba(140, 99, 24, 0.16);
}
.person.on .pip.good {
  box-shadow: 0 0 0 3px rgba(31, 97, 82, 0.16);
}
.place {
  margin-top: 4px;
  padding-left: 14px;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--color-ink-2);
}
.place .dot {
  margin: 0 3px;
  font-style: normal;
  color: var(--color-ink-4);
}
.place .job {
  font-weight: 400;
  color: var(--color-ink-3);
}

.now {
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 15px 0 13px;
  padding-left: 14px;
}
.deg {
  font-size: 29px;
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1;
}
.deg i {
  font-size: 12px;
  font-weight: 500;
  font-style: normal;
  color: var(--color-ink-3);
  margin-left: 1px;
}
.now img {
  width: 30px;
  height: 30px;
  opacity: 0.8;
}
.now.dim {
  font-size: 12px;
  color: var(--color-ink-4);
}

.say {
  padding-left: 14px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--color-ink-2);
}
.person.stop .say {
  color: var(--color-stop);
}
.person.warn .say {
  color: var(--color-warn);
}
.person.good .say {
  color: var(--color-good);
}
</style>
