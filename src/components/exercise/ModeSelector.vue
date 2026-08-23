<script setup>
// [요구사항 7] 내가 추가로 분리한 컴포넌트 - 하는 일 선택 영역
defineEmits(['change-mode'])

defineProps({
  modeList: {
    type: Array,
    required: true,
  },
  currentMode: {
    type: String,
    required: true,
  },
  alertCount: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="mode-inner">
    <h3>🧰 오늘 무슨 일을 하시나요?</h3>
    <div class="mode-list">
      <button
        v-for="mode in modeList"
        :key="mode.id"
        class="mode-btn"
        :class="{ on: currentMode === mode.id }"
        @click="$emit('change-mode', mode.id)"
      >
        {{ mode.label }}
      </button>
    </div>
    <p class="summary" :class="{ ok: alertCount === 0 }">
      <span v-if="alertCount > 0">⛔ 지금 보이는 지역 중 <strong>{{ alertCount }}곳</strong>은 오늘 작업을 미루시는 편이 낫습니다.</span>
      <span v-else>✅ 지금 보이는 지역은 모두 작업에 무리가 없습니다.</span>
    </p>
  </div>
</template>

<style scoped>
h3 {
  margin: 0 0 10px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #34495e;
}
.mode-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.mode-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.mode-btn:hover {
  border-color: #adb5bd;
}
.mode-btn.on {
  color: #ffffff;
  background-color: #35495e;
  border-color: #35495e;
}
.summary {
  margin: 12px 0 0;
  padding: 10px 14px;
  font-size: 13.5px;
  background-color: #fff5f5;
  border-left: 3px solid #e03131;
  border-radius: 6px;
}
.summary.ok {
  background-color: #f4fce3;
  border-left-color: #2f9e44;
  color: #2f9e44;
}
</style>
