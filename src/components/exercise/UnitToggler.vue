<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <button
    type="button"
    class="unit"
    :aria-label="`온도 단위 전환. 현재 ${configStore.unit === 'celsius' ? '섭씨' : '화씨'}`"
    @click="configStore.toggleUnit"
  >
    <span :class="{ on: configStore.unit === 'celsius' }">℃</span>
    <span :class="{ on: configStore.unit === 'fahrenheit' }">℉</span>
  </button>
</template>

<style scoped>
.unit {
  display: inline-flex;
  padding: 2px;
  font-family: inherit;
  background: var(--color-paper-3);
  border: 0;
  border-radius: 3px;
  cursor: pointer;
}
.unit span {
  padding: 3px 8px;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--color-ink-3);
  border-radius: 2px;
  transition: all 0.12s ease;
}
.unit span.on {
  color: var(--color-ink);
  background: var(--color-paper);
  box-shadow: 0 1px 2px rgba(16, 28, 38, 0.08);
}
</style>
