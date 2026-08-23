<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <button class="unit-toggler" :class="{ fahrenheit: configStore.unit === 'fahrenheit' }" @click="configStore.toggleUnit">
    <span class="mark">{{ configStore.unitSymbol }}</span>
    <span class="label">{{ configStore.unit === 'celsius' ? '섭씨' : '화씨' }}</span>
  </button>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px 5px 8px;
  font-size: 13px;
  font-weight: 500;
  color: #495057;
  background-color: #f1f3f5;
  border: 1px solid #dee2e6;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.unit-toggler:hover {
  border-color: #adb5bd;
}
.unit-toggler.fahrenheit {
  color: #ffffff;
  background-color: #f08c00;
  border-color: #f08c00;
}
.mark {
  display: inline-grid;
  place-items: center;
  width: 21px;
  height: 21px;
  font-size: 12px;
  font-weight: 700;
  background-color: #ffffff;
  border-radius: 50%;
  color: #495057;
}
</style>
