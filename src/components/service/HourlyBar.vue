<script setup>
import { computed } from 'vue'
import { scoreHour, findBestWindow } from '@/utils/hourlyScore'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const props = defineProps({
  rows: { type: Array, default: () => [] },
  mode: { type: String, required: true },
  modeLabel: { type: String, default: '' },
  compact: { type: Boolean, default: false },
})

const scored = computed(() =>
  props.rows.map((row) => ({
    ...row,
    level: scoreHour(row, props.mode),
    displayTemp: configStore.convertTemp(row.temp),
  })),
)

const best = computed(() => findBestWindow(props.rows, props.mode))

const summary = computed(() => {
  if (!best.value) return '오늘은 여유로운 시간대가 없습니다'
  const from = String(best.value.from).padStart(2, '0')
  const to = String(best.value.to).padStart(2, '0')
  return from === to ? `${from}시가 가장 낫습니다` : `${from}시 ~ ${to}시가 낫습니다`
})
</script>

<template>
  <figure class="hourly" :class="{ compact }">
    <figcaption class="cap">
      <span class="label">시간대</span>
      <span class="best">{{ summary }}</span>
    </figcaption>

    <div class="scroll">
      <div class="track">
        <div v-for="row in scored" :key="row.time" class="slot" :class="row.level">
          <span v-if="!compact" class="hh tnum">{{ row.hour }}</span>
          <span class="bar"></span>
          <span v-if="!compact" class="tt tnum">{{ row.displayTemp }}</span>
        </div>
      </div>
    </div>

    <p v-if="!compact" class="legend">
      <span class="key good">양호</span>
      <span class="key warn">주의</span>
      <span class="key stop">중지</span>
      <span class="note">아래 숫자는 기온</span>
    </p>
  </figure>
</template>

<style scoped>
.hourly {
  margin: 0;
}
.cap {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.label {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--color-ink-3);
}
.best {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink-2);
}
.scroll {
  overflow-x: auto;
  scrollbar-width: thin;
}
.track {
  display: flex;
  gap: 3px;
  min-width: max-content;
}
.slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-width: 26px;
}
.hh,
.tt {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-ink-4);
}
.tt {
  color: var(--color-ink-3);
}
.bar {
  width: 100%;
  height: 30px;
  border-radius: 2px;
  background: var(--color-paper-3);
}
.slot.good .bar {
  background: var(--color-good);
}
.slot.warn .bar {
  background: var(--color-warn);
}
.slot.stop .bar {
  background: var(--color-stop);
}
.compact .bar {
  height: 14px;
}
.compact .slot {
  min-width: 0;
  flex: 1;
}
.legend {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 12px 0 0;
  font-size: 11px;
  color: var(--color-ink-3);
}
.key {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.key::before {
  content: '';
  width: 9px;
  height: 9px;
  border-radius: 2px;
}
.key.good::before {
  background: var(--color-good);
}
.key.warn::before {
  background: var(--color-warn);
}
.key.stop::before {
  background: var(--color-stop);
}
.note {
  margin-left: auto;
  color: var(--color-ink-4);
}
</style>
