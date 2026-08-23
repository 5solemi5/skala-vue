<script setup>
// 상위로 입력 텍스트를 전달할 커스텀 이벤트 등록
defineEmits(['update-query'])

// 상위로부터 현재 검색 상태 값을 수신 (한글 입력 동기화 유지용)
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="search-inner">
    <h3>🔍 도시 검색</h3>
    <input
      type="text"
      class="search-input"
      placeholder="도시 이름을 한글로 입력하세요 (예: 서울)"
      :value="currentQuery"
      @input="$emit('update-query', $event.target.value)"
    />
    <p class="search-result">
      <span v-if="currentQuery">검색 중인 도시: <strong>{{ currentQuery }}</strong></span>
      <span v-else class="dim">검색어를 입력하면 여기에 표시됩니다.</span>
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
.search-input {
  width: 100%;
  padding: 10px 14px;
  font-size: 15px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  outline: none;
}
.search-input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.15);
}
.search-result {
  margin: 8px 2px 0;
  font-size: 14px;
}
.dim {
  color: #adb5bd;
}
</style>
