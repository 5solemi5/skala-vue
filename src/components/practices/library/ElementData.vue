<script setup>
import { ref } from 'vue'

const productQuantity = ref(1) // 수량 카운터 기본값
const productRate = ref(4) // 별점 기본값 (별 4개)
</script>

<template>
  <div class="practice-section">
    <h2>🧪 Element Plus - 수량 &amp; 별점</h2>

    <el-card class="box-card">
      <template #header><strong>🛒 커머스 상품 수량 및 평점 시스템</strong></template>
      <div class="card-body">
        <div class="input-group">
          <span>구매 수량 선택:</span>
          <el-input-number v-model="productQuantity" :min="1" :max="10" />
          <span class="hint-text">(최대 10개 구매 가능)</span>
        </div>

        <div class="input-group">
          <span>상품 만족도 별점:</span>
          <el-rate v-model="productRate" show-score score-template="{value} 점" />
        </div>

        <div class="result-preview">
          🟢 <strong>실시간 요약:</strong> 선택 수량 {{ productQuantity }}개 / 내가 준 점수
          {{ productRate }}점
        </div>
      </div>
    </el-card>

    <div class="monitor">
      <small style="color: gray">
        ※ el-input-number 는 :min / :max 로 범위를 강제한다. 직접 타이핑해도 범위를 벗어나면 자동
        보정된다.
      </small>
    </div>
  </div>
</template>

<style scoped>
.box-card {
  border-radius: 8px;
}
.card-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}
.hint-text {
  font-size: 12px;
  color: #909399;
}
.result-preview {
  padding: 12px;
  background: #f0f9eb;
  border-radius: 6px;
  font-size: 14px;
}
</style>
