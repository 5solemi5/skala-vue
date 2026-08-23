<script setup>
defineProps({
  modeList: { type: Array, required: true },
  currentMode: { type: String, required: true },
})
defineEmits(['change-mode'])

// 라벨에서 이모지를 떼고 글자만 쓴다
const plain = (label) => label.replace(/[^가-힣a-zA-Z]/g, '')
</script>

<template>
  <div class="modebar">
    <p class="eyebrow">오늘 나는</p>
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
        {{ plain(mode.label) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.modebar {
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}
.eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--color-ink-3);
  white-space: nowrap;
}
.seg {
  display: flex;
  gap: 2px;
}
.seg-item {
  position: relative;
  padding: 6px 2px 10px;
  margin-right: 20px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-ink-3);
  background: none;
  border: 0;
  cursor: pointer;
  transition: color 0.15s ease;
}
.seg-item:last-child {
  margin-right: 0;
}
.seg-item:hover {
  color: var(--color-ink-2);
}
.seg-item.on {
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
</style>
