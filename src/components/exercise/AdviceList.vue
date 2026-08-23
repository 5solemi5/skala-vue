<script setup>
// [요구사항 7] 내가 추가로 분리한 컴포넌트 - 오늘의 채비 목록
defineProps({
  adviceList: {
    type: Array,
    required: true,
  },
})

// 판정 등급별 아이콘과 색 계열
const iconMap = {
  stop: '⛔',
  warn: '⚠️',
  good: '✅',
  info: '📌',
}
const toneMap = {
  stop: 'border-l-red-500 bg-red-50',
  warn: 'border-l-amber-500 bg-amber-50',
  good: 'border-l-emerald-500 bg-emerald-50',
  info: 'border-l-blue-500 bg-blue-50',
}
</script>

<template>
  <div class="my-4 flex-1">
    <p class="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground">오늘의 채비</p>
    <div
      v-for="(advice, index) in adviceList"
      :key="index"
      class="mb-1.5 rounded-md border-l-[3px] px-3 py-2"
      :class="toneMap[advice.level]"
    >
      <p class="text-[13.5px] font-semibold text-foreground">
        {{ iconMap[advice.level] }} {{ advice.title }}
      </p>
      <p class="mt-0.5 text-xs leading-relaxed text-muted-foreground">{{ advice.desc }}</p>
    </div>
  </div>
</template>
