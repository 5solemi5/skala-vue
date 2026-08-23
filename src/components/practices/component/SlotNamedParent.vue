<script setup>
import SlotNamedChild from './SlotNamedChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Named Slot 주입 실습</h2>
    <SlotNamedChild>
      <template v-slot:header>
        <h3>Child 주입 제목</h3>
      </template>
      <p>이름 없는 기본 슬롯으로 들어가는 본문 영역입니다. header 슬롯과 자리가 나뉘어 배치됩니다.</p>
    </SlotNamedChild>
  </div>
</template>
