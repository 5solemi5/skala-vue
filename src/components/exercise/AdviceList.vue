<script setup>
// [요구사항 7] 내가 추가로 분리한 컴포넌트 - 오늘의 채비 목록
defineProps({
  adviceList: {
    type: Array,
    required: true,
  },
})

// 판정 등급별 아이콘
const iconMap = {
  stop: '⛔',
  warn: '⚠️',
  good: '✅',
  info: '📌',
}
</script>

<template>
  <div class="advice-box">
    <p class="advice-title">오늘의 채비</p>
    <div v-for="(advice, index) in adviceList" :key="index" class="advice" :class="advice.level">
      <p class="advice-head">{{ iconMap[advice.level] }} {{ advice.title }}</p>
      <p class="advice-desc">{{ advice.desc }}</p>
    </div>
  </div>
</template>

<style scoped>
.advice-box {
  flex: 1;
  margin: 14px 0;
}
.advice-title {
  margin: 0 0 8px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #adb5bd;
}
.advice {
  padding: 9px 11px;
  margin-bottom: 6px;
  border-radius: 8px;
  border-left: 3px solid #ced4da;
  background-color: #f8f9fa;
}
.advice.stop {
  border-left-color: #e03131;
  background-color: #fff5f5;
}
.advice.warn {
  border-left-color: #f08c00;
  background-color: #fff9db;
}
.advice.good {
  border-left-color: #2f9e44;
  background-color: #f4fce3;
}
.advice.info {
  border-left-color: #1971c2;
  background-color: #f1f6fb;
}
.advice-head {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  color: #2c3e50;
}
.advice-desc {
  margin: 3px 0 0;
  font-size: 12.5px;
  color: #6c757d;
  line-height: 1.5;
}
</style>
