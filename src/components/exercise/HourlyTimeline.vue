<script setup>
import { computed } from 'vue'
import { scoreHour, findBestWindow } from '@/utils/hourlyScore'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const props = defineProps({
  rows: { type: Array, default: () => [] },
  mode: { type: String, required: true },
  modeLabel: { type: String, default: '' },
})

const scored = computed(() =>
  props.rows.map((row) => ({
    ...row,
    level: scoreHour(row, props.mode),
    displayTemp: configStore.convertTemp(row.temp),
  })),
)

const best = computed(() => findBestWindow(props.rows, props.mode))

const toneMap = {
  stop: 'bg-red-400',
  warn: 'bg-amber-400',
  good: 'bg-emerald-400',
}
const labelMap = {
  stop: '피하세요',
  warn: '주의',
  good: '괜찮음',
}
</script>

<template>
  <div>
    <p v-if="best" class="best">
      ⏰ 오늘 {{ modeLabel }} 하기 좋은 시간은
      <b>{{ String(best.from).padStart(2, '0') }}시 ~ {{ String(best.to).padStart(2, '0') }}시</b>
      입니다.
    </p>
    <p v-else class="best none">오늘은 {{ modeLabel }} 하기에 여유로운 시간대가 없습니다.</p>

    <div class="scroll">
      <div class="track">
        <div v-for="row in scored" :key="row.time" class="slot">
          <span class="time">{{ row.time }}</span>
          <span class="bar" :class="toneMap[row.level]" :title="labelMap[row.level]"></span>
          <span class="temp">{{ row.displayTemp }}{{ configStore.unitSymbol }}</span>
          <span class="rain">{{ row.rainProb }}%</span>
        </div>
      </div>
    </div>

    <ul class="legend">
      <li><i class="bg-emerald-400"></i> 괜찮음</li>
      <li><i class="bg-amber-400"></i> 주의</li>
      <li><i class="bg-red-400"></i> 피하세요</li>
      <li class="hint">아래 숫자는 기온 / 강수확률</li>
    </ul>
  </div>
</template>

<style scoped>
.best {
  margin: 0 0 14px;
  padding: 10px 14px;
  font-size: 13.5px;
  background: #f4fce3;
  border-left: 3px solid #2f9e44;
  border-radius: 6px;
}
.best.none {
  background: #fff9db;
  border-left-color: #f08c00;
}
.scroll {
  overflow-x: auto;
  padding-bottom: 6px;
}
.track {
  display: flex;
  gap: 4px;
  min-width: max-content;
}
.slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-width: 42px;
}
.time {
  font-size: 10.5px;
  color: #adb5bd;
}
.bar {
  width: 100%;
  height: 26px;
  border-radius: 4px;
}
.temp {
  font-size: 12px;
  font-weight: 600;
  color: #495057;
}
.rain {
  font-size: 10.5px;
  color: #adb5bd;
}
.legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  font-size: 11.5px;
  color: #868e96;
}
.legend li {
  display: flex;
  align-items: center;
  gap: 5px;
}
.legend i {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}
.legend .hint {
  color: #ced4da;
}
</style>
