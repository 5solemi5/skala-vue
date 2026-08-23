<script setup>
defineProps({
  modeList: { type: Array, required: true },
  currentMode: { type: String, required: true },
})
defineEmits(['change-mode'])
</script>

<template>
  <div class="modebar">
    <p class="eyebrow">무엇을 볼까요</p>
    <div class="seg" role="tablist" aria-label="하는 일 선택">
      <button
        v-for="mode in modeList"
        :key="mode.id"
        type="button"
        role="tab"
        :aria-selected="currentMode === mode.id"
        class="seg-item"
        :class="{ on: currentMode === mode.id }"
        @click="$emit('change-mode', mode.id)"
      >
        <span class="what">{{ mode.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.modebar {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
}
.eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--color-ink-3);
  white-space: nowrap;
}
.seg {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}
.seg-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px 2px 10px;
  margin-right: 24px;
  font-family: inherit;
  text-align: left;
  color: var(--color-ink-3);
  background: none;
  border: 0;
  cursor: pointer;
  transition: color 0.15s ease;
}
.what {
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
}
.seg-item:last-child {
  margin-right: 0;
}
.seg-item:hover {
  color: var(--color-ink-2);
}
.seg-item.on .what {
  color: var(--color-ink);
  font-weight: 600;
}
/* 선택된 항목만 아래에 굵은 밑줄 */
.seg-item.on::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--color-ink);
}

/* 일곱 가지가 한 줄에 안 들어가는 폭에서는 간격을 좁혀 두 줄로 접는다 */
@media (max-width: 560px) {
  .seg-item {
    margin-right: 16px;
    padding-bottom: 8px;
  }
  .what {
    font-size: 14px;
  }
}
</style>
