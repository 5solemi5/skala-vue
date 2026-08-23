<script setup>
// 1. 정의한 카운터 스토어 import
import { useCounterStore } from '@/stores/counter.js'

// 2. 인스턴스 가동 (전역 저장소 포인터 확보)
const counterStore = useCounterStore()
</script>

<template>
  <div class="practice-section">
    <h2>Counter Store 활용 실습</h2>

    <p>
      원본 카운트 데이터(state): <strong>{{ counterStore.count }}</strong>
    </p>
    <p>
      2배 연산 데이터(getters): <span>{{ counterStore.doubleCount }}</span>
    </p>

    <button @click="counterStore.increment">숫자 1 증가 (actions)</button>

    <div class="monitor">
      <small style="color: gray">
        ※ Vue Devtools 의 Pinia 탭을 열어두면 버튼을 누를 때마다 count 값이 바뀌는 것을 볼 수 있다.
        state 를 직접 수정해 화면이 따라 바뀌는 것도 확인할 수 있다.
      </small>
    </div>
  </div>
</template>
